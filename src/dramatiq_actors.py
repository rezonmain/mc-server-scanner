import os
from datetime import datetime
from time import time
from concolor import Color
from statusping import StatusPing
from mongo import DB
import dramatiq
import cache
from dramatiq.brokers.redis import RedisBroker
redis_broker = RedisBroker(host="redis")
dramatiq.set_broker(redis_broker)

IDENT = os.getenv('IDENT')

@dramatiq.actor
def worker_log(str, src=__name__):
  date = datetime.now()
  ts = date.strftime('%d-%b-%y %H:%M:%S')
  print(f'[{ts}][{src}.py] {str}')

@dramatiq.actor
def slp(ip, count, total):
  worker_log.send(f'[{count}/{total}] Checking server list ping of {Color.YELLOW}{ip}{Color.END}', __name__)
  try:
    status = StatusPing(ip)
    res = status.get_status()
    # Generate entry object
    ts = int(time() * 1000)
    entry = {
    'ip': ip,
    'foundAt': ts,
    'foundBy': IDENT,
    }
    keys = ['description', 'players', 'version', 'ping', 'favicon']
    # append res properties to entry if it has defined keys
    for key in keys:
      if key in res:
        entry.update({key: res[key]})
    
    cache.stage(entry)
    worker_log.send(f'[{count}/{total}] {Color.GREEN}Succesfully{Color.END} pinged {Color.YELLOW}{ip}{Color.END}, staged to save to db.', __name__)
  except:
    worker_log.send(f'[{count}/{total}] {Color.RED}{ip}{Color.END} is not a minecraft server I guess', __name__)

@dramatiq.actor(max_retries=0)
def prune_duplicates():
  ts = cache.get_prune_ts()["ts"]
  try:
    db = DB()
    res = db.prune_duplicates(ts)
    if (not res):
      worker_log.send(f'No duplicates to delete this time around TS: {ts}')
    else:
      cache.set_prune_ts()
      worker_log.send(f'Removed {res[1]} duplicates, new TS: {ts}, DB responded: {res[0]}')
  except Exception as e:
    worker_log.send(f'Error while trying to remove duplicates, DB responded: {e}')

@dramatiq.actor(max_retries=0)
def write_to_db():

  try:
    entries = cache.get_all()
    if len(entries):
      db = DB()
      res = db.insert_many(entries)
      # Remove saved items from redis store
      keys = []
      for entry in entries:
        keys.append(str(entry['ip']) + str(entry['foundAt']))
      cache.unstage_many(keys)
      worker_log.send(f'Succesfully added {Color.GREEN}{len(entries)}{Color.END} entries, DB responded: {res}.')
    else:
      worker_log.send('No staged entries to add to db.')
  except Exception as e:
    raise Exception(f'An {Color.RED}error{Color.END} ocurred on trying to write entries to mongo database, Error: {e}')