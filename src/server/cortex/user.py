import json
from flask.helpers import locked_cached_property
from flask.wrappers import Response
from flask_restful import Resource, reqparse
import pandas as pd
import numpy as np
import math
import csv
import tempfile
import shutil
import os
from . import util

class User(Resource):
    """
    """

    def __init__(self) -> None:
        super().__init__()
        self.chunksize = 10 ** 6
        self.columns = [
            'id',
            'name',
            'email',
            'password',
            'location',
            'role',
            'avatar'
        ]

    def get(self):
        """
        """
        parser = reqparse.RequestParser()
        parser.add_argument('userid',required=True,location='args',type=int)
        args = parser.parse_args()

        try:
            user = self.fetch(args['userid'])

            return Response(
                json.dumps(user),
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
        parser.add_argument('userid', required=False, location='json', type=int)
        parser.add_argument('name', location='json', type=str)
        parser.add_argument('email', location='json', type=str)
        parser.add_argument('password', location='json', type=str)
        parser.add_argument('location',  location='json', type=str)
        parser.add_argument('role', location='json', type=int)
        args = parser.parse_args()

        try:
            if args['userid'] is None:  # add
                user = self.add(
                    args['name'], args['email'], args['password'], 
                    args['location'], args['role']
                )

            else:  # modify
                user = self.modify(
                    args['userid'],
                    name=args['name'],
                    email=args['email'],
                    password=args['password'],
                    location=args['location'],
                    role=args['role']
                )

            return Response(
                json.dumps(user),
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
        args = parser.parse_args()

        try:
            self.remove(args['userid'])
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
    def fetch(self, userid):
        # Read classes:
        user = {}
        for chunk in pd.read_csv(
            util.db('user'), chunksize=self.chunksize
        ):
            chunk = chunk[(chunk['id'] == userid)]
            if not chunk.empty:
                user = chunk.to_dict('r')
                if isinstance(user, list):
                    user = user[0]
                break

        return user

    def remove(self, userid):
        """
        """

        ftmp = tempfile.NamedTemporaryFile(
            mode='a', delete=False, dir=util.db(name=None), suffix=".csv"
        )

        # write columns to file:
        writer = csv.DictWriter(ftmp, self.columns)
        writer.writeheader()
        ftmp.flush()

        try:
            for chunk in pd.read_csv(
                util.db('user'), chunksize=self.chunksize
            ):
                # check sampleid exists in chunk and update the rows:
                rows = np.where((chunk['id'] == userid))[0]
                if rows.shape[0] > 0:
                    chunk = chunk.iloc[rows]
                    maxid = max(maxid, chunk['id'].max())
                    chunk.to_csv(ftmp, mode='a', index=False, header=False)
                    ftmp.flush()

            # overwrite the db csv
            shutil.copy(ftmp.name, util.db('user'))

        finally:
            os.remove(ftmp.name)

    def add(self, name, email, password, location, role):
        # Write data to the csv:
        
        users  = pd.read_csv(util.db('user'))
        userid = 0 if users.empty else len(users['id'].index)
        entry = {
            'id': userid,
            'name': name,
            'email': email,
            'password': password,
            'location': location,
            'role': role,
            'avatar': "//"
        }
        users = users.append(entry, ignore_index=True)
        users.to_csv(util.db('user'), index=False)

        return entry

    def modify(
        self, userid,
        name=None,
        email=None,
        password=None,
        location=None,
        role=None
    ):
        """
        """

        users  = pd.read_csv(util.db('classes'))
        row = np.where(users['id'] == userid)[0]

        if name is not None: users.iloc[row,'name'] = name
        if email is not None: users.iloc[row,'email'] = email
        if password is not None: users.iloc[row,'password'] = password
        if location is not None: users.iloc[row,'location'] = location
        if role is not None: users.iloc[row,'role'] = role

        entry = users[row]
        users.to_csv(util.db('user'), index=False)

        return entry