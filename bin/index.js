#!/usr/bin/env node
'use strict';

var flags = require('flags');
var SonosLink = require('./sonoslink');

flags.defineBoolean('version', false, 'return version number');
flags.defineInteger('timeout', 5, 'disconnect timeout (in seconds)');
flags.parse();


console.log('Searching for Sonos devices on network...\n');

var instance = new SonosLink({
  timeout: flags.get('timeout')
});


instance.start().then(function (tunnels) {

  tunnels.forEach(function (tunnel) {
    console.log(tunnel.deviceName + ' (@ ' + tunnel.device.host + ':' + tunnel.device.port + ', ' + tunnel.device.groupId + ')');
  });

  console.log('\nSearch complete. Set up ' + tunnels.length + ' device tunnel' + (tunnels.length === 1 ? '' : 's') + '.');
}).done();
