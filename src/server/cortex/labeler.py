from flask import Response
from flask_restful import Resource, reqparse
import pandas as pd
import numpy as np
import shutil
import json
import os
import tempfile
import csv
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

    def __init__(self) -> None:
        super().__init__()
        self.chunksize = 10 ** 6
        self.columns = [
            'id',
            'userid',
            'dataid',
            'sampleid',
            'classid',
            'type',
            'position',
            'createdon',
            'modifiedon',
            'modifiedby'
        ]

    def get(self):
        """
        """
        parser = reqparse.RequestParser()
        parser.add_argument('labelid', location='args', required=False)
        parser.add_argument('userid', location='args', type=int, required=True)
        parser.add_argument('dataid', location='args', type=int, required=True)
        parser.add_argument('sampleid', location='args',
                            type=int, required=True)
        args = parser.parse_args()

        try:
            labels = self.fetch(
                args['userid'], args['dataid'], args['sampleid'], args['labelid']
            )

            return Response(
                json.dumps(labels, cls=util.NumpyEncoder),
                200,
                mimetype='application/json'
            )

        except ValueError as exp:
            return Response(
                json.dumps({'message': str(exp)}, indent=4),
                409,
                mimetype='application/json'
            )

    def put(self):

        parser = reqparse.RequestParser()
        parser.add_argument('labelid', location='json', required=False)
        parser.add_argument('userid', location='json', required=True, type=int)
        parser.add_argument('dataid', location='json', required=True, type=int)
        parser.add_argument('sampleid', location='json',
                            required=True, type=int)
        parser.add_argument('classid', location='json',
                            required=True, type=int)
        parser.add_argument('type', location='json', required=True, type=str)
        parser.add_argument('position', location='json',
                            required=True, type=list)
        args = parser.parse_args()

        args['labelid'] = util.tonumpy(args['labelid'])
        args['position'] = util.tonumpy(args['position'])

        try:
            if args['labelid'] is None:  # add
                entry = self.add(
                    args['userid'], args['dataid'], args['sampleid'],
                    args['classid'], args['type'], args['position']
                )

            else:  # modify
                entry = self.modify(
                    args['labelid'], args['userid'], args['dataid'],
                    args['sampleid'],
                    position=args['position'],
                    classid=args['classid']
                )

            return Response(
                json.dumps(entry, cls=util.NumpyEncoder),
                200,
                mimetype='application/json'
            )

        except ValueError as exp:
            return {'message': str(exp)}, 409

    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument('labelid', location='json',
                            type=str, required=False)
        parser.add_argument('userid', location='json', type=str, required=True)
        parser.add_argument('dataid', location='json', type=str, required=True)
        parser.add_argument('sampleid', location='json',
                            type=str, required=True)
        args = parser.parse_args()

        try:
            self.remove(
                args['userid'], args['dataid'], args['sampleid'], args['labelid']
            )

            return Response(
                json.dumps({'message': "success"}, indent=4),
                200,
                mimetype='application/json'
            )

        except ValueError as exp:
            return Response(
                json.dumps({'message': str(exp)}, indent=4),
                409,
                mimetype='application/json'
            )

    """
        Base API: CSV manipulation
    """

    def fetch(self, userid, dataid, sampleid, labelid=None):

        # Read labels for specified sample:
        labels = []
        for chunk in pd.read_csv(
            util.db('label'), chunksize=self.chunksize
        ):
            chunk = chunk[
                (chunk['userid'] == userid) &
                (chunk['dataid'] == dataid) &
                (chunk['sampleid'] == sampleid)
            ]

            if labelid is not None:
                rows = np.where(chunk.id.isin(labelid))[0]
                if rows.shape[0] > 0:
                    chunk = chunk.iloc[rows]

            labels += chunk.to_dict('r')

        return labels

    def remove(self, userid, dataid, sampleid, labelid=None):

        ftmp = tempfile.NamedTemporaryFile(
            mode='a', delete=False, dir=util.db(name=None), suffix=".csv"
        )

        # write columns to file:
        writer = csv.DictWriter(ftmp, self.columns)
        writer.writeheader()
        ftmp.flush()

        # track maximum id:
        maxid = -1
        try:
            for chunk in pd.read_csv(
                util.db('label'), chunksize=self.chunksize
            ):
                # check sampleid exists in chunk and update the rows:
                if labelid is None:
                    rows = np.where(
                        (chunk['userid'] == userid) &
                        (chunk['dataid'] != dataid) &
                        (chunk['sampleid'] != sampleid)
                    )[0]
                else:
                    rows = np.where(
                        (~chunk.id.isin(labelid)) &
                        (chunk['userid'] == userid) &
                        (chunk['dataid'] == dataid) &
                        (chunk['sampleid'] != sampleid)
                    )[0]

                if rows.shape[0] > 0:
                    chunk = chunk.iloc[rows]
                    maxid = max(maxid, chunk['id'].max())
                    chunk.to_csv(ftmp, mode='a', index=False, header=False)
                    ftmp.flush()

            # overwrite the db csv
            shutil.copy(ftmp.name, util.db('label'))
            util.setCurrentID(userid, 'label', maxid+1)

        finally:
            os.remove(ftmp.name)

    def add(self, userid, dataid, sampleid,
            classid, kind, position):
        previd = util.getNextID(userid, 'label')

        # Write data to the csv:
        labelid = previd + 1
        timestamp = util.now()

        # Create a dictory of entries:
        entry = {
            'id': labelid,
            'userid': userid,
            'dataid': dataid,
            'sampleid': sampleid,
            'classid': classid,
            'type': kind,
            'position': position,
            'createdon': timestamp,
            'modifiedon': timestamp,
            'modifiedby': userid,
        }

        with open(util.db('label'), 'a') as label:
            writer = csv.DictWriter(label, self.columns)
            writer.writerow(entry)

        util.setCurrentID(userid, 'label', previd+1)

        return entry

    def modify(
        self, userid, dataid, sampleid, labelid,
        position=None,
        classid=None
    ):
        """
        """

        ftmp = tempfile.NamedTemporaryFile(
            mode='a', delete=False, dir=util.db(name=None), suffix=".csv"
        )

        # write columns to file:
        writer = csv.DictWriter(ftmp, self.columns)
        writer.writeheader()
        ftmp.flush()

        entries = []
        try:
            for chunk in pd.read_csv(
                util.db('label'), chunksize=self.chunksize
            ):
                # check labelid exists in chunk and update the rows:
                rows = np.where(
                    (chunk['userid'] == userid) &
                    (chunk['dataid'] == dataid) &
                    (chunk['sampleid'] == sampleid) &
                    (chunk.id.isin(labelid))
                )[0]

                cids = chunk.iloc[rows, 'id'].values
                sids = [np.where(labelid == x)[0][0] for x in cids]

                if position is not None:
                    chunk.iloc[rows, 'position'] = position[sids]
                if classid is not None:
                    chunk.iloc[rows, 'status'] = classid[sids]

                # write updated rows back
                chunk.to_csv(ftmp, mode='a', index=False, header=False)
                ftmp.flush()
                entries += chunk.iloc[rows].to_dict('r')

            # overwrite the db csv
            shutil.copy(ftmp.name, util.db('label'))

        finally:
            os.remove(ftmp.name)

        return entries
