from flask_restful import Resource, reqparse
import pandas as pd
import os
from datetime import datetime
from pathlib import Path

database = {
    'dataset': str(Path(__file__).parent.absolute()) + "/data/dataset.csv",
    'datasample': str(Path(__file__).parent.absolute()) + "/data/datasample.csv"
}

def __now__():
    # Returns current time stamp in YYYY-MM-DD HH:MM:SS format
    stamp = datetime.now()
    stamp = stamp.strftime("%Y-%m-%d %H:%M:%S")
    return stamp

#-------------------------------------------------------------------------------
class Dataset(Resource):

    def get(self):
        """
        """
        parser = reqparse.RequestParser()
        parser.add_argument('userid',location='json',type=str,required=True)
        parser.add_argument('dataid',location='json',type=str,required=False)
        args = parser.parse_args()

        try:
            datasets = self.fetch(args['userid'], args['dataid']) 
            return {
                'datasets': datasets.to_dict('r')
            }, 200
        
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
        datasets = pd.read_csv(database['dataset'])
        records  = datasets[datasets['author'] == str(userid)]

        if records.empty:
            raise ValueError(f"No datasets found for {userid} user.")

        elif dataid != None:
            records = records[records['id'] == dataid] 

        return records

    def remove(self,userid,dataid):
        datasets = pd.read_csv(database['dataset'])
        samples  = pd.read_csv(database['datasample'])
        records  = datasets[datasets['author'] == userid]
        
        if str(dataid) in str(records['id']):
            datasets.drop(datasets[
                (datasets['id'] == dataid) & 
                (datasets['author'] == userid)
            ].index, inplace=True)

            # also remove any data samples stored against the dataset:
            samples.drop(
                samples[samples['dataset'] == str(dataid)].index, 
                inplace=True
            )
            
            samples.to_csv(database['datasample'], index=False)
            datasets.to_csv(database['dataset'], index=False)

        else:
            raise ValueError(f"Dataset {dataid} does not exist.")

    def add(self,userid,path,name):
        datasets = pd.read_csv(database['dataset'])
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
                'createdon' : __now__(),
                'modifiedon': __now__(),
                'modifiedby': userid
            }, ignore_index=True)

            entry = datasets[datasets['id'] == dataid]

            # save to database:
            datasets.to_csv(database['dataset'], index=False)

            return entry

    def modify(self,userid,dataid,
        name = None,
        path = None,
        status = None
    ):
        datasets = pd.read_csv(database['dataset'])
        records  = datasets[datasets['author'] == userid]

        if str(dataid) not in str(records['id']):
            raise ValueError(f"Dataset {dataid} not found.")

        else:
            row = (datasets['id'] == dataid) & (datasets['author'] == userid)

            if name != None: datasets.loc[row,'name'] = name
            if path != None: datasets.loc[row,'path'] = path
            if status != None: datasets.loc[row,'status'] = status
            
            datasets.loc[row,'modifiedon'] = __now__()
            datasets.loc[row,'modifiedby'] = userid

            datasets.to_csv(database['dataset'], index=False)
            entry = datasets[row]

            return entry

#-------------------------------------------------------------------------------
class Datasample(Resource):

    def get(self):
        """
        """
        parser = reqparse.RequestParser()
        parser.add_argument('userid'  ,location='json',type=str,required=True)
        parser.add_argument('dataid'  ,location='json',type=str,required=True)
        parser.add_argument('sampleid',location='json',type=str,required=False)
        args = parser.parse_args()

        try:
            samples = self.fetch(
                args['userid'], args['dataid'], args['sampleid']
            )

            return {
                'samples': samples.to_dict('r')
            }, 200
        
        except ValueError as exp:
            return {'message': str(exp)}, 409

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
            
            return {'sample': entry.to_dict('r')}, 200

        except ValueError as exp:
            return {'message': str(exp)}, 409

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
        datasets = pd.read_csv(database['dataset'])
        self.__assert_dataset__(datasets,userid,dataid)

        # Read samples:
        samples  = pd.read_csv(database['datasample'])
        records  = samples[samples['dataset'] == dataid]

        if sampleid != None:
            records = records[records['id'] == sampleid]
            print(records)

        if records.empty:
            if sampleid == None:
                msg = f"No data samples found for {dataid} dataset."
            else:
                msg = f"Data sample {sampleid} not found for {dataid} dataset."

            raise ValueError(msg)

        else:
            return records

    def remove(self,userid,dataid,sampleid=None):
        datasets = pd.read_csv(database['dataset'])
        self.__assert_dataset__(datasets,userid,dataid)

        samples = pd.read_csv(database['datasample'])
        
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
        samples.to_csv(database['datasample'], index=False)

    def add(self,userid,dataid,path,name,kind=None):
        datasets = pd.read_csv(database['dataset'])
        self.__assert_dataset__(datasets,userid,dataid)

        samples = pd.read_csv(database['datasample'])
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
                'createdon' : __now__(),
                'modifiedon': __now__(),
                'modifiedby': userid
            }, ignore_index=True)

            entry = samples[samples['id'] == sampleid]

            # save to database:
            samples.to_csv(database['datasample'], index=False)

            return entry

    def modify(self,userid,dataid,sampleid,
        name = None,
        path = None,
        kind = None,
        status = None
    ):
        datasets = pd.read_csv(database['dataset'])
        self.__assert_dataset__(datasets,userid,dataid)

        samples = pd.read_csv(database['datasample'])
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
            
            samples.loc[row,'modifiedon'] = __now__()
            samples.loc[row,'modifiedby'] = userid

            samples.to_csv(database['datasample'], index=False)
            entry = samples[row]

            return entry

    def __assert_dataset__(self,df,userid,dataid):
        df = df[(df['author'] == userid) & (df['id'] == dataid)]
        if df.empty:
            raise ValueError(f"No dataset {dataid} found for user: {userid}.")


