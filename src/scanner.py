import json
import dramatiq_actors
from time import sleep
from concolor import Color
from iprange import IpRange
import os
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

PORT = '25565'
RATE = os.getenv('RATE')
SCANNED_FILE_NAME = 'res.json'
FOUND_FILE_NAME = 'found.json'
ip_range = IpRange()

def main():
  # Write missing files
  if not os.path.exists('ipranges.json'): 
    ip_range.generate_list()
  if not os.path.exists(SCANNED_FILE_NAME): 
    with open(SCANNED_FILE_NAME, 'w') as file: file.write('')

  # Set up scheduler for writing to db every minute
  scheduler = BackgroundScheduler()
  scheduler.add_job(
  dramatiq_actors.write_to_db.send,
  CronTrigger.from_crontab("* * * * *"),
  max_instances=1
  )

  # Prune duplicates every at 12am and 12pm
  scheduler.add_job(
    dramatiq_actors.prune_duplicates.send,
    CronTrigger.from_crontab("0 */12 * * *"),
    max_instances=1
    )

  try:
    scheduler.start()
    while True:
      range = ip_range.get_random_range()
      scan(range)
      ip_range.set_as_scanned(range)
      dramatiq_actors.worker_log.send(f'Range: {range} set as scanned', __name__)
  except KeyboardInterrupt:
    scheduler.shutdown()
    print('Scheduler shutdown')
    return 0

def scan(range):
  dramatiq_actors.worker_log.send(f'Scanning range: {Color.YELLOW}{range}{Color.END} for open {PORT} port @ {RATE} kp/s', __name__)
  command = f'masscan -p{PORT} {range} --rate {RATE} --wait {3} -oJ {SCANNED_FILE_NAME}'
  os.system(command)
  # Sleep: make sure the file is written before getting ip's
  ips = []
  try:
    ips = ip_range.get_scanned_ips(SCANNED_FILE_NAME)
    dramatiq_actors.worker_log.send(f'{len(ips)} ip(s) found in range: {Color.GREEN}{range}{Color.END}', __name__)
  except json.JSONDecodeError:
    dramatiq_actors.worker_log.send(f'No servers found in range {Color.RED}{range}{Color.END}', __name__)
  total = len(ips)
  count = 0
  for ip in ips:
    count += 1
    dramatiq_actors.slp.send(ip, count, total)

if __name__ == '__main__':
  main()
