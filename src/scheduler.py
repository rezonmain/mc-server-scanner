from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from dramatiq_actors import worker_log
from mongo import DB
from concolor import Color
import cache

def write_to_db():
  try:
    entries = cache.getAll()
    if len(entries):
      db = DB()
      res = db.insert_many(entries)
      # Remove saved items from redis store
      keys = []
      for entry in entries:
        keys.append(str(entry['ip']) + str(entry['foundAt']))
      cache.unstageMany(keys)
      worker_log(f'Succesfully added {Color.GREEN}{len(entries)}{Color.END} entries, DB responded: {res}.')
    else:
      worker_log('No staged entries to add to db.')
  except Exception as e:
    raise Exception(f'An {Color.RED}error{Color.END} ocurred on trying to write entries to mongo database, Error: {e}')

# Set up scheduler for writing to db every minute
scheduler = BackgroundScheduler()
scheduler.add_job(
write_to_db,
CronTrigger.from_crontab("* * * * *"),
max_instances=1)


