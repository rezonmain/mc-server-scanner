# Public minecraft server scanner

It uses [masscan](https://github.com/robertdavidgraham/masscan) and [dramatiq](https://dramatiq.io/) to scan for public minecraft servers on default port `25556`.

# How does it work
`ip_range.py` provides a class with utility functions to generate a file of ip ranges with either an /8 or /16 CIDR range. \
The scanner script chooses a random ip address range from this file and calls `masscan` with it, on scan end, it queues a server list ping that on success writes the response to a json file.

# Rate limiting masscan
Running masscan on a home network unlimited will **melt** your router, in my case, I run it at 5,000 kp/s which scans a x.x.x.x/16 range (65,536 hosts) in ~10 seconds, and at 10,000 kp/s when I'm not using the network. 

# Todo

- [ ] Containerize application
- [x] Write found servers to db (Mongo)
- [ ] Create front-end to browse servers