# Public minecraft server scanner

It uses [masscan](https://github.com/robertdavidgraham/masscan) and [dramatiq](https://dramatiq.io/) to scan for public minecraft servers on default port `25556`.

# How does it work
`ip_range.py` provides a class with utility functions to generate a file of ip ranges with either an /8 or /16 CIDR range. \
The scanner script chooses a random ip address range from this file and calls `masscan` with it, on scan end, it queues a server list ping that on success writes the response to a json file.

# Installing dependencies

(I know its too much,  working on creating a docker container)

## Masscan
    sudo apt-get --assume-yes install git make gcc
    git clone https://github.com/robertdavidgraham/masscan
    cd masscan
    make
    make install

## pip
    sudo apt install python3-pip

## redis
    curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

    echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

    sudo apt-get update
    sudo apt-get install redis
Test if redis was install correctly:

    redis-cli
    127.0.0.1:6379> ping
    PONG

## Dramatiq
    pip install -U 'dramatiq[redis, watch]'

## Dotenv
    pip install python-dotenv

## pymongo
    python3 -m pip install pymongo

## Clone the repo:
    git clone https://github.com/rezonmain/mc-server-scanner.git
    cd mc-server-scanner

# Configuring
To enable saving found servers to a db, copy the ```.env.example``` file to ```.env``` in the root directory
     
     cp .env.example .env

Edit the ```MONGO_URI``` environment variable to your connection string. You can create a free MongoDB cluster with [Atlas](https://www.mongodb.com/atlas)


# Rate limiting masscan
Running masscan on a home network unlimited will **melt** your router, in my case, I run it at 5,000 kp/s which scans a x.x.x.x/16 range (65,536 hosts) in ~10 seconds, and at 10,000 kp/s when I'm not using the network.

To edit the rate at which masscan runs, edit the source file ```scanner.py```
    
    PORT = '25565'
    RATE = '25000' # <- set to your liking
    SCANNED_FILE_NAME = 'res.json'
    FOUND_FILE_NAME = 'found.json'
    ip_range = IpRange()

# Usage
In a terminal session start the dramatiq worker, while in the root directory run:

    cd src
    dramatiq scanner

You will see this output:

    > dramatiq scanner
    [2022-08-15 18:12:56,288] [PID 1449] [MainThread] [dramatiq.MainProcess] [INFO] Dramatiq '1.13.0' is booting up.
    [2022-08-15 18:12:56,283] [PID 1450] [MainThread] [dramatiq.WorkerProcess(0)] [INFO] Worker process is ready for action.
    [2022-08-15 18:12:56,281] [PID 1451] [MainThread] [dramatiq.WorkerProcess(1)] [INFO] Worker process is ready for action.
    [2022-08-15 18:12:56,289] [PID 1474] [MainThread] [dramatiq.ForkProcess(0)] [INFO] Fork process 'dramatiq.middleware.prometheus:_run_exposition_server' is ready for action.

In another terminal window, generate the ```ipranges.json``` file, while in the root directory run:
    
    cd src
    python3
    >>> from ip_range import IpRange
    >>> ip = IpRange()
    >>> ip.generate_list()
    [ip_range.py]: List written to /home/user/src/mc-server-scanner/src/ipranges.json

One more thing, create ```res.json``` file:
    
    touch res.json

Start the scanner

    python3 scanner.py

It may ask for sudo, this is because masscan needs sudo privilages to run

Note for future me:
If masscan fails do:

    sudo apt-get install libpcap-dev




# Todo

- [ ] Containerize application
- [x] Write found servers to db (Mongo)
- [ ] Create front-end to browse servers