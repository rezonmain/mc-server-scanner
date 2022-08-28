from datetime import datetime, time
from concolor import Color
from statusping import StatusPing
from mongo import DB
import dramatiq
import cache

@dramatiq.actor
def log(str, src=__name__):
  date = datetime.now()
  ts = date.strftime('%d-%b-%y %H:%M:%S')
  print(f'[{ts}][{src}.py] {str}')

@dramatiq.actor
def slp(ip, count, total):
  log.send(f'[{count}/{total}] Checking server list ping of {Color.YELLOW}{ip}{Color.END}', __name__)
  try:
    status = StatusPing(ip)
    res = status.get_status()
    log.send(f'[{count}/{total}] {Color.GREEN}Succesfully{Color.END} pinged {Color.YELLOW}{ip}{Color.END}, staged to saved to db.', __name__)
    # Generate entry object
    ts = int(time() * 1000)
    entry = {
    'ip': ip,
    'foundAt': ts,
    }
    entry.update(res)
    # Stage entry to redis store
    cache.stage(entry)
  except:
    log.send(f'[{count}/{total}] {Color.RED}{ip}{Color.END} is not a minecraft server I guess', __name__)

@dramatiq.actor
def write_to_db():
  log.send('Write to db debug')
  try:
    db = DB()
    entries = cache.getAll()
    if len(entries):
      db.insert_many(entries)
      log.send(f'Succesfully added {Color.GREEN}{len(entries)}{Color.END} entries to db.')
      # Remove saved items from redis store
      keys = []
      for entry in entries:
        keys.append(str(entry['ip']) + str(entry['foundAt']))
      cache.unstageMany(keys)
  except Exception as e:
    log.send(f'An {Color.RED}error{Color.END} ocurred on trying to write entries to mongo databse')
    raise Exception(f'An {Color.RED}error{Color.END} ocurred on trying to write entries to mongo database, Error{e}')
  






