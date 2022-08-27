import json
from time import sleep, time
from statusping import StatusPing
from console_color import Color
from ip_range import IpRange
from db import DB
from datetime import datetime
import os
import dramatiq
from dramatiq.brokers.rabbitmq import RabbitmqBroker
from dramatiq.encoder import PickleEncoder
from dramatiq.results import Results
from dramatiq.results.backends import RedisBackend

result_backend = RedisBackend(encoder=PickleEncoder)
broker = RabbitmqBroker()
broker.add_middleware(Results(backend=result_backend))
dramatiq.set_broker(broker=broker)

PORT = '25565'
RATE = '75000'
SCANNED_FILE_NAME = 'res.json'
FOUND_FILE_NAME = 'found.json'
ip_range = IpRange()

def should_retry_SLP(retries_so_far, exception):
  return retries_so_far < 3

def main():
  while True:
    range = ip_range.get_random_range()
    scan(range)
    ip_range.set_as_scanned(range)
    sleep(1)
    log.send(f'Range: {range} set as scanned', __name__)

def scan(range):
  log.send(f'Scanning range: {Color.YELLOW}{range}{Color.END} for open {PORT} port @ {RATE} kp/s', __name__)
  command = f'sudo masscan -p{PORT} {range} --rate {RATE} --wait {3} -oJ {SCANNED_FILE_NAME}'
  os.system(command)
  # Sleep: make sure the file is written before getting ip's
  sleep(1)
  ips = []
  try:
    ips = ip_range.get_scanned_ips(SCANNED_FILE_NAME)
    log.send(f'{len(ips)} ip(s) found in range: {Color.GREEN}{range}{Color.END}', __name__)
    handle_found.send(ips)
  except json.JSONDecodeError:
    log.send(f'No servers found in range {Color.RED}{range}{Color.END}', __name__)
    
@dramatiq.actor(retry_when=should_retry_SLP)
def handle_found(ips):
  count = 0
  total = len(ips)
  servers = []
  # Bundle the pinged servers
  for ip in ips:
    count += 1
    message = check_SLP.send(ip, count, total)
    server = message.get_result(block=True)
    if server:
      servers.append(server)
  # If there was at list 1 ping, added it to database
  if (len(servers) > 0): 
    log.send(f'Writing {len(servers)} to db')
    write_to_db.send(servers)
  else:
    log.send(f'None was a minecraft server 🥴')

# Check the server list ping of found ip, and create the entry object
@dramatiq.actor(retry_when=should_retry_SLP, store_results=True)
def check_SLP(ip, count, total):
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
    return entry
  except:
    log.send(f'[{count}/{total}] {Color.RED}{ip}{Color.END} is not a minecraft server I guess', __name__)
    return False
 
# Write found server to mongodb
@dramatiq.actor(retry_when=should_retry_SLP)
def write_to_db(entries):
  try:
    # New database object (starts connection with db)
    db = DB()
    # Insert bundled entries
    res = db.insert_many(entries)
    log.send(f'Added {Color.GREEN}{len(entries)}{Color.END} to database. DB responded: {res}', __name__)
  except Exception as e:
    log.send(f'{Color.RED}DB ERROR{Color.END}. Couldn\'t add {Color.RED}entries{Color.END} to database, Error: {e}')
    raise Exception(f'Could not save to db, Error: {e}')

# Simple logger
@dramatiq.actor
def log(str, src=__name__):
  date = datetime.now()
  ts = date.strftime('%d-%b-%y %H:%M:%S')
  print(f'[{ts}][{src}.py] {str}')
  
if __name__ == '__main__':
  main()
