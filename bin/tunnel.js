'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BluePromise = require('bluebird');
var events = require('events');
var Nicercast = require('nicercast');
var ip = require('ip');
var audio = require('osx-audio');

// the SONOS library sometimes expects callbacks to function,
// even if we don't really care about the result
var EMPTY_CALLBACK = function EMPTY_CALLBACK() {};

var DeviceTunnel = (function (_events$EventEmitter) {
  _inherits(DeviceTunnel, _events$EventEmitter);

  _createClass(DeviceTunnel, null, [{
    key: 'createFor',
    value: function createFor(device) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var getZoneAttrs = BluePromise.promisify(device.getZoneAttrs.bind(device));

      return getZoneAttrs().then(function (zoneAttrs) {
        return new DeviceTunnel(device, zoneAttrs.CurrentZoneName, options);
      });
    }
  }]);

  function DeviceTunnel(device, deviceName, options) {
    _classCallCheck(this, DeviceTunnel);

    _get(Object.getPrototypeOf(DeviceTunnel.prototype), 'constructor', this).call(this);

    this.device = device;
    this.deviceName = deviceName;
    this.options = options;

    this.bindAirplayServer();
  }

  _createClass(DeviceTunnel, [{
    key: 'bindAirplayServer',
    value: function bindAirplayServer() {
    //TODO: Rewrite input to not require soundflower and work on more then just mac os
    var input = new audio.Input();  
    this.handleClientConnected(input);
    }
  }, {
    key: 'handleClientConnected',
    value: function handleClientConnected(audioStream) {
      var _this2 = this;

      this.icecastServer = new Nicercast(audioStream, {
        name: 'SonosLink @ ' + this.deviceName
      });

      this.icecastServer.start(0, function (port) {
        _this2.device.play({
          uri: 'x-rincon-mp3radio://' + ip.address() + ':' + port + '/listen.m3u',
          metadata: _this2.generateSonosMetadata(_this2.deviceName)
        });
      });
    }
  }, {
    key: 'generateSonosMetadata',
    value: function generateSonosMetadata(clientName) {
      return '<?xml version="1.0"?>\n<DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/">\n<item id="R:0/0/49" parentID="R:0/0" restricted="true">\n<dc:title>' + clientName + '</dc:title>\n<upnp:class>object.item.audioItem.audioBroadcast</upnp:class>\n<desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/">SA_RINCON65031_</desc>\n</item>\n</DIDL-Lite>';
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.icecastServer.stop();
    }
  }]);

  return DeviceTunnel;
})(events.EventEmitter);

module.exports = DeviceTunnel;