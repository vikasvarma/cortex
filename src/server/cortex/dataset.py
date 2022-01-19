import json
from typing import Sized
from flask.wrappers import Response
from flask_restful import Resource, reqparse
import pandas as pd
import numpy as np
import math
import csv
import tempfile
import shutil
import os
from os import listdir
from os.path import isfile, join, splitext
from pathlib import PurePath
from . import labeler, util, classes

# -------------------------------------------------------------------------------


class Dataset(Resource):

    def __init__(self) -> None:
        super().__init__()
        self.__samples__ = Datasample()
        self.__classes__ = classes.Classes()
        self.chunksize = 10 ** 6
        self.columns = [
            'id',
            'userid',
            'name',
            'path',
            'description',
            'status',
            'createdon',
            'modifiedon',
            'modifiedby'
        ]

    def get(self):
        """
        """
        parser = reqparse.RequestParser()
        parser.add_argument('userid', required=True, location='args', type=int)
        parser.add_argument('dataid', required=False, location='args')
        args = parser.parse_args()

        args['dataid'] = util.tonumpy(args['dataid'])

        try:
            datasets = self.fetch(args['userid'], args['dataid'])
            for n in range(len(datasets)):
                datasets[n]['samples'] = self.__samples__.fetch(
                    args['userid'], datasets[n]['id']
                )
                datasets[n]['classes'] = self.__classes__.fetch(
                    args['userid'], datasets[n]['id']
                )

            return Response(
                json.dumps(datasets),
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
        parser.add_argument('userid', required=True, location='json', type=int)
        parser.add_argument('path', required=True, location='json', type=str)
        parser.add_argument('name', required=True, location='json', type=str)
        parser.add_argument('classes', required=False,
                            location='json', type=list)
        parser.add_argument('dataid', required=False,
                            location='json', type=int)
        parser.add_argument('status', required=False,
                            location='json', type=int)
        parser.add_argument('description', required=False,
                            location='json', type=str)
        args = parser.parse_args()

        print(args)

        try:
            if args['dataid'] is None:  # add
                entry = self.add(
                    args['userid'],
                    util.tonumpy([args['path']]),
                    util.tonumpy([args['name']]),
                    util.tonumpy([args['description']])
                )[0]

                # Scrape the disk to look for image samples:
                imgext = [".jpg", ".jpeg", ".gif", ".png", ".tga"]
                samples = [
                    file
                    for file in listdir(args['path'])
                    if ((isfile(join(args['path'], file))) and
                        (splitext(file)[1] in imgext))
                ]

                if len(samples) > 0:
                    kind = np.array([util.DataType.IMAGE.value] * len(samples))
                    entry['samples'] = self.__samples__.add(
                        args['userid'], entry['id'], util.tonumpy(samples),
                        kind=kind
                    )
                else:
                    entry['sampels'] = []

                # Add classes if provided:
                if args['classes'] is not None and len(args['classes']) > 0:
                    entry['classes'] = self.__classes__.add(
                        args['userid'], entry['id'],
                        util.tonumpy(args['classes'])
                    )

            else:  # modify
                entry = self.modify(
                    args['userid'], args['dataid'],
                    name=util.tonumpy([args['name']]),
                    path=util.tonumpy([args['path']]),
                    status=util.tonumpy([args['status']]),
                    description=util.tonumpy([args['description']])
                )

            return Response(
                json.dumps(entry, cls=util.NumpyEncoder),
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
        parser.add_argument('userid', location='json', type=int, required=True)
        parser.add_argument('dataid', location='json',
                            type=int, required=False)
        args = parser.parse_args()

        try:
            self.remove(
                args['userid'],
                util.tonumpy([args['dataid']])
            )
            return Response(
                json.dumps({'status': 0}), 
                200,
                 mimetype='application/json'
            )

        except ValueError as exp:
            return Response(
                json.dumps({'message': str(exp)}),
                409,
                mimetype='application/json'
            )

    """
    ----------------------------------------------------------------------------
        Base API: CSV manipulation
    ----------------------------------------------------------------------------
    """

    def fetch(self, userid, dataid=None):
        dataset = []
        for chunk in pd.read_csv(
            util.db('dataset'), chunksize=self.chunksize
        ):
            chunk = chunk.replace({np.nan:None})
            chunk = chunk[chunk['userid'] == userid]

            if dataid is not None:
                rows = np.where(chunk.id.isin(dataid))[0]
                if rows.shape[0] > 0:
                    chunk = chunk.iloc[rows]

            dataset = dataset + chunk.to_dict('r')

        return dataset

    def remove(self, userid, dataid=None):
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
                util.db('dataset'), chunksize=self.chunksize
            ):
                if dataid is None:
                    rows = np.where(chunk['userid'] == userid)[0]
                else:
                    rows = np.where(
                        (~chunk.id.isin(dataid)) &
                        (chunk['userid'] == userid)
                    )[0]

                if rows.shape[0] > 0:
                    chunk = chunk.iloc[rows]
                    maxid = max(maxid, chunk['id'].max())
                    chunk.to_csv(ftmp, mode='a', index=False, header=False)
                    ftmp.flush()

            # overwrite the db csv
            shutil.copy(ftmp.name, util.db('dataset'))
            util.setCurrentID(userid, 'dataset', maxid+1)

            if dataid is not None:
                for n in dataid:
                    # Remove all child entities:
                    self.__samples__.remove(userid, n)
                    self.__classes__.remove(userid, n)

        finally:
            os.remove(ftmp.name)

    def add(self, userid, path, name, description):
        """
        """

        previd = util.getNextID(userid, 'dataset')

        # Write data to the csv:
        size = path.shape[0]
        dataid = [*range(previd, previd + path.shape[0])]
        timestamp = util.now()

        # Create a dictory of entries:
        entries = [
            {
                'id': x[0],
                'userid': userid,
                'name': x[2],
                'path': x[1],
                'description': x[3],
                'status': int(util.Status.UNKNOWN.value),
                'createdon': timestamp,
                'modifiedon': timestamp,
                'modifiedby': userid,
            }
            for x in zip(dataid, path, name, description)
        ]

        with open(util.db('dataset'), 'a') as dataset:
            writer = csv.DictWriter(dataset, self.columns)

            for n in range(math.ceil(size/self.chunksize)):
                start = n*self.chunksize
                end = min((n+1)*self.chunksize, size)
                writer.writerows(entries[start:end])

        util.setCurrentID(userid, 'dataset', previd+size)

        return entries

    def modify(
        self, userid, dataid,
        name=None,
        path=None,
        description=None,
        status=None
    ):

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
                util.db('dataset'), chunksize=self.chunksize
            ):
                # check dataid exists in chunk and update the rows:
                rows = np.where(
                    (chunk.id.isin(dataid)) & (chunk['userid'] == userid)
                )[0]

                cids = chunk.iloc[rows, 'id'].values
                sids = [np.where(dataid == x)[0][0] for x in cids]

                if name is not None:
                    chunk.iloc[rows, 'name'] = name[sids]
                if path is not None:
                    chunk.iloc[rows, 'path'] = path[sids]
                if description is not None:
                    chunk.iloc[rows, 'description'] = description[sids]
                if status is not None:
                    chunk.iloc[rows, 'status'] = status[sids]

                # write updated rows back
                chunk.to_csv(ftmp, mode='a', index=False, header=False)
                ftmp.flush()
                entries.append(chunk.iloc[rows].to_dict('r'))

            # overwrite the db csv
            shutil.copy(ftmp.name, util.db('dataset'))

        finally:
            os.remove(ftmp.name)

        return entries

