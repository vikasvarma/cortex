from flask_restful import Resource, reqparse
import pandas as pd

class User(Resource):
    """
    """

    def __init__(self):
        self.dbpath = "./data/user.csv"

    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('userid', required=True, type = str)
        args = parser.parse_args()

        db = pd.read_csv(self.dbpath)

        if str(args['userid']) in str(db['id']):
            info = db[db['id'] == args['userid']]

            # TODO - raise an error when id is not unique
            assert len(info) == 1

            return {
                'user': info.to_dict('r')
            }, 200
        
        else:
            return {}, 409

    def put(self):

        parser = reqparse.RequestParser()
        parser.add_argument('userid', required=True, type = str)
        parser.add_argument('password', required=True, type = str)
        parser.add_argument('name', required=True, type = str)
        parser.add_argument('role', required=True, type = str)
        parser.add_argument('type', required=True, type = str)
        args = parser.parse_args()

        db = pd.read_csv(self.dbpath)

        if str(args['userid']) in str(db['id']):
            return {
                'message': f"{args['userid']} already exists."
            }, 409
        
        else:
            db = db.append({
                'id': args['userid'],
                'password': args['password'],
                'email': args['userid'],
                'name': args['name'],
                'role': args['role'],
                'type': args['type']
            },ignore_index=True)

            db.to_csv(self.dbpath, index=False)

            return {}, 200

    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument('userid', required=True, type = str)
        args = parser.parse_args()

        db = pd.read_csv(self.dbpath)

        if str(args['userid']) in str(db['id']):
            db = db[db['id'] != args['userid']]
            db.to_csv(self.dbpath, index=False)

            return {}, 200
        
        else:
            return {
                'message': f"{args['userid']} does not exist."
            }, 409
