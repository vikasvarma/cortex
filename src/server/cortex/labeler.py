from flask_restful import Resource, reqparse
import pandas as pd
from model.segmentation import OpenCVSegmenter

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
        parser.add_argument('id', required=True, type = str)
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
