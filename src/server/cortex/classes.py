import json
from flask.wrappers import Response
from flask_restful import Resource, reqparse
from numpy.lib import emath
import pandas as pd
import numpy as np
import math
import csv
import tempfile
import shutil
import os
from . import util

class Classes(Resource):
    """
    """

    def __init__(self) -> None:
        super().__init__()
        self.chunksize = 10 ** 6
        self.columns = [
            'id',
            'userid',
            'dataid',
            'name',
            'color',
            'createdon',
            'modifiedon',
            'modifiedby'
        ]

        self.colormap = [
            "#AFEFA4",
            "#A4C2EF",
            "#CA9EDF",
            "#DF9E9E",
            "#A79EDF",
            "#DFD99E",
            "#DFAA9E",
            "#D66161",
            "#6197D6",
            "#B761D6",
            "#D66199",
            "#CAD4BD",
            "#D4BDBD",
            "#BDD4C7",
            "#62A1FF",
            "#596576",
            "#765B59",
            "#93B387",
            "#9587B3",
            "#9B2323"
        ]

    def get(self):
        """
        """
        parser = reqparse.RequestParser()
        parser.add_argument('userid',  required=True, location='args', type=int)
        parser.add_argument('dataid', required=True, location='args', type=int)
        parser.add_argument('classid', required=False, location='args')
        args = parser.parse_args()

        args['classid'] = util.tonumpy(args['classid'])

        try:
            classes = self.fetch(
                args['userid'], args['dataid'], args['classid'])

            return Response(
                json.dumps(classes),
                200,
                mimetype='application/json'
            )

        except ValueError as exp:
            return Response(
                {'message': str(exp)},
                409,
                mimetype='application/json'
            )

    def put(self):

        parser = reqparse.RequestParser()
        parser.add_argument('userid', required=True, location='json', type=int)
        parser.add_argument('dataid', required=True, location='json', type=int)
        parser.add_argument('name', required=True, location='json')
        parser.add_argument('color', required=False, location='json')
        parser.add_argument('classid', required=False, location='json')
        args = parser.parse_args()

        args['name'] = util.tonumpy(args['name'])
        args['color'] = util.tonumpy(args['color'])
        args['classid'] = util.tonumpy(args['classid'])

        try:
            if args['classid'] is None:  # add
                classes = self.add(
                    args['userid'], args['dataid'], args['name'], args['color']
                )

            else:  # modify
                classes = self.modify(
                    args['userid'], args['dataid'], args['classid'],
                    name=args['name'],
                    color=args['color']
                )

            return Response(
                json.dumps(classes),
                200,
                mimetype='application/json'
            )

        except ValueError as exp:
            return Response(
                {'message': str(exp)},
                409,
                mimetype='application/json'
            )

    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument('userid', location='json', type=int, required=True)
        parser.add_argument('dataid', location='json', type=int, required=True)
        parser.add_argument('classid', required=False, location='json')
        args = parser.parse_args()

        try:
            self.remove(args['userid'], args['dataid'], args['classid'])
            return Response({}, 200)

        except ValueError as exp:
            return Response(
                {'message': str(exp)},
                409,
                mimetype='application/json'
            )

    """
        Base API: CSV manipulation
    """

    def fetch(self, userid, dataid, classid=None):
        # Read classes:
        classes = []
        for chunk in pd.read_csv(
            util.db('classes'), chunksize=self.chunksize
        ):
            chunk = chunk[
                (chunk['userid'] == userid) &
                (chunk['dataid'] == dataid)
            ]

            if classid is not None:
                rows = np.where(chunk.id.isin(classid))[0]
                if rows.shape[0] > 0:
                    chunk = chunk.iloc[rows]
                    
            classes = classes + chunk.to_dict('r')

        return classes

    def remove(self, userid, dataid, classid=None):
        """
        """

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
                util.db('classes'), chunksize=self.chunksize
            ):
                # check sampleid exists in chunk and update the rows:
                if classid is None:
                    rows = np.where(
                        (chunk['userid'] == userid) &
                        (chunk['dataid'] != dataid)
                    )[0]
                else:
                    rows = np.where(
                        (~chunk.id.isin(classid)) &
                        (chunk['userid'] == userid) &
                        (chunk['dataid'] == dataid)
                    )[0]

                if rows.shape[0] > 0:
                    chunk = chunk.iloc[rows]
                    maxid = max(maxid, chunk['id'].max())
                    chunk.to_csv(ftmp, mode='a', index=False, header=False)
                    ftmp.flush()

            # overwrite the db csv
            shutil.copy(ftmp.name, util.db('classes'))
            util.setCurrentID(userid, 'classes', maxid+1)

        finally:
            os.remove(ftmp.name)

    def add(self, userid, dataid, name, color=None):
        previd = util.getNextID(userid, 'classes')

        if color is None:
            color = np.array(
                [self.colormap[ind] for ind in range(name.shape[0])]
            )

        # Write data to the csv:
        size = name.shape[0]
        classid = [*range(previd, previd + size)]
        timestamp = util.now()

        # Create a dictory of entries:
        entries = [
            {
                'id': x[0],
                'userid': userid,
                'dataid': dataid,
                'name': x[1],
                'color': x[2],
                'createdon': timestamp,
                'modifiedon': timestamp,
                'modifiedby': userid,
            }
            for x in zip(classid, name, color)
        ]

        with open(util.db('classes'), 'a') as classes:
            writer = csv.DictWriter(classes, self.columns)

            for n in range(math.ceil(size/self.chunksize)):
                start = n*self.chunksize
                end = min((n+1)*self.chunksize, size)
                writer.writerows(entries[start:end])

        util.setCurrentID(userid, 'classes', previd+size)

        return entries

    def modify(
        self, userid, dataid, classid,
        name=None,
        color=None
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
                util.db('classes'), chunksize=self.chunksize
            ):
                rows = np.where(
                    (chunk.id.isin(classid)) &
                    (chunk['userid'] == userid) &
                    (chunk['dataid'] == dataid)
                )[0]

                cids = chunk.iloc[rows, 'id'].values
                sids = [np.where(classid == x)[0][0] for x in cids]

                if name is not None:
                    chunk.iloc[rows, 'name'] = name[sids]
                if color is not None:
                    chunk.iloc[rows, 'color'] = color[sids]

                # write updated rows back
                chunk.to_csv(ftmp, mode='a', index=False, header=False)
                ftmp.flush()
                entries.append(chunk.iloc[rows].to_dict('r'))

            # overwrite the db csv
            shutil.copy(ftmp.name, util.db('classes'))

        finally:
            os.remove(ftmp.name)

        return entries
