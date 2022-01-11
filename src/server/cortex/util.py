from datetime import datetime
from pathlib import Path
import pandas as pd
import numpy as np
from enum import Enum
import os
import json

"""
"""
class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NumpyEncoder, self).default(obj)

"""
"""
def now():
    return int(datetime.now().strftime("%Y%m%d%H%M%S"))

"""
"""
def db(name=None):
    basedir = str(Path(__file__).parent.absolute())
    dbpath  = os.path.join(basedir,"data")
    if name is None:
        return dbpath
    else:
        return os.path.join(dbpath,name+".csv")

"""
"""
def getNextID(user,name):
    track = pd.read_csv(db('tracker'))
    return track.loc[
                (track['name']==name) & (track['userid']==user),
                'maxid'
           ].values[0]

def setCurrentID(user,name,value):
    track = pd.read_csv(db('tracker'))
    track.loc[(track['name']==name) & (track['userid']==user),'maxid'] = value
    track.to_csv(db('tracker'), index=False)

"""
"""
def tonumpy(value):
    if (value is not None) and (not isinstance(value, np.ndarray)):
        value = np.array(value)
    return value

"""
"""
class Status(Enum):
    UNKNOWN     = 0
    DRAFT       = 1
    INPROGRESS  = 2
    LOCKED      = 3
    UNDERREVIEW = 4
    COMPLETE    = 5

class DataType(Enum):
    UNKNOWN       = 0
    IMAGE         = 1
    VOLUME        = 2
    MEDICALIMAGE  = 3
    MEDICALVOLUME = 4
    VIDEO         = 5
    MIXED         = 6