# -------------------------------------------------------------------------------


class Datasample(Resource):

    def __init__(self) -> None:
        super().__init__()
        self.chunksize = 10 ** 6
        self.__labels__ = labeler.Labels()
        self.columns = [
            'id',
            'userid',
            'dataid',
            'path',
            'type',
            'status',
            'createdon',
            'modifiedon',
            'modifiedby'
        ]

    def get(self):
        """
        """
        parser = reqparse.RequestParser()
        parser.add_argument('userid', location='args', type=int, required=True)
        parser.add_argument('dataid', location='args', type=int, required=True)
        parser.add_argument('sampleid', location='args', required=False)
        args = parser.parse_args()

        args['sampleid'] = util.tonumpy(args['sampleid'])

        try:
            samples = self.fetch(
                args['userid'], args['dataid'], args['sampleid']
            )

            if args['sampleid'] is not None:
                for n in range(len(samples)):
                    samples[n]["labels"] = self.__labels__.fetch(
                        args['userid'], samples[n]['dataid'], samples[n]['id']
                    )

            return Response(
                json.dumps(samples),
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
        parser.add_argument('userid', required=True, location='json', type=int)
        parser.add_argument('dataid', required=True, location='json', type=int)
        parser.add_argument('path', required=True, location='json')
        parser.add_argument('sampleid', required=False, location='json')
        parser.add_argument('status', required=False, location='json')
        parser.add_argument('type', required=False, location='json')
        args = parser.parse_args()

        args['path'] = util.tonumpy(args['path'])
        args['sampleid'] = util.tonumpy(args['sampleid'])
        args['status'] = util.tonumpy(args['status'])
        args['type'] = util.tonumpy(args['type'])

        try:
            if args['sampleid'] is None:  # add
                entries = self.add(
                    args['userid'], args['dataid'], args['path'],
                    args['type']
                )

            else:  # modify
                entries = self.modify(
                    args['userid'], args['dataid'], args['sampleid'],
                    kind=args['kind'],
                    status=args['status']
                )

            return Response(
                json.dumps(entries),
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
        parser.add_argument('userid', required=True, location='json', type=int)
        parser.add_argument('dataid', required=True, location='json', type=int)
        parser.add_argument('sampleid', required=False, location='json')
        args = parser.parse_args()

        args['sampleid'] = util.tonumpy(args['sampleid'])

        try:
            self.remove(args['userid'], args['dataid'], args['sampleid'])
            return Response({}, 200)

        except ValueError as exp:
            return Response({'message': str(exp)}, 409)

    """
    ----------------------------------------------------------------------------
        Base API: CSV manipulation
    ----------------------------------------------------------------------------
    """

    def fetch(self, userid, dataid, sampleid=None):
        # Read samples:
        samples = []
        for chunk in pd.read_csv(
            util.db('datasample'), chunksize=self.chunksize
        ):
            chunk = chunk[
                (chunk['userid'] == userid) &
                (chunk['dataid'] == dataid)
            ]

            if sampleid is not None:
                rows = np.where(chunk.id.isin(sampleid))[0]
                if rows.shape[0] > 0:
                    chunk = chunk.iloc[rows]
                    
            samples = samples + chunk.to_dict('r')

        return samples

    def remove(self, userid, dataid, sampleid=None):
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
                util.db('datasample'), chunksize=self.chunksize
            ):
                # check sampleid exists in chunk and update the rows:
                if sampleid is None:
                    rows = np.where(
                        (chunk['userid'] == userid) &
                        (chunk['dataid'] != dataid)
                    )[0]
                else:
                    rows = np.where(
                        (~chunk.id.isin(sampleid)) &
                        (chunk['userid'] == userid) &
                        (chunk['dataid'] == dataid)
                    )[0]

                if rows.shape[0] > 0:
                    chunk = chunk.iloc[rows]
                    maxid = max(maxid, chunk['id'].max())
                    chunk.to_csv(ftmp, mode='a', index=False, header=False)
                    ftmp.flush()

            # overwrite the db csv
            shutil.copy(ftmp.name, util.db('datasample'))
            util.setCurrentID(userid, 'datasample', maxid+1)

        finally:
            os.remove(ftmp.name)

    def add(self, userid, dataid, path, kind=None):
        previd = util.getNextID(userid, 'datasample')

        if kind is None:
            kind = np.empty(path.shape[0], dtype=np.uint8)
            kind.fill(int(util.DataType.UNKNOWN.value))

        # Write data to the csv:
        size = path.shape[0]
        sampleid = [*range(previd, previd + size)]
        timestamp = util.now()

        # Create a dictory of entries:
        entries = [
            {
                'id': x[0],
                'userid': userid,
                'dataid': dataid,
                'path': x[1],
                'type': x[2],
                'status': int(util.Status.UNKNOWN.value),
                'createdon': timestamp,
                'modifiedon': timestamp,
                'modifiedby': userid,
            }
            for x in zip(sampleid, path, kind)
        ]

        with open(util.db('datasample'), 'a') as datasample:
            writer = csv.DictWriter(datasample, self.columns)

            for n in range(math.ceil(size/self.chunksize)):
                start = n*self.chunksize
                end = min((n+1)*self.chunksize, size)
                writer.writerows(entries[start:end])

        util.setCurrentID(userid, 'datasample', previd+size)

        return entries

    def modify(
        self, userid, dataid, sampleid,
        kind=None,
        status=None
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
                util.db('datasample'), chunksize=self.chunksize
            ):
                # check sampleid exists in chunk and update the rows:
                rows = np.where(
                    (chunk['userid'] == userid) &
                    (chunk['dataid'] == dataid) &
                    (chunk.id.isin(sampleid))
                )[0]

                cids = chunk.iloc[rows, 'id'].values
                sids = [np.where(sampleid == x)[0][0] for x in cids]

                if kind is not None:
                    chunk.iloc[rows, 'type'] = kind[sids]
                if status is not None:
                    chunk.iloc[rows, 'status'] = status[sids]

                # write updated rows back
                chunk.to_csv(ftmp, mode='a', index=False, header=False)
                ftmp.flush()
                entries += chunk.iloc[rows].to_dict('r')

            # overwrite the db csv
            shutil.copy(ftmp.name, util.db('datasample'))

        finally:
            os.remove(ftmp.name)

        return entries
