from flask import Flask
from flask_restful import Api
from flask_cors import CORS

from cortex.user import User
from cortex.dataset import Dataset, Datasample

app = Flask(__name__)
api = Api(app)

CORS(app)
cors = CORS(app, resources = {
    r"/*" : {
        "origins": "*"
    }
})

api.add_resource(User,'/user')
api.add_resource(Dataset,'/dataset')
api.add_resource(Datasample,'/sample')

if __name__ == "__main__":
    app.run(debug=True)