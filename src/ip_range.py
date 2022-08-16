import json
import os
import random
import dramatiq
from logger import log
from console_color import Color


FILE_NAME = 'ipranges.json'

class IpRange: 
  def __init__(self, cidr=16) -> None:
    self.range = cidr

  def generate_list(self):
    if self.range == 16:
      self._generate_list_16()
    elif self.range == 8:
      self._generate_list_8()
    else: 
      raise ValueError(f'CIDR range must be 16 or 8, got {self.range}')

  @dramatiq.actor
  def set_as_scanned(self, range):
    try:
      d = self._to_dict(FILE_NAME)
      d[range]['scanned'] = True
      self._to_json(d)
      log.send(f'Range: {range} set as scanned', __name__)
    except Exception as e:
      log.send(f'{Color.RED}Error: {e}{Color.END} while trying to set {range} as scanned', __name__)


  def get_random_range(self):
    range_dict = self._to_dict(FILE_NAME)
    range_list = list(range_dict.items())
    list_length = len(range_list)
    c = 0
    scanned = True
    # Return an unscanned range
    while scanned:
      _range, value = random.choice(range_list)
      scanned = value['scanned']
      # Prevents an infinite loop if all ranges have been scanned
      c += 1 
      if c >= list_length:
        raise Exception('You\'ve scanned the whole freaking internet') 
    return _range

  def get_scanned_ips(self, filename) -> list:
    scannedList = self._to_dict(filename)
    ips = []
    for scan in scannedList: ips.append(scan['ip'])
    return ips

  def _generate_list_8(self):
    first_octals = list(range(0, 0xff))
    to_be_json = {}
    for address in first_octals:
      to_be_json[f'{str(address)}.0.0.0/8'] = {'scanned': False}
    self._to_json(to_be_json)
    print(f'[{__name__}.py]: List written to {os.getcwd()}/{FILE_NAME}')


  def _generate_list_16(self):
    first_octals = list(range(0, 0xff))
    second_octals = list(range(0, 0xff))
    to_be_json = {}
    for first_octal in first_octals:
      for second_octal in second_octals:
        to_be_json[f'{str(first_octal)}.{str(second_octal)}.0.0/16'] = {'scanned': False}
    self._to_json(to_be_json)
    print(f'[{__name__}.py]: List written to {os.getcwd()}/{FILE_NAME}')

  def _to_json(self, dict, filename=FILE_NAME):
    with open(filename, 'w') as file:
      file.write(json.dumps(dict, indent=4))
      
  def _to_dict(self, filename):
    with open(filename, 'r') as file:
      return json.load(file)