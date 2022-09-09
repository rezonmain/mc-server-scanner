import redis
from redis.commands.json.path import Path
from time import time
r = redis.Redis(host='redis', port=6379, db=2)
rTS = redis.Redis(host='redis', port=6379, db=4)

def stage(entry): 
  # Set entry as json object, key is ip + ts
  try:
    r.json().set(str(entry['ip']) + str(entry['foundAt']), Path.root_path(), entry)
  except Exception as e:
    raise Exception(f'Error ocurred while staging entry to redis. Error: {e}')

def get_all():
  entries = []
  for key in r.scan_iter():
    entries.append(r.json().get(key))
  return entries

def set_prune_ts():
  ts = int(time() * 1000)
  d = {"ts": ts}
  rTS.json().set("PRUNE_TS", Path.root_path(), d)
  return d

def get_prune_ts():
  ts = rTS.json().get("PRUNE_TS")
  if (ts == None):
    ts = set_prune_ts()
  return ts
    
def get_one(key):
  return r.json().get(key)

def unstage_all():
  for key in r.scan_iter():
    r.delete(key)

def unstage_one(key):
  r.delete(key)

def unstage_many(keys):
  for key in keys:
    r.delete(key)