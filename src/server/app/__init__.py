from flask import Flask
from flask_restful import Api

from .user import User
from .dataset import Dataset, Datasample

app = Flask(__name__)
api = Api(app)

api.add_resource(User,'/user')
api.add_resource(Dataset,'/dataset')
api.add_resource(Datasample,'/sample')