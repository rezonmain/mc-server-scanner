import os
from pymongo import MongoClient
import iprange

class DB: 
  def __init__(self):
    self.URI = os.getenv('MONGO_URI')
    self.client = MongoClient(self.URI)
    self.db = self.client.scanner_db
    self.coll = self.db.servers

  def read_all(self):
    cursor = self.coll.find({})
    for doc in cursor:
      print(doc)
    self._close()

  def insert_one(self, server):
    res = self.coll.insert_one(server)
    self._close()
    return res

  def insert_many(self, serverArr):
    res = self.coll.insert_many(serverArr)
    self._close()
    return res

  def _seed_db(self):
    ip = iprange.IpRange()
    serverList = ip._to_dict('found.json')
    res = self.insert_many(serverList)

  def _close(self):
    self.client.close()