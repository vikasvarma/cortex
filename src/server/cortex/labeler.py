from flask import Response
from flask_restful import Resource, reqparse
import pandas as pd
import numpy as np
import json
import os
from model.segmentation import OpenCVSegmenter
from . import util

# -------------------------------------------------------------------------------


class Segmentation(Resource):
    """
    """

    def __init__(self):
        self.dbpath = '/cortex/data/labels.csv'
        self.ocvseg = OpenCVSegmenter()

    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('userid', required=True, type=str)
        parser.add_argument('dataid', required=True, type=str)
        parser.add_argument('imagestream', required=True, type=str)
        parser.add_argument('method', required=True, type=str)
        parser.add_argument('labelid', required=True, type=str)
        parser.add_argument('roi', required=False, type=str, default=None)
        args = parser.parse_args()

        db = pd.read_csv(self.dbpath)

        if str(args['id']) in str(db['id']):
            info = db[db['id'] == args['id']]

            # TODO - raise an error when id is not unique
            assert len(info) == 1

            return {
                'user': info.to_dict('r')
            }, 200

        else:
            return {}, 409

    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id', required=True, type=str)
        args = parser.parse_args()

        db = pd.read_csv(self.dbpath)

        if str(args['id']) in str(db['id']):
            db = db[db['id'] != args['id']]
            db.to_csv(self.dbpath, index=False)

            return {}, 200

        else:
            return {
                'message': f"{args['id']} does not exist."
            }, 409

# -------------------------------------------------------------------------------


class Labels(Resource):

    def get(self):
        """
        """
        parser = reqparse.RequestParser()
        parser.add_argument('labelid' ,location='args',type=str,required=False)
        parser.add_argument('userid'  ,location='args',type=str,required=True)
        parser.add_argument('dataid'  ,location='args',type=str,required=True)
        parser.add_argument('sampleid',location='args',type=str,required=True)
        args = parser.parse_args()

        try:
            labels = self.fetch(
                args['userid'],args['dataid'],args['sampleid'],args['labelid']
            )

            return Response(
                json.dumps(labels,indent=4),
                200,
                mimetype='application/json'
            )

        except ValueError as exp:
            return Response(
                json.dumps({'message': str(exp)},indent=4),
                409,
                mimetype='application/json'
            )

    def put(self):

        parser = reqparse.RequestParser()
        parser.add_argument('labelid' ,location='json',type=str,required=False)
        parser.add_argument('userid'  ,location='json',type=str,required=True)
        parser.add_argument('dataid'  ,location='json',type=str,required=True)
        parser.add_argument('sampleid',location='json',type=str,required=True)
        parser.add_argument('labeldef',location='json',type=str,required=True)
        parser.add_argument('type'    ,location='json',type=str,required=True)
        parser.add_argument('position',location='json',type=list,required=True)
        parser.add_argument('status'  ,location='json',type=str,required=False,
                                       default="draft")
        args = parser.parse_args()

        try:
            if args['labelid'] is None:  # add
                entry = self.add(
                    args['userid'], args['dataid'], args['sampleid'],
                    args['labeldef'], args['type'], args['position'],
                    status=args['status']
                )

            else:  # modify
                entry = self.modify(
                    args['labelid'],args['userid'],args['dataid'],args['sampleid'],
                    position = args['position'], 
                    status = args['status']
                )

            return Response(
                json.dumps(entry,indent=4),
                200,
                mimetype='application/json'
            )

        except ValueError as exp:
            return {'message': str(exp)}, 409

    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument('labelid' ,location='json',type=str,required=False)
        parser.add_argument('userid'  ,location='json',type=str,required=True)
        parser.add_argument('dataid'  ,location='json',type=str,required=True)
        parser.add_argument('sampleid',location='json',type=str,required=True)
        args = parser.parse_args()

        try:
            self.remove(
                args['userid'],args['dataid'],args['sampleid'],args['labelid']
            )

            return Response(
                json.dumps({'message': "success"},indent=4),
                200,
                mimetype='application/json'
            )

        except ValueError as exp:
            return Response(
                json.dumps({'message': str(exp)},indent=4),
                409,
                mimetype='application/json'
            )

    """
        Base API: CSV manipulation
    """

    def fetch(self, userid, dataid, sampleid, labelid=None):

        util.assert_sample(userid, dataid, sampleid)

        # Read samples:
        labels = pd.read_csv(util.db('label'))
        records = labels[
            (labels['dataset']==dataid) & (labels['sample']==sampleid)
        ]
        
        if labelid != None:
            records = records[records['id'] == labelid]

        return records.to_dict('r')

    def remove(self, userid, dataid, sampleid, labelid=None):
        
        util.assert_sample(userid, dataid, sampleid)
        labels = pd.read_csv(util.db('label'))

        if labelid is None:  # remove all
            labels.drop(
                labels[
                    (labels['dataset']==dataid) & 
                    (labels['sample']==sampleid)
                ].index, inplace=True
            )

        else:  # remove specified
            rows = (
                (labels['dataset'] == dataid) &
                (labels['sample'] == sampleid) & 
                (labels['id'] == labelid)
            )

            if any(rows):
                labels.drop(labels[rows].index, inplace=True)

            else:
                raise ValueError(
                    f"Label {labelid} do not exist for sample {sampleid} in dataset {dataid}."
                )

        # Write back remaining samples:
        labels.to_csv(util.db('label'), index=False)

    def add(self, userid, dataid, sampleid, 
            labeldef, kind, position, 
            status='draft'):

        util.assert_sample(userid, dataid, sampleid)

        labels  = pd.read_csv(util.db('label'))
        records = labels[
            (labels['dataset'] == dataid) & (labels['sample'] == sampleid)
        ]

        # Get path for saving segmentation:
        labelid = "L" + sampleid + str(len(records)+1)
        datasets = pd.read_csv(util.db('dataset'))
        datafolder = datasets.loc[datasets['id'] == dataid,'path'][0]
        labelpath = os.path.join(datafolder,sampleid,labelid+".png")

        entry = {
            'id'        : labelid,
            'dataset'   : dataid,
            'sample'    : sampleid,
            'labeldef'  : labeldef,
            'type'      : kind,
            'position'  : position,
            'path'      : str(labelpath),
            'status'    : status,
            'createdon' : util.now(),
            'modifiedon': util.now(),
            'modifiedby': userid
        }

        # save to database:
        labels = labels.append(entry, ignore_index=True)
        labels.to_csv(util.db('label'), index=False)

        return entry

    def modify(self, labelid, userid, dataid, sampleid, 
               position = None, 
               status = None):
               
        util.assert_sample(userid, dataid, sampleid)

        labels = pd.read_csv(util.db('label'))
        row = (
            (labels['dataset'] == dataid) &
            (labels['sample'] == sampleid) & 
            (labels['id'] == labelid)
        )

        if not any(row):
            raise ValueError(f"Label {labelid} not found for {sampleid} in {dataid}.")

        else:
            entry = labels.loc[row]
            entry = entry.to_dict('r')[0]

            if position != None:
                entry['position'] = position
            if status != None:
                entry['status'] = status

            entry['modifiedon'] = util.now()
            entry['modifiedby'] = userid

            labels.drop(labels[row].index, inplace=True)
            labels = labels.append(entry, ignore_index=True)
            labels.to_csv(util.db('label'), index=False)

            return entry
