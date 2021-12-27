import json
from flask.wrappers import Response
from flask_restful import Resource, reqparse
import pandas as pd
from . import labeler, util

#-------------------------------------------------------------------------------
class Dataset(Resource):

    def get(self):
        """
        """
        parser = reqparse.RequestParser()
        parser.add_argument('userid',location='args',type=str,required=True)
        parser.add_argument('dataid',location='args',type=str,required=False)
        args = parser.parse_args()

        try:
            datasets = self.fetch(args['userid'], args['dataid']) 
            _json_ = datasets.to_dict('r')
            _samples_ = Datasample()

            if args['dataid'] != None:
                for n in range(len(_json_)):
                    samples = _samples_.fetch(args['userid'], args['dataid'])
                    _json_[n]['samples'] = samples.to_dict('r')

            return Response(
                json.dumps(_json_),
                200,
                mimetype='application/json'
            )
        
        except ValueError as exp:
            return {'message': str(exp)}, 409

    def put(self):

        parser = reqparse.RequestParser()
        parser.add_argument('userid',location='json',type=str,required=True)
        parser.add_argument('path'  ,location='json',type=str,required=True)
        parser.add_argument('name'  ,location='json',type=str,required=True)
        parser.add_argument('dataid',location='json',type=str,required=False)
        parser.add_argument('status',location='json',type=str,required=False)
        args = parser.parse_args()

        try:
            if args['dataid'] is None: #add
                entry = self.add(args['userid'],args['path'],args['name'])

            else: #modify
                entry = self.modify(args['userid'],args['dataid'],
                    name = args['name'],
                    path = args['path'],
                    status = args['status']
                )
            
            return {'dataset': entry.to_dict('r')}, 200

        except ValueError as exp:
            return {'message': str(exp)}, 409

    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument('userid',location='json',type=str,required=True)
        parser.add_argument('dataid',location='json',type=str,required=True)
        args = parser.parse_args()

        try:
            self.remove(args['userid'],args['dataid'])
            return {}, 200

        except ValueError as exp:
            return {'message': str(exp)}, 409

    """
        Base API: CSV manipulation
    """
    def fetch(self,userid,dataid=None):
        datasets = pd.read_csv(util.db('dataset'))
        records  = datasets[datasets['author'] == str(userid)]

        if dataid != None:
            records = records[records['id'] == dataid] 

        return records

    def remove(self,userid,dataid):
        datasets = pd.read_csv(util.db('dataset'))
        records  = datasets[datasets['author'] == userid]
        
        if str(dataid) in str(records['id']):
            datasets.drop(datasets[
                (datasets['id'] == dataid) & 
                (datasets['author'] == userid)
            ].index, inplace=True)
            
            datasets.to_csv(util.db('dataset'), index=False)

        else:
            raise ValueError(f"Dataset {dataid} does not exist.")

    def add(self,userid,path,name):
        datasets = pd.read_csv(util.db('dataset'))
        records  = datasets[datasets['author'] == userid]

        if str(path) in str(records['path']):
            raise ValueError(f"Dataset path {path} already exists.")

        else:
            dataid   = "DS" + name.upper()
            datasets = datasets.append({
                'id'        : dataid,
                'name'      : name,
                'path'      : path,
                'author'    : userid,
                'createdon' : util.now(),
                'modifiedon': util.now(),
                'modifiedby': userid
            }, ignore_index=True)

            entry = datasets[datasets['id'] == dataid]

            # save to database:
            datasets.to_csv(util.db('dataset'), index=False)

            return entry

    def modify(self,userid,dataid,
        name = None,
        path = None,
        status = None
    ):
        datasets = pd.read_csv(util.db('dataset'))
        records  = datasets[datasets['author'] == userid]

        if str(dataid) not in str(records['id']):
            raise ValueError(f"Dataset {dataid} not found.")

        else:
            row = (datasets['id'] == dataid) & (datasets['author'] == userid)

            if name != None: datasets.loc[row,'name'] = name
            if path != None: datasets.loc[row,'path'] = path
            if status != None: datasets.loc[row,'status'] = status
            
            datasets.loc[row,'modifiedon'] = util.now()
            datasets.loc[row,'modifiedby'] = userid

            datasets.to_csv(util.db('dataset'), index=False)
            entry = datasets[row]

            return entry

