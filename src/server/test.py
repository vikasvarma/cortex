from cortex.dataset import Dataset
import time
import numpy as np

entry = {}
db = Dataset()

start_time = time.time()
entry['samples'] = db.remove(
    0, np.array([0])
)
print("--- deleted in %s seconds ---\n" % (time.time() - start_time))