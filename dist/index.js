'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// External Deps
var Eth = require('ethjs-query');
var EthContract = require('ethjs-contract');
var namehash = require('eth-ens-namehash');

// ABIs
var registryAbi = require('./abis/registry.json');
var resolverAbi = require('./abis/resolver.json');

// Map network to known ENS registries
var networkMap = require('ethereum-ens-network-map');
var emptyHash = '0x0000000000000000000000000000000000000000000000000000000000000000';
var emptyAddr = '0x0000000000000000000000000000000000000000';

var NotFoundError = new Error('ENS name not defined.');
var BadCharacterError = new Error('Illegal Character for ENS.');

var Ens = function () {
  function Ens() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Ens);

    var provider = opts.provider,
        network = opts.network;
    var registryAddress = opts.registryAddress;

    // Validations

    if (!provider) {
      throw new Error('The EthJsENS Constructor requires a provider.');
    }

    // Requires EITHER a network or a registryAddress
    if (!network && !registryAddress) {
      throw new Error('The EthJsENS Constructor requires a network or registry address.');
    }

    this.provider = provider;
    this.eth = new Eth(this.provider);
    this.contract = new EthContract(this.eth);
    this.namehash = namehash;

    // Link to Registry
    this.Registry = this.contract(registryAbi);
    if (!registryAddress && network) {
      registryAddress = networkMap[network];
    }
    this.registry = this.Registry.at(registryAddress);

    // Create Resolver class
    this.Resolver = this.contract(resolverAbi);
  }

  _createClass(Ens, [{
    key: 'lookup',
    value: function lookup() {
      var _this = this;

      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return this.getNamehash(name).then(function (node) {
        if (node === emptyHash) {
          return Promise.reject(NotFoundError);
        }
        return _this.resolveAddressForNode(node);
      });
    }
  }, {
    key: 'getNamehash',
    value: function getNamehash(name) {
      try {
        return Promise.resolve(namehash(name));
      } catch (e) {
        return Promise.reject(BadCharacterError);
      }
    }
  }, {
    key: 'getOwner',
    value: function getOwner() {
      var _this2 = this;

      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return this.getNamehash(name).then(function (node) {
        return _this2.getOwnerForNode(node);
      });
    }
  }, {
    key: 'getOwnerForNode',
    value: function getOwnerForNode(node) {
      if (node === emptyHash) {
        return Promise.reject(NotFoundError);
      }
      return this.registry.owner(node).then(function (result) {
        var ownerAddress = result[0];
        if (ownerAddress === emptyAddr) {
          throw NotFoundError;
        }

        return ownerAddress;
      });
    }
  }, {
    key: 'getResolver',
    value: function getResolver() {
      var _this3 = this;

      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return this.getNamehash(name).then(function (node) {
        return _this3.getResolverForNode(node);
      });
    }
  }, {
    key: 'getResolverAddress',
    value: function getResolverAddress() {
      var _this4 = this;

      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return this.getNamehash(name).then(function (node) {
        return _this4.getResolverAddressForNode(node);
      });
    }
  }, {
    key: 'getResolverForNode',
    value: function getResolverForNode(node) {
      var _this5 = this;

      if (!node.startsWith('0x')) {
        node = '0x' + node;
      }

      return this.getResolverAddressForNode(node).then(function (resolverAddress) {
        return _this5.Resolver.at(resolverAddress);
      });
    }
  }, {
    key: 'getResolverAddressForNode',
    value: function getResolverAddressForNode(node) {
      return this.registry.resolver(node).then(function (result) {
        var resolverAddress = result[0];
        if (resolverAddress === emptyAddr) {
          throw NotFoundError;
        }
        return resolverAddress;
      });
    }
  }, {
    key: 'resolveAddressForNode',
    value: function resolveAddressForNode(node) {
      return this.getResolverForNode(node).then(function (resolver) {
        return resolver.addr(node);
      }).then(function (result) {
        return result[0];
      });
    }
  }, {
    key: 'reverse',
    value: function reverse(address) {
      var _this6 = this;

      if (!address) {
        return Promise.reject(new Error('Must supply an address to reverse lookup.'));
      }

      if (address.startsWith('0x')) {
        address = address.slice(2);
      }

      var name = address.toLowerCase() + '.addr.reverse';
      var node = namehash(name);
      return this.getNamehash(name).then(function (node) {
        return _this6.getResolverForNode(node);
      }).then(function (resolver) {
        return resolver.name(node);
      }).then(function (results) {
        return results[0];
      });
    }
  }]);

  return Ens;
}();

module.exports = Ens;