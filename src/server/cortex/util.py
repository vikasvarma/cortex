from datetime import datetime
from pathlib import Path
import pandas as pd

basedir  = str(Path(__file__).parent.absolute())
database = {
    'dataset': basedir + "/data/dataset.csv",
    'datasample': basedir + "/data/datasample.csv",
    'label': basedir + "/data/label.csv",
    'labeldefinition': basedir + "/data/labeldefinition.csv"
}

def now():
    # Returns current time stamp in YYYY-MM-DD HH:MM:SS format
    stamp = datetime.now()
    stamp = stamp.strftime("%Y-%m-%d %H:%M:%S")
    return stamp

def db(name):
    return database[name]

def assert_sample(userid,dataid,sampleid):

    # Check dataset exists:
    datasets = pd.read_csv(db('dataset'))
    isDatasetFound = any(
        (datasets['author'] == userid) & 
        (datasets['id'] == dataid)
    )
    if not isDatasetFound:
        raise ValueError(f"No dataset {dataid} found for user: {userid}.")

    # Check sample exists:
    samples = pd.read_csv(db('datasample'))
    isSampleFound = any(
        (samples['dataset'] == dataid) & 
        (samples['id'] == sampleid)
    )
    if not isSampleFound:
        raise ValueError(f"No sample {sampleid} found for dataset: {dataid}.")
