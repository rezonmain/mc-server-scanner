import os
from pymongo import MongoClient

class DB: 
  def __init__(self):
    self.URI = os.getenv('MONGO_URI')
    self.client = MongoClient(self.URI)
    self.db = self.client.scanned
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

  def _close(self):
    self.client.close()
  """
  There was a bug in one version of the scanner that pushed the same entry 
  multiple times to the database, this function deletes those duplicates entries
  The duplicates are easy to find because they'll have the same ip and timestamp
  """
  def prune_duplicates(self, ts):
    agg_pipeline = [{"$match": {"foundAt": {"$gt": ts}}}, 
    {"$group": {"_id": {"foundAt":"$foundAt", "ip": "$ip"}, "count":{"$sum": 1}, "ids": {"$addToSet": "$_id"}}}, 
    {"$match": {"count": {"$gt": 1}}}]
    duplicates = list(self.coll.aggregate(agg_pipeline, allowDiskUse=True))
    to_delete = []
    total_count = 0
    for dups in duplicates:
      total_count += dups['count']
      amount_to_delete = dups['count'] - 1
      for i in range(amount_to_delete):
        to_delete.append({'_id': dups['ids'][i]})

    if (len(to_delete) <= 0):
      return False

    ids = {'$or': [*to_delete]}
    res =  [self.coll.delete_many(ids), total_count]
    self._close()
    return res
