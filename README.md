SonosLink
========

SonosLink emulates a sonos connect so that you can 

Compatability
-------------
Currently SonosLink only works on mac os. I have plans to add support for Windows, Linux, Raspberry Pi, and any I can think of.

Installation
-----------
```
$ git clone https://github.com/samerbam/SonosLink.git
$ cd sonoslink
$ npm install
$ node ./bin/index.js
```
*note: you need to install soundflower and set your computers input & output to either soundflower (2ch) or soundflower (64ch) in order to broadcast system sound

Example usage
-------------
```
$ node ./bin/index.js
Searching for Sonos devices on network...

Dining Room Speaker (@ 192.168.0.15:1400, RINCON_Bxxxxxxxxxxxxxxx0:3)

Search complete. Set up 1 device tunnel.
```

Credit
------
Most of this code was taken from AirSonos (https://github.com/stephen/airsonos) written by: Stephen Wan (https://github.com/stephen)
