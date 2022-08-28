import redis
from redis.commands.json.path import Path
r = redis.Redis(host='redis', port=6379, db=1)

def stage(entry): 
  # Set entry as json object, key is ip + ts
  try:
    r.json().set(str(entry['ip']) + str(entry['foundAt']), Path.root_path(), entry)
  except Exception as e:
    raise Exception(f'Error ocurre while staging entry to redis. Error: {e}')

def getAll():
  entries = []
  for key in r.scan_iter():
    entries.append(r.json().get(key))
  return entries
    
def getOne(key):
  return r.json().get(key)

def unstageOne(key):
  r.delete(key)

def unstageMany(keys):
  for key in keys:
    r.delete(key)

  

  

