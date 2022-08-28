import os
from datetime import datetime
from time import time
from concolor import Color
from statusping import StatusPing
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
    'foundBy': IDENT
    }
    entry.update(res)
    cache.stage(entry)
    worker_log.send(f'[{count}/{total}] {Color.GREEN}Succesfully{Color.END} pinged {Color.YELLOW}{ip}{Color.END}, staged to save to db.', __name__)
  except:
    worker_log.send(f'[{count}/{total}] {Color.RED}{ip}{Color.END} is not a minecraft server I guess', __name__)


  