#-------------------------------------------------------------------------------
class Datasample(Resource):

    def get(self):
        """
        """
        parser = reqparse.RequestParser()
        parser.add_argument('userid'  ,location='args',type=str,required=True)
        parser.add_argument('dataid'  ,location='args',type=str,required=True)
        parser.add_argument('sampleid',location='args',type=str,required=False)
        args = parser.parse_args()

        try:
            samples = self.fetch(
                args['userid'], args['dataid'], args['sampleid']
            )

            # Append label information for single sample queries:
            _labels_ = labeler.Labels()
            _json_   = samples.to_dict('r')

            if args['sampleid'] != None:
                for n in range(0,len(_json_)):
                    _json_[n]["labels"] = _labels_.fetch(
                        args['userid'], _json_[n]['dataset'], _json_[n]['id']
                    )

            return Response(
                json.dumps(_json_), 
                200,
                mimetype='application/json'
            )
        
        except ValueError as exp:
            return Response(
                json.dumps({'message': str(exp)}), 
                409,
                mimetype='application/json'
            )

    def put(self):

        parser = reqparse.RequestParser()
        parser.add_argument('userid'  ,location='json',type=str,required=True)
        parser.add_argument('dataid'  ,location='json',type=str,required=True)
        parser.add_argument('path'    ,location='json',type=str,required=True)
        parser.add_argument('name'    ,location='json',type=str,required=True)
        parser.add_argument('sampleid',location='json',type=str,required=False)
        parser.add_argument('status'  ,location='json',type=str,required=False,
                                       default='draft')
        parser.add_argument('type'    ,location='json',type=str,required=False,
                                       default="unknown")
        args = parser.parse_args()

        try:
            if args['sampleid'] is None: #add
                entry = self.add(
                    args['userid'],args['dataid'],args['path'],args['name'],
                    args['type']
                )

            else: #modify
                entry = self.modify(
                    args['userid'],args['dataid'],args['sampleid'],
                    name = args['name'],
                    path = args['path'],
                    status = args['status']
                )
            
            return Response(
                json.dumps(entry), 
                200,
                mimetype='application/json'
            )

        except ValueError as exp:
            return Response(
                json.dumps({'message': str(exp)}), 
                409,
                mimetype='application/json'
            )

    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument('userid',location='json',type=str,required=True)
        parser.add_argument('dataid',location='json',type=str,required=True)
        parser.add_argument('sampleid',location='json',type=str,required=False)
        args = parser.parse_args()

        try:
            self.remove(args['userid'],args['dataid'],args['sampleid'])
            return {}, 200

        except ValueError as exp:
            return {'message': str(exp)}, 409

    """
        Base API: CSV manipulation
    """
    def fetch(self,userid,dataid,sampleid=None):
        datasets = pd.read_csv(util.db('dataset'))
        self.__assert_dataset__(datasets,userid,dataid)

        # Read samples:
        samples  = pd.read_csv(util.db('datasample'))
        records  = samples[samples['dataset'] == dataid]

        if sampleid != None:
            records = records[records['id'] == sampleid]

        return records

    def remove(self,userid,dataid,sampleid=None):
        datasets = pd.read_csv(util.db('dataset'))
        self.__assert_dataset__(datasets,userid,dataid)

        samples = pd.read_csv(util.db('datasample'))
        
        if sampleid is None: # remove all
            samples.drop(
                samples[(samples['dataset'] == dataid)].index, 
                inplace=True
            )

        else: # remove specified
            if str(sampleid) in str(samples['id']):
                samples.drop(
                    samples[
                        (samples['id'] == sampleid) & 
                        (samples['dataset'] == dataid)
                    ].index, inplace=True
                )

            else:
                raise ValueError(f"Data sample(s) {sampleid} do not exist.")
        
        # Write back remaining samples:
        samples.to_csv(util.db('datasample'), index=False)

    def add(self,userid,dataid,path,name,kind=None):
        datasets = pd.read_csv(util.db('dataset'))
        self.__assert_dataset__(datasets,userid,dataid)

        samples = pd.read_csv(util.db('datasample'))
        records = samples[samples['dataset'] == dataid]
        
        if str(path) in str(records['path']):
            raise ValueError(f"Data sample at '{path}' already added for {dataid}.")

        else:
            # TODO - Parse metadata and add a metadata entry

            sampleid = "SAM" + name.upper()
            samples  = samples.append({
                'id'        : sampleid,
                'dataset'   : dataid,
                'name'      : name,
                'path'      : path,
                'type'      : kind,
                'metadata'  : None,
                'createdon' : util.now(),
                'modifiedon': util.now(),
                'modifiedby': userid
            }, ignore_index=True)

            entry = samples[samples['id'] == sampleid]

            # save to database:
            samples.to_csv(util.db('datasample'), index=False)

            return entry.to_dict('r')

    def modify(self,userid,dataid,sampleid,
        name = None,
        path = None,
        kind = None,
        status = None
    ):
        datasets = pd.read_csv(util.db('dataset'))
        self.__assert_dataset__(datasets,userid,dataid)

        samples = pd.read_csv(util.db('datasample'))
        record = samples[
            (samples['dataset'] == dataid) & (samples['id'] == sampleid)
        ]

        if record.empty:
            raise ValueError(f"Data sample {sampleid} not found.")

        else:
            row  = (samples['dataset'] == dataid) & (samples['id'] == sampleid)

            if name != None: samples.loc[row,'name'] = name
            if path != None: samples.loc[row,'path'] = path
            if kind != None: samples.loc[row,'type'] = kind
            if status != None: samples.loc[row,'status'] = status
            
            samples.loc[row,'modifiedon'] = util.now()
            samples.loc[row,'modifiedby'] = userid

            samples.to_csv(util.db('datasample'), index=False)
            entry = samples[row]

            return entry.to_dict('r')

    def __assert_dataset__(self,df,userid,dataid):
        df = df[(df['author'] == userid) & (df['id'] == dataid)]
        if df.empty:
            raise ValueError(f"No dataset {dataid} found for user: {userid}.")


