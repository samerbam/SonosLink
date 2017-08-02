'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var BluePromise = require('bluebird');
var sonos = require('sonos');
var DeviceTunnel = require('./tunnel');

var SonosLink = (function () {
  function SonosLink(options) {
    _classCallCheck(this, SonosLink);

    this.tunnels = {};
    this.options = options || {};
  }

  _createClass(SonosLink, [{
    key: 'start',
    value: function start() {
      var _this = this;

      return this.searchForDevices().then(function (devices) {

        var promises = devices.map(function (device) {
          return DeviceTunnel.createFor(device, _this.options).then(function (tunnel) {

            tunnel.on('error', function (err) {
                console.error(err);
            });

            _this.tunnels[tunnel.device.groupId] = tunnel;

            return tunnel;
          });
        });

        return BluePromise.all(promises);
      });
    }
  }, {
    key: 'stop',
    value: function stop() {
      return BluePromise.all(this.tunnels.map(tunnel.stop));
    }
  }, {
    key: 'searchForDevices',
    get: function get() {
      return BluePromise.promisify(sonos.LogicalDevice.search);
    }
  }]);

  return SonosLink;
})();

module.exports = SonosLink;