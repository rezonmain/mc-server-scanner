from pprint import pprint
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
  """
  There was a bug in one version of the scanner that pushed the same entry 
  multiple times to the database, this function deletes those duplicates entries
  The duplicates are easy to find because they'll have the same ip and timestamp
  """
  def _prune_duplicates(self):
    # Run the duplicate query here
    # FIX: this only checks for the same foundAt property, add a check for the ip to be the same too.
    agg_pipeline = [
      {"$group": {"_id": "$foundAt", "count":{"$sum": 1},"ip": {"$first": "$ip"}, "ids": {"$addToSet": "$_id"}}}, 
      {"$match": {"count": {"$gt": 1}}}
      ]
    duplicates = list(self.coll.aggregate(agg_pipeline))
    to_delete = []
    total_count = 0
    for dups in duplicates:
      total_count += dups['count']
      amount_to_delete = dups['count'] - 1
      for i in range(amount_to_delete):
        to_delete.append({'_id': dups['ids'][i]})

    
    pprint(duplicates)
    print(f'total amount of duplicates: {total_count}')
    print(f'Amount to delete: {len(to_delete)}')
    ids = {'$or': [*to_delete]}
    input('Press any key to see ids to delete')
    print(ids)
    input('Press any key to delete')
    # res = self.coll.delete_many(ids)
    # print(res)