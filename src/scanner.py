import json
from time import sleep, time
import dramatiq
from statusping import StatusPing
from console_color import Color
from ip_range import IpRange
from logger import log
from db import DB
import os

PORT = '25565'
RATE = '75000'
SCANNED_FILE_NAME = 'res.json'
FOUND_FILE_NAME = 'found.json'
ip_range = IpRange()

def main():
  while True:
    range = ip_range.get_random_range()
    scan(range)
    ip_range.set_as_scanned.send(range)
    

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
  except json.JSONDecodeError:
    log.send(f'No servers found in range {Color.RED}{range}{Color.END}', __name__)

  count = 0
  for ip in ips:
    count += 1
    check_SLP.send(ip, count)

def should_retry_SLP(retries_so_far, exception):
  return retries_so_far < 3

@dramatiq.actor(retry_when=should_retry_SLP)
def check_SLP(ip, count):
  log.send(f'[{count}] Checking server list ping of {Color.YELLOW}{ip}{Color.END}', __name__)
  try:
    status = StatusPing(ip)
    res = status.get_status()
    log.send(f'[{count}] {Color.GREEN}Succesfully{Color.END} pinged {Color.YELLOW}{ip}{Color.END}, saving to db.', __name__)
    write_to_db.send(ip, res)
  except:
    log.send(f'[{count}] {Color.RED}{ip}{Color.END} is not a minecraft server I guess', __name__)

# Write found server to mongodb
@dramatiq.actor
def write_to_db(ip, slp):
  ts = int(time() * 1000)
  # Create dict from the server list ping response
  entry = {
    'ip': ip,
    'foundAt': ts,
  }
  # Append the server list ping dict
  entry.update(slp)
  try:
    # New database object (starts connection with db)
    db = DB()
    # Insert the entry to the db
    res = db.insert_one(entry)
    log.send(f'Added {Color.GREEN}{ip}{Color.END} to database. DB responded: {res}', __name__)
  except Exception as e:
    log.send(f'{Color.RED}DB ERROR{Color.END}. Couldn\'t add {Color.RED}{ip}{Color.END} to database, Error: {e}')

if __name__ == '__main__':
  main()
