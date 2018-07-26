(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports=[
  {
    "constant": true,
    "inputs": [
      {
        "name": "node",
        "type": "bytes32"
      }
    ],
    "name": "resolver",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "node",
        "type": "bytes32"
      }
    ],
    "name": "owner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "node",
        "type": "bytes32"
      },
      {
        "name": "resolver",
        "type": "address"
      }
    ],
    "name": "setResolver",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "node",
        "type": "bytes32"
      },
      {
        "name": "label",
        "type": "bytes32"
      },
      {
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "setSubnodeOwner",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "node",
        "type": "bytes32"
      },
      {
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "setOwner",
    "outputs": [],
    "type": "function"
  }
]
},{}],2:[function(require,module,exports){
module.exports=[
  {
    "constant": true,
    "inputs": [
      {
        "name": "node",
        "type": "bytes32"
      }
    ],
    "name": "addr",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "node",
        "type": "bytes32"
      }
    ],
    "name": "content",
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "node",
        "type": "bytes32"
      }
    ],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "node",
        "type": "bytes32"
      },
      {
        "name": "kind",
        "type": "bytes32"
      }
    ],
    "name": "has",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "node",
        "type": "bytes32"
      },
      {
        "name": "addr",
        "type": "address"
      }
    ],
    "name": "setAddr",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "node",
        "type": "bytes32"
      },
      {
        "name": "hash",
        "type": "bytes32"
      }
    ],
    "name": "setContent",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "node",
        "type": "bytes32"
      },
      {
        "name": "name",
        "type": "string"
      }
    ],
    "name": "setName",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "node",
        "type": "bytes32"
      },
      {
        "name": "contentType",
        "type": "uint256"
      }
    ],
    "name": "ABI",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "bytes"
      }
    ],
    "payable": false,
    "type": "function"
  }
]
},{}],3:[function(require,module,exports){
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
},{"./abis/registry.json":1,"./abis/resolver.json":2,"eth-ens-namehash":9,"ethereum-ens-network-map":11,"ethjs-contract":14,"ethjs-query":18}],4:[function(require,module,exports){
const ENS = require('../dist/index')
const HttpProvider = require('ethjs-provider-http')
const networkMap = require('../lib/network-map.json')
let ens

// For MetaMask or Mist compatibility:
window.addEventListener('load', function() {

  if (typeof window.web3 !== 'undefined') {
    console.log('web3 browser detected, using.')
    web3.version.getNetwork(function (err, network) {
      if (err) {
        return resultField.innerText = 'There was a problem: ' + err.message
      }
      ens = new ENS({ provider: web3.currentProvider, network: network })
    })
  } else {
    console.log('no web3 browser detected, using infura.')
    const provider = new HttpProvider('https://mainnet.infura.io')
    ens = new ENS({ provider, network: '1' })
  }

})

searchButton.addEventListener('click', function() {
  console.log('clicked button.')
  var query = lookupField.value
  console.log('querying for ' + query)
  ens.lookup(query)
  .then((address) => {
    console.log('ens returned ' + address)
    resultField.innerText = address
  })
  .catch((reason) => {
    console.log('ens failed!')
    console.error(reason)
    resultField.innerText = 'There was a problem: ' + reason.message
  })

})

},{"../dist/index":3,"../lib/network-map.json":5,"ethjs-provider-http":17}],5:[function(require,module,exports){
module.exports={
  "1": {
    "registry": "314159265dd8dbb310642f98f50c066173c1259b"
  },
  "3": {
    "registry": "112234455c3a32fd11230c42e7bccd4a84e02010",
    "resolver": "C68De5B43C3d980B0C110A77a5F78d3c4c4d63B4"
  }
}

},{}],6:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],7:[function(require,module,exports){
(function (module, exports) {
  'use strict';

  // Utils
  function assert (val, msg) {
    if (!val) throw new Error(msg || 'Assertion failed');
  }

  // Could use `inherits` module, but don't want to move from single file
  // architecture yet.
  function inherits (ctor, superCtor) {
    ctor.super_ = superCtor;
    var TempCtor = function () {};
    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  }

  // BN

  function BN (number, base, endian) {
    if (BN.isBN(number)) {
      return number;
    }

    this.negative = 0;
    this.words = null;
    this.length = 0;

    // Reduction context
    this.red = null;

    if (number !== null) {
      if (base === 'le' || base === 'be') {
        endian = base;
        base = 10;
      }

      this._init(number || 0, base || 10, endian || 'be');
    }
  }
  if (typeof module === 'object') {
    module.exports = BN;
  } else {
    exports.BN = BN;
  }

  BN.BN = BN;
  BN.wordSize = 26;

  var Buffer;
  try {
    Buffer = require('buf' + 'fer').Buffer;
  } catch (e) {
  }

  BN.isBN = function isBN (num) {
    if (num instanceof BN) {
      return true;
    }

    return num !== null && typeof num === 'object' &&
      num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
  };

  BN.max = function max (left, right) {
    if (left.cmp(right) > 0) return left;
    return right;
  };

  BN.min = function min (left, right) {
    if (left.cmp(right) < 0) return left;
    return right;
  };

  BN.prototype._init = function init (number, base, endian) {
    if (typeof number === 'number') {
      return this._initNumber(number, base, endian);
    }

    if (typeof number === 'object') {
      return this._initArray(number, base, endian);
    }

    if (base === 'hex') {
      base = 16;
    }
    assert(base === (base | 0) && base >= 2 && base <= 36);

    number = number.toString().replace(/\s+/g, '');
    var start = 0;
    if (number[0] === '-') {
      start++;
    }

    if (base === 16) {
      this._parseHex(number, start);
    } else {
      this._parseBase(number, base, start);
    }

    if (number[0] === '-') {
      this.negative = 1;
    }

    this.strip();

    if (endian !== 'le') return;

    this._initArray(this.toArray(), base, endian);
  };

  BN.prototype._initNumber = function _initNumber (number, base, endian) {
    if (number < 0) {
      this.negative = 1;
      number = -number;
    }
    if (number < 0x4000000) {
      this.words = [ number & 0x3ffffff ];
      this.length = 1;
    } else if (number < 0x10000000000000) {
      this.words = [
        number & 0x3ffffff,
        (number / 0x4000000) & 0x3ffffff
      ];
      this.length = 2;
    } else {
      assert(number < 0x20000000000000); // 2 ^ 53 (unsafe)
      this.words = [
        number & 0x3ffffff,
        (number / 0x4000000) & 0x3ffffff,
        1
      ];
      this.length = 3;
    }

    if (endian !== 'le') return;

    // Reverse the bytes
    this._initArray(this.toArray(), base, endian);
  };

  BN.prototype._initArray = function _initArray (number, base, endian) {
    // Perhaps a Uint8Array
    assert(typeof number.length === 'number');
    if (number.length <= 0) {
      this.words = [ 0 ];
      this.length = 1;
      return this;
    }

    this.length = Math.ceil(number.length / 3);
    this.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      this.words[i] = 0;
    }

    var j, w;
    var off = 0;
    if (endian === 'be') {
      for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
        w = number[i] | (number[i - 1] << 8) | (number[i - 2] << 16);
        this.words[j] |= (w << off) & 0x3ffffff;
        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
        off += 24;
        if (off >= 26) {
          off -= 26;
          j++;
        }
      }
    } else if (endian === 'le') {
      for (i = 0, j = 0; i < number.length; i += 3) {
        w = number[i] | (number[i + 1] << 8) | (number[i + 2] << 16);
        this.words[j] |= (w << off) & 0x3ffffff;
        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
        off += 24;
        if (off >= 26) {
          off -= 26;
          j++;
        }
      }
    }
    return this.strip();
  };

  function parseHex (str, start, end) {
    var r = 0;
    var len = Math.min(str.length, end);
    for (var i = start; i < len; i++) {
      var c = str.charCodeAt(i) - 48;

      r <<= 4;

      // 'a' - 'f'
      if (c >= 49 && c <= 54) {
        r |= c - 49 + 0xa;

      // 'A' - 'F'
      } else if (c >= 17 && c <= 22) {
        r |= c - 17 + 0xa;

      // '0' - '9'
      } else {
        r |= c & 0xf;
      }
    }
    return r;
  }

  BN.prototype._parseHex = function _parseHex (number, start) {
    // Create possibly bigger array to ensure that it fits the number
    this.length = Math.ceil((number.length - start) / 6);
    this.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      this.words[i] = 0;
    }

    var j, w;
    // Scan 24-bit chunks and add them to the number
    var off = 0;
    for (i = number.length - 6, j = 0; i >= start; i -= 6) {
      w = parseHex(number, i, i + 6);
      this.words[j] |= (w << off) & 0x3ffffff;
      // NOTE: `0x3fffff` is intentional here, 26bits max shift + 24bit hex limb
      this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
      off += 24;
      if (off >= 26) {
        off -= 26;
        j++;
      }
    }
    if (i + 6 !== start) {
      w = parseHex(number, start, i + 6);
      this.words[j] |= (w << off) & 0x3ffffff;
      this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
    }
    this.strip();
  };

  function parseBase (str, start, end, mul) {
    var r = 0;
    var len = Math.min(str.length, end);
    for (var i = start; i < len; i++) {
      var c = str.charCodeAt(i) - 48;

      r *= mul;

      // 'a'
      if (c >= 49) {
        r += c - 49 + 0xa;

      // 'A'
      } else if (c >= 17) {
        r += c - 17 + 0xa;

      // '0' - '9'
      } else {
        r += c;
      }
    }
    return r;
  }

  BN.prototype._parseBase = function _parseBase (number, base, start) {
    // Initialize as zero
    this.words = [ 0 ];
    this.length = 1;

    // Find length of limb in base
    for (var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base) {
      limbLen++;
    }
    limbLen--;
    limbPow = (limbPow / base) | 0;

    var total = number.length - start;
    var mod = total % limbLen;
    var end = Math.min(total, total - mod) + start;

    var word = 0;
    for (var i = start; i < end; i += limbLen) {
      word = parseBase(number, i, i + limbLen, base);

      this.imuln(limbPow);
      if (this.words[0] + word < 0x4000000) {
        this.words[0] += word;
      } else {
        this._iaddn(word);
      }
    }

    if (mod !== 0) {
      var pow = 1;
      word = parseBase(number, i, number.length, base);

      for (i = 0; i < mod; i++) {
        pow *= base;
      }

      this.imuln(pow);
      if (this.words[0] + word < 0x4000000) {
        this.words[0] += word;
      } else {
        this._iaddn(word);
      }
    }
  };

  BN.prototype.copy = function copy (dest) {
    dest.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      dest.words[i] = this.words[i];
    }
    dest.length = this.length;
    dest.negative = this.negative;
    dest.red = this.red;
  };

  BN.prototype.clone = function clone () {
    var r = new BN(null);
    this.copy(r);
    return r;
  };

  BN.prototype._expand = function _expand (size) {
    while (this.length < size) {
      this.words[this.length++] = 0;
    }
    return this;
  };

  // Remove leading `0` from `this`
  BN.prototype.strip = function strip () {
    while (this.length > 1 && this.words[this.length - 1] === 0) {
      this.length--;
    }
    return this._normSign();
  };

  BN.prototype._normSign = function _normSign () {
    // -0 = 0
    if (this.length === 1 && this.words[0] === 0) {
      this.negative = 0;
    }
    return this;
  };

  BN.prototype.inspect = function inspect () {
    return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
  };

  /*

  var zeros = [];
  var groupSizes = [];
  var groupBases = [];

  var s = '';
  var i = -1;
  while (++i < BN.wordSize) {
    zeros[i] = s;
    s += '0';
  }
  groupSizes[0] = 0;
  groupSizes[1] = 0;
  groupBases[0] = 0;
  groupBases[1] = 0;
  var base = 2 - 1;
  while (++base < 36 + 1) {
    var groupSize = 0;
    var groupBase = 1;
    while (groupBase < (1 << BN.wordSize) / base) {
      groupBase *= base;
      groupSize += 1;
    }
    groupSizes[base] = groupSize;
    groupBases[base] = groupBase;
  }

  */

  var zeros = [
    '',
    '0',
    '00',
    '000',
    '0000',
    '00000',
    '000000',
    '0000000',
    '00000000',
    '000000000',
    '0000000000',
    '00000000000',
    '000000000000',
    '0000000000000',
    '00000000000000',
    '000000000000000',
    '0000000000000000',
    '00000000000000000',
    '000000000000000000',
    '0000000000000000000',
    '00000000000000000000',
    '000000000000000000000',
    '0000000000000000000000',
    '00000000000000000000000',
    '000000000000000000000000',
    '0000000000000000000000000'
  ];

  var groupSizes = [
    0, 0,
    25, 16, 12, 11, 10, 9, 8,
    8, 7, 7, 7, 7, 6, 6,
    6, 6, 6, 6, 6, 5, 5,
    5, 5, 5, 5, 5, 5, 5,
    5, 5, 5, 5, 5, 5, 5
  ];

  var groupBases = [
    0, 0,
    33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216,
    43046721, 10000000, 19487171, 35831808, 62748517, 7529536, 11390625,
    16777216, 24137569, 34012224, 47045881, 64000000, 4084101, 5153632,
    6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149,
    24300000, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176
  ];

  BN.prototype.toString = function toString (base, padding) {
    base = base || 10;
    padding = padding | 0 || 1;

    var out;
    if (base === 16 || base === 'hex') {
      out = '';
      var off = 0;
      var carry = 0;
      for (var i = 0; i < this.length; i++) {
        var w = this.words[i];
        var word = (((w << off) | carry) & 0xffffff).toString(16);
        carry = (w >>> (24 - off)) & 0xffffff;
        if (carry !== 0 || i !== this.length - 1) {
          out = zeros[6 - word.length] + word + out;
        } else {
          out = word + out;
        }
        off += 2;
        if (off >= 26) {
          off -= 26;
          i--;
        }
      }
      if (carry !== 0) {
        out = carry.toString(16) + out;
      }
      while (out.length % padding !== 0) {
        out = '0' + out;
      }
      if (this.negative !== 0) {
        out = '-' + out;
      }
      return out;
    }

    if (base === (base | 0) && base >= 2 && base <= 36) {
      // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
      var groupSize = groupSizes[base];
      // var groupBase = Math.pow(base, groupSize);
      var groupBase = groupBases[base];
      out = '';
      var c = this.clone();
      c.negative = 0;
      while (!c.isZero()) {
        var r = c.modn(groupBase).toString(base);
        c = c.idivn(groupBase);

        if (!c.isZero()) {
          out = zeros[groupSize - r.length] + r + out;
        } else {
          out = r + out;
        }
      }
      if (this.isZero()) {
        out = '0' + out;
      }
      while (out.length % padding !== 0) {
        out = '0' + out;
      }
      if (this.negative !== 0) {
        out = '-' + out;
      }
      return out;
    }

    assert(false, 'Base should be between 2 and 36');
  };

  BN.prototype.toNumber = function toNumber () {
    var ret = this.words[0];
    if (this.length === 2) {
      ret += this.words[1] * 0x4000000;
    } else if (this.length === 3 && this.words[2] === 0x01) {
      // NOTE: at this stage it is known that the top bit is set
      ret += 0x10000000000000 + (this.words[1] * 0x4000000);
    } else if (this.length > 2) {
      assert(false, 'Number can only safely store up to 53 bits');
    }
    return (this.negative !== 0) ? -ret : ret;
  };

  BN.prototype.toJSON = function toJSON () {
    return this.toString(16);
  };

  BN.prototype.toBuffer = function toBuffer (endian, length) {
    assert(typeof Buffer !== 'undefined');
    return this.toArrayLike(Buffer, endian, length);
  };

  BN.prototype.toArray = function toArray (endian, length) {
    return this.toArrayLike(Array, endian, length);
  };

  BN.prototype.toArrayLike = function toArrayLike (ArrayType, endian, length) {
    var byteLength = this.byteLength();
    var reqLength = length || Math.max(1, byteLength);
    assert(byteLength <= reqLength, 'byte array longer than desired length');
    assert(reqLength > 0, 'Requested array length <= 0');

    this.strip();
    var littleEndian = endian === 'le';
    var res = new ArrayType(reqLength);

    var b, i;
    var q = this.clone();
    if (!littleEndian) {
      // Assume big-endian
      for (i = 0; i < reqLength - byteLength; i++) {
        res[i] = 0;
      }

      for (i = 0; !q.isZero(); i++) {
        b = q.andln(0xff);
        q.iushrn(8);

        res[reqLength - i - 1] = b;
      }
    } else {
      for (i = 0; !q.isZero(); i++) {
        b = q.andln(0xff);
        q.iushrn(8);

        res[i] = b;
      }

      for (; i < reqLength; i++) {
        res[i] = 0;
      }
    }

    return res;
  };

  if (Math.clz32) {
    BN.prototype._countBits = function _countBits (w) {
      return 32 - Math.clz32(w);
    };
  } else {
    BN.prototype._countBits = function _countBits (w) {
      var t = w;
      var r = 0;
      if (t >= 0x1000) {
        r += 13;
        t >>>= 13;
      }
      if (t >= 0x40) {
        r += 7;
        t >>>= 7;
      }
      if (t >= 0x8) {
        r += 4;
        t >>>= 4;
      }
      if (t >= 0x02) {
        r += 2;
        t >>>= 2;
      }
      return r + t;
    };
  }

  BN.prototype._zeroBits = function _zeroBits (w) {
    // Short-cut
    if (w === 0) return 26;

    var t = w;
    var r = 0;
    if ((t & 0x1fff) === 0) {
      r += 13;
      t >>>= 13;
    }
    if ((t & 0x7f) === 0) {
      r += 7;
      t >>>= 7;
    }
    if ((t & 0xf) === 0) {
      r += 4;
      t >>>= 4;
    }
    if ((t & 0x3) === 0) {
      r += 2;
      t >>>= 2;
    }
    if ((t & 0x1) === 0) {
      r++;
    }
    return r;
  };

  // Return number of used bits in a BN
  BN.prototype.bitLength = function bitLength () {
    var w = this.words[this.length - 1];
    var hi = this._countBits(w);
    return (this.length - 1) * 26 + hi;
  };

  function toBitArray (num) {
    var w = new Array(num.bitLength());

    for (var bit = 0; bit < w.length; bit++) {
      var off = (bit / 26) | 0;
      var wbit = bit % 26;

      w[bit] = (num.words[off] & (1 << wbit)) >>> wbit;
    }

    return w;
  }

  // Number of trailing zero bits
  BN.prototype.zeroBits = function zeroBits () {
    if (this.isZero()) return 0;

    var r = 0;
    for (var i = 0; i < this.length; i++) {
      var b = this._zeroBits(this.words[i]);
      r += b;
      if (b !== 26) break;
    }
    return r;
  };

  BN.prototype.byteLength = function byteLength () {
    return Math.ceil(this.bitLength() / 8);
  };

  BN.prototype.toTwos = function toTwos (width) {
    if (this.negative !== 0) {
      return this.abs().inotn(width).iaddn(1);
    }
    return this.clone();
  };

  BN.prototype.fromTwos = function fromTwos (width) {
    if (this.testn(width - 1)) {
      return this.notn(width).iaddn(1).ineg();
    }
    return this.clone();
  };

  BN.prototype.isNeg = function isNeg () {
    return this.negative !== 0;
  };

  // Return negative clone of `this`
  BN.prototype.neg = function neg () {
    return this.clone().ineg();
  };

  BN.prototype.ineg = function ineg () {
    if (!this.isZero()) {
      this.negative ^= 1;
    }

    return this;
  };

  // Or `num` with `this` in-place
  BN.prototype.iuor = function iuor (num) {
    while (this.length < num.length) {
      this.words[this.length++] = 0;
    }

    for (var i = 0; i < num.length; i++) {
      this.words[i] = this.words[i] | num.words[i];
    }

    return this.strip();
  };

  BN.prototype.ior = function ior (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuor(num);
  };

  // Or `num` with `this`
  BN.prototype.or = function or (num) {
    if (this.length > num.length) return this.clone().ior(num);
    return num.clone().ior(this);
  };

  BN.prototype.uor = function uor (num) {
    if (this.length > num.length) return this.clone().iuor(num);
    return num.clone().iuor(this);
  };

  // And `num` with `this` in-place
  BN.prototype.iuand = function iuand (num) {
    // b = min-length(num, this)
    var b;
    if (this.length > num.length) {
      b = num;
    } else {
      b = this;
    }

    for (var i = 0; i < b.length; i++) {
      this.words[i] = this.words[i] & num.words[i];
    }

    this.length = b.length;

    return this.strip();
  };

  BN.prototype.iand = function iand (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuand(num);
  };

  // And `num` with `this`
  BN.prototype.and = function and (num) {
    if (this.length > num.length) return this.clone().iand(num);
    return num.clone().iand(this);
  };

  BN.prototype.uand = function uand (num) {
    if (this.length > num.length) return this.clone().iuand(num);
    return num.clone().iuand(this);
  };

  // Xor `num` with `this` in-place
  BN.prototype.iuxor = function iuxor (num) {
    // a.length > b.length
    var a;
    var b;
    if (this.length > num.length) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    for (var i = 0; i < b.length; i++) {
      this.words[i] = a.words[i] ^ b.words[i];
    }

    if (this !== a) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    this.length = a.length;

    return this.strip();
  };

  BN.prototype.ixor = function ixor (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuxor(num);
  };

  // Xor `num` with `this`
  BN.prototype.xor = function xor (num) {
    if (this.length > num.length) return this.clone().ixor(num);
    return num.clone().ixor(this);
  };

  BN.prototype.uxor = function uxor (num) {
    if (this.length > num.length) return this.clone().iuxor(num);
    return num.clone().iuxor(this);
  };

  // Not ``this`` with ``width`` bitwidth
  BN.prototype.inotn = function inotn (width) {
    assert(typeof width === 'number' && width >= 0);

    var bytesNeeded = Math.ceil(width / 26) | 0;
    var bitsLeft = width % 26;

    // Extend the buffer with leading zeroes
    this._expand(bytesNeeded);

    if (bitsLeft > 0) {
      bytesNeeded--;
    }

    // Handle complete words
    for (var i = 0; i < bytesNeeded; i++) {
      this.words[i] = ~this.words[i] & 0x3ffffff;
    }

    // Handle the residue
    if (bitsLeft > 0) {
      this.words[i] = ~this.words[i] & (0x3ffffff >> (26 - bitsLeft));
    }

    // And remove leading zeroes
    return this.strip();
  };

  BN.prototype.notn = function notn (width) {
    return this.clone().inotn(width);
  };

  // Set `bit` of `this`
  BN.prototype.setn = function setn (bit, val) {
    assert(typeof bit === 'number' && bit >= 0);

    var off = (bit / 26) | 0;
    var wbit = bit % 26;

    this._expand(off + 1);

    if (val) {
      this.words[off] = this.words[off] | (1 << wbit);
    } else {
      this.words[off] = this.words[off] & ~(1 << wbit);
    }

    return this.strip();
  };

  // Add `num` to `this` in-place
  BN.prototype.iadd = function iadd (num) {
    var r;

    // negative + positive
    if (this.negative !== 0 && num.negative === 0) {
      this.negative = 0;
      r = this.isub(num);
      this.negative ^= 1;
      return this._normSign();

    // positive + negative
    } else if (this.negative === 0 && num.negative !== 0) {
      num.negative = 0;
      r = this.isub(num);
      num.negative = 1;
      return r._normSign();
    }

    // a.length > b.length
    var a, b;
    if (this.length > num.length) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    var carry = 0;
    for (var i = 0; i < b.length; i++) {
      r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
      this.words[i] = r & 0x3ffffff;
      carry = r >>> 26;
    }
    for (; carry !== 0 && i < a.length; i++) {
      r = (a.words[i] | 0) + carry;
      this.words[i] = r & 0x3ffffff;
      carry = r >>> 26;
    }

    this.length = a.length;
    if (carry !== 0) {
      this.words[this.length] = carry;
      this.length++;
    // Copy the rest of the words
    } else if (a !== this) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    return this;
  };

  // Add `num` to `this`
  BN.prototype.add = function add (num) {
    var res;
    if (num.negative !== 0 && this.negative === 0) {
      num.negative = 0;
      res = this.sub(num);
      num.negative ^= 1;
      return res;
    } else if (num.negative === 0 && this.negative !== 0) {
      this.negative = 0;
      res = num.sub(this);
      this.negative = 1;
      return res;
    }

    if (this.length > num.length) return this.clone().iadd(num);

    return num.clone().iadd(this);
  };

  // Subtract `num` from `this` in-place
  BN.prototype.isub = function isub (num) {
    // this - (-num) = this + num
    if (num.negative !== 0) {
      num.negative = 0;
      var r = this.iadd(num);
      num.negative = 1;
      return r._normSign();

    // -this - num = -(this + num)
    } else if (this.negative !== 0) {
      this.negative = 0;
      this.iadd(num);
      this.negative = 1;
      return this._normSign();
    }

    // At this point both numbers are positive
    var cmp = this.cmp(num);

    // Optimization - zeroify
    if (cmp === 0) {
      this.negative = 0;
      this.length = 1;
      this.words[0] = 0;
      return this;
    }

    // a > b
    var a, b;
    if (cmp > 0) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    var carry = 0;
    for (var i = 0; i < b.length; i++) {
      r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
      carry = r >> 26;
      this.words[i] = r & 0x3ffffff;
    }
    for (; carry !== 0 && i < a.length; i++) {
      r = (a.words[i] | 0) + carry;
      carry = r >> 26;
      this.words[i] = r & 0x3ffffff;
    }

    // Copy rest of the words
    if (carry === 0 && i < a.length && a !== this) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    this.length = Math.max(this.length, i);

    if (a !== this) {
      this.negative = 1;
    }

    return this.strip();
  };

  // Subtract `num` from `this`
  BN.prototype.sub = function sub (num) {
    return this.clone().isub(num);
  };

  function smallMulTo (self, num, out) {
    out.negative = num.negative ^ self.negative;
    var len = (self.length + num.length) | 0;
    out.length = len;
    len = (len - 1) | 0;

    // Peel one iteration (compiler can't do it, because of code complexity)
    var a = self.words[0] | 0;
    var b = num.words[0] | 0;
    var r = a * b;

    var lo = r & 0x3ffffff;
    var carry = (r / 0x4000000) | 0;
    out.words[0] = lo;

    for (var k = 1; k < len; k++) {
      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
      // note that ncarry could be >= 0x3ffffff
      var ncarry = carry >>> 26;
      var rword = carry & 0x3ffffff;
      var maxJ = Math.min(k, num.length - 1);
      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
        var i = (k - j) | 0;
        a = self.words[i] | 0;
        b = num.words[j] | 0;
        r = a * b + rword;
        ncarry += (r / 0x4000000) | 0;
        rword = r & 0x3ffffff;
      }
      out.words[k] = rword | 0;
      carry = ncarry | 0;
    }
    if (carry !== 0) {
      out.words[k] = carry | 0;
    } else {
      out.length--;
    }

    return out.strip();
  }

  // TODO(indutny): it may be reasonable to omit it for users who don't need
  // to work with 256-bit numbers, otherwise it gives 20% improvement for 256-bit
  // multiplication (like elliptic secp256k1).
  var comb10MulTo = function comb10MulTo (self, num, out) {
    var a = self.words;
    var b = num.words;
    var o = out.words;
    var c = 0;
    var lo;
    var mid;
    var hi;
    var a0 = a[0] | 0;
    var al0 = a0 & 0x1fff;
    var ah0 = a0 >>> 13;
    var a1 = a[1] | 0;
    var al1 = a1 & 0x1fff;
    var ah1 = a1 >>> 13;
    var a2 = a[2] | 0;
    var al2 = a2 & 0x1fff;
    var ah2 = a2 >>> 13;
    var a3 = a[3] | 0;
    var al3 = a3 & 0x1fff;
    var ah3 = a3 >>> 13;
    var a4 = a[4] | 0;
    var al4 = a4 & 0x1fff;
    var ah4 = a4 >>> 13;
    var a5 = a[5] | 0;
    var al5 = a5 & 0x1fff;
    var ah5 = a5 >>> 13;
    var a6 = a[6] | 0;
    var al6 = a6 & 0x1fff;
    var ah6 = a6 >>> 13;
    var a7 = a[7] | 0;
    var al7 = a7 & 0x1fff;
    var ah7 = a7 >>> 13;
    var a8 = a[8] | 0;
    var al8 = a8 & 0x1fff;
    var ah8 = a8 >>> 13;
    var a9 = a[9] | 0;
    var al9 = a9 & 0x1fff;
    var ah9 = a9 >>> 13;
    var b0 = b[0] | 0;
    var bl0 = b0 & 0x1fff;
    var bh0 = b0 >>> 13;
    var b1 = b[1] | 0;
    var bl1 = b1 & 0x1fff;
    var bh1 = b1 >>> 13;
    var b2 = b[2] | 0;
    var bl2 = b2 & 0x1fff;
    var bh2 = b2 >>> 13;
    var b3 = b[3] | 0;
    var bl3 = b3 & 0x1fff;
    var bh3 = b3 >>> 13;
    var b4 = b[4] | 0;
    var bl4 = b4 & 0x1fff;
    var bh4 = b4 >>> 13;
    var b5 = b[5] | 0;
    var bl5 = b5 & 0x1fff;
    var bh5 = b5 >>> 13;
    var b6 = b[6] | 0;
    var bl6 = b6 & 0x1fff;
    var bh6 = b6 >>> 13;
    var b7 = b[7] | 0;
    var bl7 = b7 & 0x1fff;
    var bh7 = b7 >>> 13;
    var b8 = b[8] | 0;
    var bl8 = b8 & 0x1fff;
    var bh8 = b8 >>> 13;
    var b9 = b[9] | 0;
    var bl9 = b9 & 0x1fff;
    var bh9 = b9 >>> 13;

    out.negative = self.negative ^ num.negative;
    out.length = 19;
    /* k = 0 */
    lo = Math.imul(al0, bl0);
    mid = Math.imul(al0, bh0);
    mid = (mid + Math.imul(ah0, bl0)) | 0;
    hi = Math.imul(ah0, bh0);
    var w0 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w0 >>> 26)) | 0;
    w0 &= 0x3ffffff;
    /* k = 1 */
    lo = Math.imul(al1, bl0);
    mid = Math.imul(al1, bh0);
    mid = (mid + Math.imul(ah1, bl0)) | 0;
    hi = Math.imul(ah1, bh0);
    lo = (lo + Math.imul(al0, bl1)) | 0;
    mid = (mid + Math.imul(al0, bh1)) | 0;
    mid = (mid + Math.imul(ah0, bl1)) | 0;
    hi = (hi + Math.imul(ah0, bh1)) | 0;
    var w1 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w1 >>> 26)) | 0;
    w1 &= 0x3ffffff;
    /* k = 2 */
    lo = Math.imul(al2, bl0);
    mid = Math.imul(al2, bh0);
    mid = (mid + Math.imul(ah2, bl0)) | 0;
    hi = Math.imul(ah2, bh0);
    lo = (lo + Math.imul(al1, bl1)) | 0;
    mid = (mid + Math.imul(al1, bh1)) | 0;
    mid = (mid + Math.imul(ah1, bl1)) | 0;
    hi = (hi + Math.imul(ah1, bh1)) | 0;
    lo = (lo + Math.imul(al0, bl2)) | 0;
    mid = (mid + Math.imul(al0, bh2)) | 0;
    mid = (mid + Math.imul(ah0, bl2)) | 0;
    hi = (hi + Math.imul(ah0, bh2)) | 0;
    var w2 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w2 >>> 26)) | 0;
    w2 &= 0x3ffffff;
    /* k = 3 */
    lo = Math.imul(al3, bl0);
    mid = Math.imul(al3, bh0);
    mid = (mid + Math.imul(ah3, bl0)) | 0;
    hi = Math.imul(ah3, bh0);
    lo = (lo + Math.imul(al2, bl1)) | 0;
    mid = (mid + Math.imul(al2, bh1)) | 0;
    mid = (mid + Math.imul(ah2, bl1)) | 0;
    hi = (hi + Math.imul(ah2, bh1)) | 0;
    lo = (lo + Math.imul(al1, bl2)) | 0;
    mid = (mid + Math.imul(al1, bh2)) | 0;
    mid = (mid + Math.imul(ah1, bl2)) | 0;
    hi = (hi + Math.imul(ah1, bh2)) | 0;
    lo = (lo + Math.imul(al0, bl3)) | 0;
    mid = (mid + Math.imul(al0, bh3)) | 0;
    mid = (mid + Math.imul(ah0, bl3)) | 0;
    hi = (hi + Math.imul(ah0, bh3)) | 0;
    var w3 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w3 >>> 26)) | 0;
    w3 &= 0x3ffffff;
    /* k = 4 */
    lo = Math.imul(al4, bl0);
    mid = Math.imul(al4, bh0);
    mid = (mid + Math.imul(ah4, bl0)) | 0;
    hi = Math.imul(ah4, bh0);
    lo = (lo + Math.imul(al3, bl1)) | 0;
    mid = (mid + Math.imul(al3, bh1)) | 0;
    mid = (mid + Math.imul(ah3, bl1)) | 0;
    hi = (hi + Math.imul(ah3, bh1)) | 0;
    lo = (lo + Math.imul(al2, bl2)) | 0;
    mid = (mid + Math.imul(al2, bh2)) | 0;
    mid = (mid + Math.imul(ah2, bl2)) | 0;
    hi = (hi + Math.imul(ah2, bh2)) | 0;
    lo = (lo + Math.imul(al1, bl3)) | 0;
    mid = (mid + Math.imul(al1, bh3)) | 0;
    mid = (mid + Math.imul(ah1, bl3)) | 0;
    hi = (hi + Math.imul(ah1, bh3)) | 0;
    lo = (lo + Math.imul(al0, bl4)) | 0;
    mid = (mid + Math.imul(al0, bh4)) | 0;
    mid = (mid + Math.imul(ah0, bl4)) | 0;
    hi = (hi + Math.imul(ah0, bh4)) | 0;
    var w4 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w4 >>> 26)) | 0;
    w4 &= 0x3ffffff;
    /* k = 5 */
    lo = Math.imul(al5, bl0);
    mid = Math.imul(al5, bh0);
    mid = (mid + Math.imul(ah5, bl0)) | 0;
    hi = Math.imul(ah5, bh0);
    lo = (lo + Math.imul(al4, bl1)) | 0;
    mid = (mid + Math.imul(al4, bh1)) | 0;
    mid = (mid + Math.imul(ah4, bl1)) | 0;
    hi = (hi + Math.imul(ah4, bh1)) | 0;
    lo = (lo + Math.imul(al3, bl2)) | 0;
    mid = (mid + Math.imul(al3, bh2)) | 0;
    mid = (mid + Math.imul(ah3, bl2)) | 0;
    hi = (hi + Math.imul(ah3, bh2)) | 0;
    lo = (lo + Math.imul(al2, bl3)) | 0;
    mid = (mid + Math.imul(al2, bh3)) | 0;
    mid = (mid + Math.imul(ah2, bl3)) | 0;
    hi = (hi + Math.imul(ah2, bh3)) | 0;
    lo = (lo + Math.imul(al1, bl4)) | 0;
    mid = (mid + Math.imul(al1, bh4)) | 0;
    mid = (mid + Math.imul(ah1, bl4)) | 0;
    hi = (hi + Math.imul(ah1, bh4)) | 0;
    lo = (lo + Math.imul(al0, bl5)) | 0;
    mid = (mid + Math.imul(al0, bh5)) | 0;
    mid = (mid + Math.imul(ah0, bl5)) | 0;
    hi = (hi + Math.imul(ah0, bh5)) | 0;
    var w5 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w5 >>> 26)) | 0;
    w5 &= 0x3ffffff;
    /* k = 6 */
    lo = Math.imul(al6, bl0);
    mid = Math.imul(al6, bh0);
    mid = (mid + Math.imul(ah6, bl0)) | 0;
    hi = Math.imul(ah6, bh0);
    lo = (lo + Math.imul(al5, bl1)) | 0;
    mid = (mid + Math.imul(al5, bh1)) | 0;
    mid = (mid + Math.imul(ah5, bl1)) | 0;
    hi = (hi + Math.imul(ah5, bh1)) | 0;
    lo = (lo + Math.imul(al4, bl2)) | 0;
    mid = (mid + Math.imul(al4, bh2)) | 0;
    mid = (mid + Math.imul(ah4, bl2)) | 0;
    hi = (hi + Math.imul(ah4, bh2)) | 0;
    lo = (lo + Math.imul(al3, bl3)) | 0;
    mid = (mid + Math.imul(al3, bh3)) | 0;
    mid = (mid + Math.imul(ah3, bl3)) | 0;
    hi = (hi + Math.imul(ah3, bh3)) | 0;
    lo = (lo + Math.imul(al2, bl4)) | 0;
    mid = (mid + Math.imul(al2, bh4)) | 0;
    mid = (mid + Math.imul(ah2, bl4)) | 0;
    hi = (hi + Math.imul(ah2, bh4)) | 0;
    lo = (lo + Math.imul(al1, bl5)) | 0;
    mid = (mid + Math.imul(al1, bh5)) | 0;
    mid = (mid + Math.imul(ah1, bl5)) | 0;
    hi = (hi + Math.imul(ah1, bh5)) | 0;
    lo = (lo + Math.imul(al0, bl6)) | 0;
    mid = (mid + Math.imul(al0, bh6)) | 0;
    mid = (mid + Math.imul(ah0, bl6)) | 0;
    hi = (hi + Math.imul(ah0, bh6)) | 0;
    var w6 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w6 >>> 26)) | 0;
    w6 &= 0x3ffffff;
    /* k = 7 */
    lo = Math.imul(al7, bl0);
    mid = Math.imul(al7, bh0);
    mid = (mid + Math.imul(ah7, bl0)) | 0;
    hi = Math.imul(ah7, bh0);
    lo = (lo + Math.imul(al6, bl1)) | 0;
    mid = (mid + Math.imul(al6, bh1)) | 0;
    mid = (mid + Math.imul(ah6, bl1)) | 0;
    hi = (hi + Math.imul(ah6, bh1)) | 0;
    lo = (lo + Math.imul(al5, bl2)) | 0;
    mid = (mid + Math.imul(al5, bh2)) | 0;
    mid = (mid + Math.imul(ah5, bl2)) | 0;
    hi = (hi + Math.imul(ah5, bh2)) | 0;
    lo = (lo + Math.imul(al4, bl3)) | 0;
    mid = (mid + Math.imul(al4, bh3)) | 0;
    mid = (mid + Math.imul(ah4, bl3)) | 0;
    hi = (hi + Math.imul(ah4, bh3)) | 0;
    lo = (lo + Math.imul(al3, bl4)) | 0;
    mid = (mid + Math.imul(al3, bh4)) | 0;
    mid = (mid + Math.imul(ah3, bl4)) | 0;
    hi = (hi + Math.imul(ah3, bh4)) | 0;
    lo = (lo + Math.imul(al2, bl5)) | 0;
    mid = (mid + Math.imul(al2, bh5)) | 0;
    mid = (mid + Math.imul(ah2, bl5)) | 0;
    hi = (hi + Math.imul(ah2, bh5)) | 0;
    lo = (lo + Math.imul(al1, bl6)) | 0;
    mid = (mid + Math.imul(al1, bh6)) | 0;
    mid = (mid + Math.imul(ah1, bl6)) | 0;
    hi = (hi + Math.imul(ah1, bh6)) | 0;
    lo = (lo + Math.imul(al0, bl7)) | 0;
    mid = (mid + Math.imul(al0, bh7)) | 0;
    mid = (mid + Math.imul(ah0, bl7)) | 0;
    hi = (hi + Math.imul(ah0, bh7)) | 0;
    var w7 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w7 >>> 26)) | 0;
    w7 &= 0x3ffffff;
    /* k = 8 */
    lo = Math.imul(al8, bl0);
    mid = Math.imul(al8, bh0);
    mid = (mid + Math.imul(ah8, bl0)) | 0;
    hi = Math.imul(ah8, bh0);
    lo = (lo + Math.imul(al7, bl1)) | 0;
    mid = (mid + Math.imul(al7, bh1)) | 0;
    mid = (mid + Math.imul(ah7, bl1)) | 0;
    hi = (hi + Math.imul(ah7, bh1)) | 0;
    lo = (lo + Math.imul(al6, bl2)) | 0;
    mid = (mid + Math.imul(al6, bh2)) | 0;
    mid = (mid + Math.imul(ah6, bl2)) | 0;
    hi = (hi + Math.imul(ah6, bh2)) | 0;
    lo = (lo + Math.imul(al5, bl3)) | 0;
    mid = (mid + Math.imul(al5, bh3)) | 0;
    mid = (mid + Math.imul(ah5, bl3)) | 0;
    hi = (hi + Math.imul(ah5, bh3)) | 0;
    lo = (lo + Math.imul(al4, bl4)) | 0;
    mid = (mid + Math.imul(al4, bh4)) | 0;
    mid = (mid + Math.imul(ah4, bl4)) | 0;
    hi = (hi + Math.imul(ah4, bh4)) | 0;
    lo = (lo + Math.imul(al3, bl5)) | 0;
    mid = (mid + Math.imul(al3, bh5)) | 0;
    mid = (mid + Math.imul(ah3, bl5)) | 0;
    hi = (hi + Math.imul(ah3, bh5)) | 0;
    lo = (lo + Math.imul(al2, bl6)) | 0;
    mid = (mid + Math.imul(al2, bh6)) | 0;
    mid = (mid + Math.imul(ah2, bl6)) | 0;
    hi = (hi + Math.imul(ah2, bh6)) | 0;
    lo = (lo + Math.imul(al1, bl7)) | 0;
    mid = (mid + Math.imul(al1, bh7)) | 0;
    mid = (mid + Math.imul(ah1, bl7)) | 0;
    hi = (hi + Math.imul(ah1, bh7)) | 0;
    lo = (lo + Math.imul(al0, bl8)) | 0;
    mid = (mid + Math.imul(al0, bh8)) | 0;
    mid = (mid + Math.imul(ah0, bl8)) | 0;
    hi = (hi + Math.imul(ah0, bh8)) | 0;
    var w8 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w8 >>> 26)) | 0;
    w8 &= 0x3ffffff;
    /* k = 9 */
    lo = Math.imul(al9, bl0);
    mid = Math.imul(al9, bh0);
    mid = (mid + Math.imul(ah9, bl0)) | 0;
    hi = Math.imul(ah9, bh0);
    lo = (lo + Math.imul(al8, bl1)) | 0;
    mid = (mid + Math.imul(al8, bh1)) | 0;
    mid = (mid + Math.imul(ah8, bl1)) | 0;
    hi = (hi + Math.imul(ah8, bh1)) | 0;
    lo = (lo + Math.imul(al7, bl2)) | 0;
    mid = (mid + Math.imul(al7, bh2)) | 0;
    mid = (mid + Math.imul(ah7, bl2)) | 0;
    hi = (hi + Math.imul(ah7, bh2)) | 0;
    lo = (lo + Math.imul(al6, bl3)) | 0;
    mid = (mid + Math.imul(al6, bh3)) | 0;
    mid = (mid + Math.imul(ah6, bl3)) | 0;
    hi = (hi + Math.imul(ah6, bh3)) | 0;
    lo = (lo + Math.imul(al5, bl4)) | 0;
    mid = (mid + Math.imul(al5, bh4)) | 0;
    mid = (mid + Math.imul(ah5, bl4)) | 0;
    hi = (hi + Math.imul(ah5, bh4)) | 0;
    lo = (lo + Math.imul(al4, bl5)) | 0;
    mid = (mid + Math.imul(al4, bh5)) | 0;
    mid = (mid + Math.imul(ah4, bl5)) | 0;
    hi = (hi + Math.imul(ah4, bh5)) | 0;
    lo = (lo + Math.imul(al3, bl6)) | 0;
    mid = (mid + Math.imul(al3, bh6)) | 0;
    mid = (mid + Math.imul(ah3, bl6)) | 0;
    hi = (hi + Math.imul(ah3, bh6)) | 0;
    lo = (lo + Math.imul(al2, bl7)) | 0;
    mid = (mid + Math.imul(al2, bh7)) | 0;
    mid = (mid + Math.imul(ah2, bl7)) | 0;
    hi = (hi + Math.imul(ah2, bh7)) | 0;
    lo = (lo + Math.imul(al1, bl8)) | 0;
    mid = (mid + Math.imul(al1, bh8)) | 0;
    mid = (mid + Math.imul(ah1, bl8)) | 0;
    hi = (hi + Math.imul(ah1, bh8)) | 0;
    lo = (lo + Math.imul(al0, bl9)) | 0;
    mid = (mid + Math.imul(al0, bh9)) | 0;
    mid = (mid + Math.imul(ah0, bl9)) | 0;
    hi = (hi + Math.imul(ah0, bh9)) | 0;
    var w9 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w9 >>> 26)) | 0;
    w9 &= 0x3ffffff;
    /* k = 10 */
    lo = Math.imul(al9, bl1);
    mid = Math.imul(al9, bh1);
    mid = (mid + Math.imul(ah9, bl1)) | 0;
    hi = Math.imul(ah9, bh1);
    lo = (lo + Math.imul(al8, bl2)) | 0;
    mid = (mid + Math.imul(al8, bh2)) | 0;
    mid = (mid + Math.imul(ah8, bl2)) | 0;
    hi = (hi + Math.imul(ah8, bh2)) | 0;
    lo = (lo + Math.imul(al7, bl3)) | 0;
    mid = (mid + Math.imul(al7, bh3)) | 0;
    mid = (mid + Math.imul(ah7, bl3)) | 0;
    hi = (hi + Math.imul(ah7, bh3)) | 0;
    lo = (lo + Math.imul(al6, bl4)) | 0;
    mid = (mid + Math.imul(al6, bh4)) | 0;
    mid = (mid + Math.imul(ah6, bl4)) | 0;
    hi = (hi + Math.imul(ah6, bh4)) | 0;
    lo = (lo + Math.imul(al5, bl5)) | 0;
    mid = (mid + Math.imul(al5, bh5)) | 0;
    mid = (mid + Math.imul(ah5, bl5)) | 0;
    hi = (hi + Math.imul(ah5, bh5)) | 0;
    lo = (lo + Math.imul(al4, bl6)) | 0;
    mid = (mid + Math.imul(al4, bh6)) | 0;
    mid = (mid + Math.imul(ah4, bl6)) | 0;
    hi = (hi + Math.imul(ah4, bh6)) | 0;
    lo = (lo + Math.imul(al3, bl7)) | 0;
    mid = (mid + Math.imul(al3, bh7)) | 0;
    mid = (mid + Math.imul(ah3, bl7)) | 0;
    hi = (hi + Math.imul(ah3, bh7)) | 0;
    lo = (lo + Math.imul(al2, bl8)) | 0;
    mid = (mid + Math.imul(al2, bh8)) | 0;
    mid = (mid + Math.imul(ah2, bl8)) | 0;
    hi = (hi + Math.imul(ah2, bh8)) | 0;
    lo = (lo + Math.imul(al1, bl9)) | 0;
    mid = (mid + Math.imul(al1, bh9)) | 0;
    mid = (mid + Math.imul(ah1, bl9)) | 0;
    hi = (hi + Math.imul(ah1, bh9)) | 0;
    var w10 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w10 >>> 26)) | 0;
    w10 &= 0x3ffffff;
    /* k = 11 */
    lo = Math.imul(al9, bl2);
    mid = Math.imul(al9, bh2);
    mid = (mid + Math.imul(ah9, bl2)) | 0;
    hi = Math.imul(ah9, bh2);
    lo = (lo + Math.imul(al8, bl3)) | 0;
    mid = (mid + Math.imul(al8, bh3)) | 0;
    mid = (mid + Math.imul(ah8, bl3)) | 0;
    hi = (hi + Math.imul(ah8, bh3)) | 0;
    lo = (lo + Math.imul(al7, bl4)) | 0;
    mid = (mid + Math.imul(al7, bh4)) | 0;
    mid = (mid + Math.imul(ah7, bl4)) | 0;
    hi = (hi + Math.imul(ah7, bh4)) | 0;
    lo = (lo + Math.imul(al6, bl5)) | 0;
    mid = (mid + Math.imul(al6, bh5)) | 0;
    mid = (mid + Math.imul(ah6, bl5)) | 0;
    hi = (hi + Math.imul(ah6, bh5)) | 0;
    lo = (lo + Math.imul(al5, bl6)) | 0;
    mid = (mid + Math.imul(al5, bh6)) | 0;
    mid = (mid + Math.imul(ah5, bl6)) | 0;
    hi = (hi + Math.imul(ah5, bh6)) | 0;
    lo = (lo + Math.imul(al4, bl7)) | 0;
    mid = (mid + Math.imul(al4, bh7)) | 0;
    mid = (mid + Math.imul(ah4, bl7)) | 0;
    hi = (hi + Math.imul(ah4, bh7)) | 0;
    lo = (lo + Math.imul(al3, bl8)) | 0;
    mid = (mid + Math.imul(al3, bh8)) | 0;
    mid = (mid + Math.imul(ah3, bl8)) | 0;
    hi = (hi + Math.imul(ah3, bh8)) | 0;
    lo = (lo + Math.imul(al2, bl9)) | 0;
    mid = (mid + Math.imul(al2, bh9)) | 0;
    mid = (mid + Math.imul(ah2, bl9)) | 0;
    hi = (hi + Math.imul(ah2, bh9)) | 0;
    var w11 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w11 >>> 26)) | 0;
    w11 &= 0x3ffffff;
    /* k = 12 */
    lo = Math.imul(al9, bl3);
    mid = Math.imul(al9, bh3);
    mid = (mid + Math.imul(ah9, bl3)) | 0;
    hi = Math.imul(ah9, bh3);
    lo = (lo + Math.imul(al8, bl4)) | 0;
    mid = (mid + Math.imul(al8, bh4)) | 0;
    mid = (mid + Math.imul(ah8, bl4)) | 0;
    hi = (hi + Math.imul(ah8, bh4)) | 0;
    lo = (lo + Math.imul(al7, bl5)) | 0;
    mid = (mid + Math.imul(al7, bh5)) | 0;
    mid = (mid + Math.imul(ah7, bl5)) | 0;
    hi = (hi + Math.imul(ah7, bh5)) | 0;
    lo = (lo + Math.imul(al6, bl6)) | 0;
    mid = (mid + Math.imul(al6, bh6)) | 0;
    mid = (mid + Math.imul(ah6, bl6)) | 0;
    hi = (hi + Math.imul(ah6, bh6)) | 0;
    lo = (lo + Math.imul(al5, bl7)) | 0;
    mid = (mid + Math.imul(al5, bh7)) | 0;
    mid = (mid + Math.imul(ah5, bl7)) | 0;
    hi = (hi + Math.imul(ah5, bh7)) | 0;
    lo = (lo + Math.imul(al4, bl8)) | 0;
    mid = (mid + Math.imul(al4, bh8)) | 0;
    mid = (mid + Math.imul(ah4, bl8)) | 0;
    hi = (hi + Math.imul(ah4, bh8)) | 0;
    lo = (lo + Math.imul(al3, bl9)) | 0;
    mid = (mid + Math.imul(al3, bh9)) | 0;
    mid = (mid + Math.imul(ah3, bl9)) | 0;
    hi = (hi + Math.imul(ah3, bh9)) | 0;
    var w12 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w12 >>> 26)) | 0;
    w12 &= 0x3ffffff;
    /* k = 13 */
    lo = Math.imul(al9, bl4);
    mid = Math.imul(al9, bh4);
    mid = (mid + Math.imul(ah9, bl4)) | 0;
    hi = Math.imul(ah9, bh4);
    lo = (lo + Math.imul(al8, bl5)) | 0;
    mid = (mid + Math.imul(al8, bh5)) | 0;
    mid = (mid + Math.imul(ah8, bl5)) | 0;
    hi = (hi + Math.imul(ah8, bh5)) | 0;
    lo = (lo + Math.imul(al7, bl6)) | 0;
    mid = (mid + Math.imul(al7, bh6)) | 0;
    mid = (mid + Math.imul(ah7, bl6)) | 0;
    hi = (hi + Math.imul(ah7, bh6)) | 0;
    lo = (lo + Math.imul(al6, bl7)) | 0;
    mid = (mid + Math.imul(al6, bh7)) | 0;
    mid = (mid + Math.imul(ah6, bl7)) | 0;
    hi = (hi + Math.imul(ah6, bh7)) | 0;
    lo = (lo + Math.imul(al5, bl8)) | 0;
    mid = (mid + Math.imul(al5, bh8)) | 0;
    mid = (mid + Math.imul(ah5, bl8)) | 0;
    hi = (hi + Math.imul(ah5, bh8)) | 0;
    lo = (lo + Math.imul(al4, bl9)) | 0;
    mid = (mid + Math.imul(al4, bh9)) | 0;
    mid = (mid + Math.imul(ah4, bl9)) | 0;
    hi = (hi + Math.imul(ah4, bh9)) | 0;
    var w13 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w13 >>> 26)) | 0;
    w13 &= 0x3ffffff;
    /* k = 14 */
    lo = Math.imul(al9, bl5);
    mid = Math.imul(al9, bh5);
    mid = (mid + Math.imul(ah9, bl5)) | 0;
    hi = Math.imul(ah9, bh5);
    lo = (lo + Math.imul(al8, bl6)) | 0;
    mid = (mid + Math.imul(al8, bh6)) | 0;
    mid = (mid + Math.imul(ah8, bl6)) | 0;
    hi = (hi + Math.imul(ah8, bh6)) | 0;
    lo = (lo + Math.imul(al7, bl7)) | 0;
    mid = (mid + Math.imul(al7, bh7)) | 0;
    mid = (mid + Math.imul(ah7, bl7)) | 0;
    hi = (hi + Math.imul(ah7, bh7)) | 0;
    lo = (lo + Math.imul(al6, bl8)) | 0;
    mid = (mid + Math.imul(al6, bh8)) | 0;
    mid = (mid + Math.imul(ah6, bl8)) | 0;
    hi = (hi + Math.imul(ah6, bh8)) | 0;
    lo = (lo + Math.imul(al5, bl9)) | 0;
    mid = (mid + Math.imul(al5, bh9)) | 0;
    mid = (mid + Math.imul(ah5, bl9)) | 0;
    hi = (hi + Math.imul(ah5, bh9)) | 0;
    var w14 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w14 >>> 26)) | 0;
    w14 &= 0x3ffffff;
    /* k = 15 */
    lo = Math.imul(al9, bl6);
    mid = Math.imul(al9, bh6);
    mid = (mid + Math.imul(ah9, bl6)) | 0;
    hi = Math.imul(ah9, bh6);
    lo = (lo + Math.imul(al8, bl7)) | 0;
    mid = (mid + Math.imul(al8, bh7)) | 0;
    mid = (mid + Math.imul(ah8, bl7)) | 0;
    hi = (hi + Math.imul(ah8, bh7)) | 0;
    lo = (lo + Math.imul(al7, bl8)) | 0;
    mid = (mid + Math.imul(al7, bh8)) | 0;
    mid = (mid + Math.imul(ah7, bl8)) | 0;
    hi = (hi + Math.imul(ah7, bh8)) | 0;
    lo = (lo + Math.imul(al6, bl9)) | 0;
    mid = (mid + Math.imul(al6, bh9)) | 0;
    mid = (mid + Math.imul(ah6, bl9)) | 0;
    hi = (hi + Math.imul(ah6, bh9)) | 0;
    var w15 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w15 >>> 26)) | 0;
    w15 &= 0x3ffffff;
    /* k = 16 */
    lo = Math.imul(al9, bl7);
    mid = Math.imul(al9, bh7);
    mid = (mid + Math.imul(ah9, bl7)) | 0;
    hi = Math.imul(ah9, bh7);
    lo = (lo + Math.imul(al8, bl8)) | 0;
    mid = (mid + Math.imul(al8, bh8)) | 0;
    mid = (mid + Math.imul(ah8, bl8)) | 0;
    hi = (hi + Math.imul(ah8, bh8)) | 0;
    lo = (lo + Math.imul(al7, bl9)) | 0;
    mid = (mid + Math.imul(al7, bh9)) | 0;
    mid = (mid + Math.imul(ah7, bl9)) | 0;
    hi = (hi + Math.imul(ah7, bh9)) | 0;
    var w16 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w16 >>> 26)) | 0;
    w16 &= 0x3ffffff;
    /* k = 17 */
    lo = Math.imul(al9, bl8);
    mid = Math.imul(al9, bh8);
    mid = (mid + Math.imul(ah9, bl8)) | 0;
    hi = Math.imul(ah9, bh8);
    lo = (lo + Math.imul(al8, bl9)) | 0;
    mid = (mid + Math.imul(al8, bh9)) | 0;
    mid = (mid + Math.imul(ah8, bl9)) | 0;
    hi = (hi + Math.imul(ah8, bh9)) | 0;
    var w17 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w17 >>> 26)) | 0;
    w17 &= 0x3ffffff;
    /* k = 18 */
    lo = Math.imul(al9, bl9);
    mid = Math.imul(al9, bh9);
    mid = (mid + Math.imul(ah9, bl9)) | 0;
    hi = Math.imul(ah9, bh9);
    var w18 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w18 >>> 26)) | 0;
    w18 &= 0x3ffffff;
    o[0] = w0;
    o[1] = w1;
    o[2] = w2;
    o[3] = w3;
    o[4] = w4;
    o[5] = w5;
    o[6] = w6;
    o[7] = w7;
    o[8] = w8;
    o[9] = w9;
    o[10] = w10;
    o[11] = w11;
    o[12] = w12;
    o[13] = w13;
    o[14] = w14;
    o[15] = w15;
    o[16] = w16;
    o[17] = w17;
    o[18] = w18;
    if (c !== 0) {
      o[19] = c;
      out.length++;
    }
    return out;
  };

  // Polyfill comb
  if (!Math.imul) {
    comb10MulTo = smallMulTo;
  }

  function bigMulTo (self, num, out) {
    out.negative = num.negative ^ self.negative;
    out.length = self.length + num.length;

    var carry = 0;
    var hncarry = 0;
    for (var k = 0; k < out.length - 1; k++) {
      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
      // note that ncarry could be >= 0x3ffffff
      var ncarry = hncarry;
      hncarry = 0;
      var rword = carry & 0x3ffffff;
      var maxJ = Math.min(k, num.length - 1);
      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
        var i = k - j;
        var a = self.words[i] | 0;
        var b = num.words[j] | 0;
        var r = a * b;

        var lo = r & 0x3ffffff;
        ncarry = (ncarry + ((r / 0x4000000) | 0)) | 0;
        lo = (lo + rword) | 0;
        rword = lo & 0x3ffffff;
        ncarry = (ncarry + (lo >>> 26)) | 0;

        hncarry += ncarry >>> 26;
        ncarry &= 0x3ffffff;
      }
      out.words[k] = rword;
      carry = ncarry;
      ncarry = hncarry;
    }
    if (carry !== 0) {
      out.words[k] = carry;
    } else {
      out.length--;
    }

    return out.strip();
  }

  function jumboMulTo (self, num, out) {
    var fftm = new FFTM();
    return fftm.mulp(self, num, out);
  }

  BN.prototype.mulTo = function mulTo (num, out) {
    var res;
    var len = this.length + num.length;
    if (this.length === 10 && num.length === 10) {
      res = comb10MulTo(this, num, out);
    } else if (len < 63) {
      res = smallMulTo(this, num, out);
    } else if (len < 1024) {
      res = bigMulTo(this, num, out);
    } else {
      res = jumboMulTo(this, num, out);
    }

    return res;
  };

  // Cooley-Tukey algorithm for FFT
  // slightly revisited to rely on looping instead of recursion

  function FFTM (x, y) {
    this.x = x;
    this.y = y;
  }

  FFTM.prototype.makeRBT = function makeRBT (N) {
    var t = new Array(N);
    var l = BN.prototype._countBits(N) - 1;
    for (var i = 0; i < N; i++) {
      t[i] = this.revBin(i, l, N);
    }

    return t;
  };

  // Returns binary-reversed representation of `x`
  FFTM.prototype.revBin = function revBin (x, l, N) {
    if (x === 0 || x === N - 1) return x;

    var rb = 0;
    for (var i = 0; i < l; i++) {
      rb |= (x & 1) << (l - i - 1);
      x >>= 1;
    }

    return rb;
  };

  // Performs "tweedling" phase, therefore 'emulating'
  // behaviour of the recursive algorithm
  FFTM.prototype.permute = function permute (rbt, rws, iws, rtws, itws, N) {
    for (var i = 0; i < N; i++) {
      rtws[i] = rws[rbt[i]];
      itws[i] = iws[rbt[i]];
    }
  };

  FFTM.prototype.transform = function transform (rws, iws, rtws, itws, N, rbt) {
    this.permute(rbt, rws, iws, rtws, itws, N);

    for (var s = 1; s < N; s <<= 1) {
      var l = s << 1;

      var rtwdf = Math.cos(2 * Math.PI / l);
      var itwdf = Math.sin(2 * Math.PI / l);

      for (var p = 0; p < N; p += l) {
        var rtwdf_ = rtwdf;
        var itwdf_ = itwdf;

        for (var j = 0; j < s; j++) {
          var re = rtws[p + j];
          var ie = itws[p + j];

          var ro = rtws[p + j + s];
          var io = itws[p + j + s];

          var rx = rtwdf_ * ro - itwdf_ * io;

          io = rtwdf_ * io + itwdf_ * ro;
          ro = rx;

          rtws[p + j] = re + ro;
          itws[p + j] = ie + io;

          rtws[p + j + s] = re - ro;
          itws[p + j + s] = ie - io;

          /* jshint maxdepth : false */
          if (j !== l) {
            rx = rtwdf * rtwdf_ - itwdf * itwdf_;

            itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
            rtwdf_ = rx;
          }
        }
      }
    }
  };

  FFTM.prototype.guessLen13b = function guessLen13b (n, m) {
    var N = Math.max(m, n) | 1;
    var odd = N & 1;
    var i = 0;
    for (N = N / 2 | 0; N; N = N >>> 1) {
      i++;
    }

    return 1 << i + 1 + odd;
  };

  FFTM.prototype.conjugate = function conjugate (rws, iws, N) {
    if (N <= 1) return;

    for (var i = 0; i < N / 2; i++) {
      var t = rws[i];

      rws[i] = rws[N - i - 1];
      rws[N - i - 1] = t;

      t = iws[i];

      iws[i] = -iws[N - i - 1];
      iws[N - i - 1] = -t;
    }
  };

  FFTM.prototype.normalize13b = function normalize13b (ws, N) {
    var carry = 0;
    for (var i = 0; i < N / 2; i++) {
      var w = Math.round(ws[2 * i + 1] / N) * 0x2000 +
        Math.round(ws[2 * i] / N) +
        carry;

      ws[i] = w & 0x3ffffff;

      if (w < 0x4000000) {
        carry = 0;
      } else {
        carry = w / 0x4000000 | 0;
      }
    }

    return ws;
  };

  FFTM.prototype.convert13b = function convert13b (ws, len, rws, N) {
    var carry = 0;
    for (var i = 0; i < len; i++) {
      carry = carry + (ws[i] | 0);

      rws[2 * i] = carry & 0x1fff; carry = carry >>> 13;
      rws[2 * i + 1] = carry & 0x1fff; carry = carry >>> 13;
    }

    // Pad with zeroes
    for (i = 2 * len; i < N; ++i) {
      rws[i] = 0;
    }

    assert(carry === 0);
    assert((carry & ~0x1fff) === 0);
  };

  FFTM.prototype.stub = function stub (N) {
    var ph = new Array(N);
    for (var i = 0; i < N; i++) {
      ph[i] = 0;
    }

    return ph;
  };

  FFTM.prototype.mulp = function mulp (x, y, out) {
    var N = 2 * this.guessLen13b(x.length, y.length);

    var rbt = this.makeRBT(N);

    var _ = this.stub(N);

    var rws = new Array(N);
    var rwst = new Array(N);
    var iwst = new Array(N);

    var nrws = new Array(N);
    var nrwst = new Array(N);
    var niwst = new Array(N);

    var rmws = out.words;
    rmws.length = N;

    this.convert13b(x.words, x.length, rws, N);
    this.convert13b(y.words, y.length, nrws, N);

    this.transform(rws, _, rwst, iwst, N, rbt);
    this.transform(nrws, _, nrwst, niwst, N, rbt);

    for (var i = 0; i < N; i++) {
      var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
      iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
      rwst[i] = rx;
    }

    this.conjugate(rwst, iwst, N);
    this.transform(rwst, iwst, rmws, _, N, rbt);
    this.conjugate(rmws, _, N);
    this.normalize13b(rmws, N);

    out.negative = x.negative ^ y.negative;
    out.length = x.length + y.length;
    return out.strip();
  };

  // Multiply `this` by `num`
  BN.prototype.mul = function mul (num) {
    var out = new BN(null);
    out.words = new Array(this.length + num.length);
    return this.mulTo(num, out);
  };

  // Multiply employing FFT
  BN.prototype.mulf = function mulf (num) {
    var out = new BN(null);
    out.words = new Array(this.length + num.length);
    return jumboMulTo(this, num, out);
  };

  // In-place Multiplication
  BN.prototype.imul = function imul (num) {
    return this.clone().mulTo(num, this);
  };

  BN.prototype.imuln = function imuln (num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000);

    // Carry
    var carry = 0;
    for (var i = 0; i < this.length; i++) {
      var w = (this.words[i] | 0) * num;
      var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
      carry >>= 26;
      carry += (w / 0x4000000) | 0;
      // NOTE: lo is 27bit maximum
      carry += lo >>> 26;
      this.words[i] = lo & 0x3ffffff;
    }

    if (carry !== 0) {
      this.words[i] = carry;
      this.length++;
    }

    return this;
  };

  BN.prototype.muln = function muln (num) {
    return this.clone().imuln(num);
  };

  // `this` * `this`
  BN.prototype.sqr = function sqr () {
    return this.mul(this);
  };

  // `this` * `this` in-place
  BN.prototype.isqr = function isqr () {
    return this.imul(this.clone());
  };

  // Math.pow(`this`, `num`)
  BN.prototype.pow = function pow (num) {
    var w = toBitArray(num);
    if (w.length === 0) return new BN(1);

    // Skip leading zeroes
    var res = this;
    for (var i = 0; i < w.length; i++, res = res.sqr()) {
      if (w[i] !== 0) break;
    }

    if (++i < w.length) {
      for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
        if (w[i] === 0) continue;

        res = res.mul(q);
      }
    }

    return res;
  };

  // Shift-left in-place
  BN.prototype.iushln = function iushln (bits) {
    assert(typeof bits === 'number' && bits >= 0);
    var r = bits % 26;
    var s = (bits - r) / 26;
    var carryMask = (0x3ffffff >>> (26 - r)) << (26 - r);
    var i;

    if (r !== 0) {
      var carry = 0;

      for (i = 0; i < this.length; i++) {
        var newCarry = this.words[i] & carryMask;
        var c = ((this.words[i] | 0) - newCarry) << r;
        this.words[i] = c | carry;
        carry = newCarry >>> (26 - r);
      }

      if (carry) {
        this.words[i] = carry;
        this.length++;
      }
    }

    if (s !== 0) {
      for (i = this.length - 1; i >= 0; i--) {
        this.words[i + s] = this.words[i];
      }

      for (i = 0; i < s; i++) {
        this.words[i] = 0;
      }

      this.length += s;
    }

    return this.strip();
  };

  BN.prototype.ishln = function ishln (bits) {
    // TODO(indutny): implement me
    assert(this.negative === 0);
    return this.iushln(bits);
  };

  // Shift-right in-place
  // NOTE: `hint` is a lowest bit before trailing zeroes
  // NOTE: if `extended` is present - it will be filled with destroyed bits
  BN.prototype.iushrn = function iushrn (bits, hint, extended) {
    assert(typeof bits === 'number' && bits >= 0);
    var h;
    if (hint) {
      h = (hint - (hint % 26)) / 26;
    } else {
      h = 0;
    }

    var r = bits % 26;
    var s = Math.min((bits - r) / 26, this.length);
    var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
    var maskedWords = extended;

    h -= s;
    h = Math.max(0, h);

    // Extended mode, copy masked part
    if (maskedWords) {
      for (var i = 0; i < s; i++) {
        maskedWords.words[i] = this.words[i];
      }
      maskedWords.length = s;
    }

    if (s === 0) {
      // No-op, we should not move anything at all
    } else if (this.length > s) {
      this.length -= s;
      for (i = 0; i < this.length; i++) {
        this.words[i] = this.words[i + s];
      }
    } else {
      this.words[0] = 0;
      this.length = 1;
    }

    var carry = 0;
    for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
      var word = this.words[i] | 0;
      this.words[i] = (carry << (26 - r)) | (word >>> r);
      carry = word & mask;
    }

    // Push carried bits as a mask
    if (maskedWords && carry !== 0) {
      maskedWords.words[maskedWords.length++] = carry;
    }

    if (this.length === 0) {
      this.words[0] = 0;
      this.length = 1;
    }

    return this.strip();
  };

  BN.prototype.ishrn = function ishrn (bits, hint, extended) {
    // TODO(indutny): implement me
    assert(this.negative === 0);
    return this.iushrn(bits, hint, extended);
  };

  // Shift-left
  BN.prototype.shln = function shln (bits) {
    return this.clone().ishln(bits);
  };

  BN.prototype.ushln = function ushln (bits) {
    return this.clone().iushln(bits);
  };

  // Shift-right
  BN.prototype.shrn = function shrn (bits) {
    return this.clone().ishrn(bits);
  };

  BN.prototype.ushrn = function ushrn (bits) {
    return this.clone().iushrn(bits);
  };

  // Test if n bit is set
  BN.prototype.testn = function testn (bit) {
    assert(typeof bit === 'number' && bit >= 0);
    var r = bit % 26;
    var s = (bit - r) / 26;
    var q = 1 << r;

    // Fast case: bit is much higher than all existing words
    if (this.length <= s) return false;

    // Check bit and return
    var w = this.words[s];

    return !!(w & q);
  };

  // Return only lowers bits of number (in-place)
  BN.prototype.imaskn = function imaskn (bits) {
    assert(typeof bits === 'number' && bits >= 0);
    var r = bits % 26;
    var s = (bits - r) / 26;

    assert(this.negative === 0, 'imaskn works only with positive numbers');

    if (this.length <= s) {
      return this;
    }

    if (r !== 0) {
      s++;
    }
    this.length = Math.min(s, this.length);

    if (r !== 0) {
      var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
      this.words[this.length - 1] &= mask;
    }

    return this.strip();
  };

  // Return only lowers bits of number
  BN.prototype.maskn = function maskn (bits) {
    return this.clone().imaskn(bits);
  };

  // Add plain number `num` to `this`
  BN.prototype.iaddn = function iaddn (num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000);
    if (num < 0) return this.isubn(-num);

    // Possible sign change
    if (this.negative !== 0) {
      if (this.length === 1 && (this.words[0] | 0) < num) {
        this.words[0] = num - (this.words[0] | 0);
        this.negative = 0;
        return this;
      }

      this.negative = 0;
      this.isubn(num);
      this.negative = 1;
      return this;
    }

    // Add without checks
    return this._iaddn(num);
  };

  BN.prototype._iaddn = function _iaddn (num) {
    this.words[0] += num;

    // Carry
    for (var i = 0; i < this.length && this.words[i] >= 0x4000000; i++) {
      this.words[i] -= 0x4000000;
      if (i === this.length - 1) {
        this.words[i + 1] = 1;
      } else {
        this.words[i + 1]++;
      }
    }
    this.length = Math.max(this.length, i + 1);

    return this;
  };

  // Subtract plain number `num` from `this`
  BN.prototype.isubn = function isubn (num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000);
    if (num < 0) return this.iaddn(-num);

    if (this.negative !== 0) {
      this.negative = 0;
      this.iaddn(num);
      this.negative = 1;
      return this;
    }

    this.words[0] -= num;

    if (this.length === 1 && this.words[0] < 0) {
      this.words[0] = -this.words[0];
      this.negative = 1;
    } else {
      // Carry
      for (var i = 0; i < this.length && this.words[i] < 0; i++) {
        this.words[i] += 0x4000000;
        this.words[i + 1] -= 1;
      }
    }

    return this.strip();
  };

  BN.prototype.addn = function addn (num) {
    return this.clone().iaddn(num);
  };

  BN.prototype.subn = function subn (num) {
    return this.clone().isubn(num);
  };

  BN.prototype.iabs = function iabs () {
    this.negative = 0;

    return this;
  };

  BN.prototype.abs = function abs () {
    return this.clone().iabs();
  };

  BN.prototype._ishlnsubmul = function _ishlnsubmul (num, mul, shift) {
    var len = num.length + shift;
    var i;

    this._expand(len);

    var w;
    var carry = 0;
    for (i = 0; i < num.length; i++) {
      w = (this.words[i + shift] | 0) + carry;
      var right = (num.words[i] | 0) * mul;
      w -= right & 0x3ffffff;
      carry = (w >> 26) - ((right / 0x4000000) | 0);
      this.words[i + shift] = w & 0x3ffffff;
    }
    for (; i < this.length - shift; i++) {
      w = (this.words[i + shift] | 0) + carry;
      carry = w >> 26;
      this.words[i + shift] = w & 0x3ffffff;
    }

    if (carry === 0) return this.strip();

    // Subtraction overflow
    assert(carry === -1);
    carry = 0;
    for (i = 0; i < this.length; i++) {
      w = -(this.words[i] | 0) + carry;
      carry = w >> 26;
      this.words[i] = w & 0x3ffffff;
    }
    this.negative = 1;

    return this.strip();
  };

  BN.prototype._wordDiv = function _wordDiv (num, mode) {
    var shift = this.length - num.length;

    var a = this.clone();
    var b = num;

    // Normalize
    var bhi = b.words[b.length - 1] | 0;
    var bhiBits = this._countBits(bhi);
    shift = 26 - bhiBits;
    if (shift !== 0) {
      b = b.ushln(shift);
      a.iushln(shift);
      bhi = b.words[b.length - 1] | 0;
    }

    // Initialize quotient
    var m = a.length - b.length;
    var q;

    if (mode !== 'mod') {
      q = new BN(null);
      q.length = m + 1;
      q.words = new Array(q.length);
      for (var i = 0; i < q.length; i++) {
        q.words[i] = 0;
      }
    }

    var diff = a.clone()._ishlnsubmul(b, 1, m);
    if (diff.negative === 0) {
      a = diff;
      if (q) {
        q.words[m] = 1;
      }
    }

    for (var j = m - 1; j >= 0; j--) {
      var qj = (a.words[b.length + j] | 0) * 0x4000000 +
        (a.words[b.length + j - 1] | 0);

      // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
      // (0x7ffffff)
      qj = Math.min((qj / bhi) | 0, 0x3ffffff);

      a._ishlnsubmul(b, qj, j);
      while (a.negative !== 0) {
        qj--;
        a.negative = 0;
        a._ishlnsubmul(b, 1, j);
        if (!a.isZero()) {
          a.negative ^= 1;
        }
      }
      if (q) {
        q.words[j] = qj;
      }
    }
    if (q) {
      q.strip();
    }
    a.strip();

    // Denormalize
    if (mode !== 'div' && shift !== 0) {
      a.iushrn(shift);
    }

    return {
      div: q || null,
      mod: a
    };
  };

  // NOTE: 1) `mode` can be set to `mod` to request mod only,
  //       to `div` to request div only, or be absent to
  //       request both div & mod
  //       2) `positive` is true if unsigned mod is requested
  BN.prototype.divmod = function divmod (num, mode, positive) {
    assert(!num.isZero());

    if (this.isZero()) {
      return {
        div: new BN(0),
        mod: new BN(0)
      };
    }

    var div, mod, res;
    if (this.negative !== 0 && num.negative === 0) {
      res = this.neg().divmod(num, mode);

      if (mode !== 'mod') {
        div = res.div.neg();
      }

      if (mode !== 'div') {
        mod = res.mod.neg();
        if (positive && mod.negative !== 0) {
          mod.iadd(num);
        }
      }

      return {
        div: div,
        mod: mod
      };
    }

    if (this.negative === 0 && num.negative !== 0) {
      res = this.divmod(num.neg(), mode);

      if (mode !== 'mod') {
        div = res.div.neg();
      }

      return {
        div: div,
        mod: res.mod
      };
    }

    if ((this.negative & num.negative) !== 0) {
      res = this.neg().divmod(num.neg(), mode);

      if (mode !== 'div') {
        mod = res.mod.neg();
        if (positive && mod.negative !== 0) {
          mod.isub(num);
        }
      }

      return {
        div: res.div,
        mod: mod
      };
    }

    // Both numbers are positive at this point

    // Strip both numbers to approximate shift value
    if (num.length > this.length || this.cmp(num) < 0) {
      return {
        div: new BN(0),
        mod: this
      };
    }

    // Very short reduction
    if (num.length === 1) {
      if (mode === 'div') {
        return {
          div: this.divn(num.words[0]),
          mod: null
        };
      }

      if (mode === 'mod') {
        return {
          div: null,
          mod: new BN(this.modn(num.words[0]))
        };
      }

      return {
        div: this.divn(num.words[0]),
        mod: new BN(this.modn(num.words[0]))
      };
    }

    return this._wordDiv(num, mode);
  };

  // Find `this` / `num`
  BN.prototype.div = function div (num) {
    return this.divmod(num, 'div', false).div;
  };

  // Find `this` % `num`
  BN.prototype.mod = function mod (num) {
    return this.divmod(num, 'mod', false).mod;
  };

  BN.prototype.umod = function umod (num) {
    return this.divmod(num, 'mod', true).mod;
  };

  // Find Round(`this` / `num`)
  BN.prototype.divRound = function divRound (num) {
    var dm = this.divmod(num);

    // Fast case - exact division
    if (dm.mod.isZero()) return dm.div;

    var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;

    var half = num.ushrn(1);
    var r2 = num.andln(1);
    var cmp = mod.cmp(half);

    // Round down
    if (cmp < 0 || r2 === 1 && cmp === 0) return dm.div;

    // Round up
    return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
  };

  BN.prototype.modn = function modn (num) {
    assert(num <= 0x3ffffff);
    var p = (1 << 26) % num;

    var acc = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      acc = (p * acc + (this.words[i] | 0)) % num;
    }

    return acc;
  };

  // In-place division by number
  BN.prototype.idivn = function idivn (num) {
    assert(num <= 0x3ffffff);

    var carry = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      var w = (this.words[i] | 0) + carry * 0x4000000;
      this.words[i] = (w / num) | 0;
      carry = w % num;
    }

    return this.strip();
  };

  BN.prototype.divn = function divn (num) {
    return this.clone().idivn(num);
  };

  BN.prototype.egcd = function egcd (p) {
    assert(p.negative === 0);
    assert(!p.isZero());

    var x = this;
    var y = p.clone();

    if (x.negative !== 0) {
      x = x.umod(p);
    } else {
      x = x.clone();
    }

    // A * x + B * y = x
    var A = new BN(1);
    var B = new BN(0);

    // C * x + D * y = y
    var C = new BN(0);
    var D = new BN(1);

    var g = 0;

    while (x.isEven() && y.isEven()) {
      x.iushrn(1);
      y.iushrn(1);
      ++g;
    }

    var yp = y.clone();
    var xp = x.clone();

    while (!x.isZero()) {
      for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
      if (i > 0) {
        x.iushrn(i);
        while (i-- > 0) {
          if (A.isOdd() || B.isOdd()) {
            A.iadd(yp);
            B.isub(xp);
          }

          A.iushrn(1);
          B.iushrn(1);
        }
      }

      for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
      if (j > 0) {
        y.iushrn(j);
        while (j-- > 0) {
          if (C.isOdd() || D.isOdd()) {
            C.iadd(yp);
            D.isub(xp);
          }

          C.iushrn(1);
          D.iushrn(1);
        }
      }

      if (x.cmp(y) >= 0) {
        x.isub(y);
        A.isub(C);
        B.isub(D);
      } else {
        y.isub(x);
        C.isub(A);
        D.isub(B);
      }
    }

    return {
      a: C,
      b: D,
      gcd: y.iushln(g)
    };
  };

  // This is reduced incarnation of the binary EEA
  // above, designated to invert members of the
  // _prime_ fields F(p) at a maximal speed
  BN.prototype._invmp = function _invmp (p) {
    assert(p.negative === 0);
    assert(!p.isZero());

    var a = this;
    var b = p.clone();

    if (a.negative !== 0) {
      a = a.umod(p);
    } else {
      a = a.clone();
    }

    var x1 = new BN(1);
    var x2 = new BN(0);

    var delta = b.clone();

    while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
      for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
      if (i > 0) {
        a.iushrn(i);
        while (i-- > 0) {
          if (x1.isOdd()) {
            x1.iadd(delta);
          }

          x1.iushrn(1);
        }
      }

      for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
      if (j > 0) {
        b.iushrn(j);
        while (j-- > 0) {
          if (x2.isOdd()) {
            x2.iadd(delta);
          }

          x2.iushrn(1);
        }
      }

      if (a.cmp(b) >= 0) {
        a.isub(b);
        x1.isub(x2);
      } else {
        b.isub(a);
        x2.isub(x1);
      }
    }

    var res;
    if (a.cmpn(1) === 0) {
      res = x1;
    } else {
      res = x2;
    }

    if (res.cmpn(0) < 0) {
      res.iadd(p);
    }

    return res;
  };

  BN.prototype.gcd = function gcd (num) {
    if (this.isZero()) return num.abs();
    if (num.isZero()) return this.abs();

    var a = this.clone();
    var b = num.clone();
    a.negative = 0;
    b.negative = 0;

    // Remove common factor of two
    for (var shift = 0; a.isEven() && b.isEven(); shift++) {
      a.iushrn(1);
      b.iushrn(1);
    }

    do {
      while (a.isEven()) {
        a.iushrn(1);
      }
      while (b.isEven()) {
        b.iushrn(1);
      }

      var r = a.cmp(b);
      if (r < 0) {
        // Swap `a` and `b` to make `a` always bigger than `b`
        var t = a;
        a = b;
        b = t;
      } else if (r === 0 || b.cmpn(1) === 0) {
        break;
      }

      a.isub(b);
    } while (true);

    return b.iushln(shift);
  };

  // Invert number in the field F(num)
  BN.prototype.invm = function invm (num) {
    return this.egcd(num).a.umod(num);
  };

  BN.prototype.isEven = function isEven () {
    return (this.words[0] & 1) === 0;
  };

  BN.prototype.isOdd = function isOdd () {
    return (this.words[0] & 1) === 1;
  };

  // And first word and num
  BN.prototype.andln = function andln (num) {
    return this.words[0] & num;
  };

  // Increment at the bit position in-line
  BN.prototype.bincn = function bincn (bit) {
    assert(typeof bit === 'number');
    var r = bit % 26;
    var s = (bit - r) / 26;
    var q = 1 << r;

    // Fast case: bit is much higher than all existing words
    if (this.length <= s) {
      this._expand(s + 1);
      this.words[s] |= q;
      return this;
    }

    // Add bit and propagate, if needed
    var carry = q;
    for (var i = s; carry !== 0 && i < this.length; i++) {
      var w = this.words[i] | 0;
      w += carry;
      carry = w >>> 26;
      w &= 0x3ffffff;
      this.words[i] = w;
    }
    if (carry !== 0) {
      this.words[i] = carry;
      this.length++;
    }
    return this;
  };

  BN.prototype.isZero = function isZero () {
    return this.length === 1 && this.words[0] === 0;
  };

  BN.prototype.cmpn = function cmpn (num) {
    var negative = num < 0;

    if (this.negative !== 0 && !negative) return -1;
    if (this.negative === 0 && negative) return 1;

    this.strip();

    var res;
    if (this.length > 1) {
      res = 1;
    } else {
      if (negative) {
        num = -num;
      }

      assert(num <= 0x3ffffff, 'Number is too big');

      var w = this.words[0] | 0;
      res = w === num ? 0 : w < num ? -1 : 1;
    }
    if (this.negative !== 0) return -res | 0;
    return res;
  };

  // Compare two numbers and return:
  // 1 - if `this` > `num`
  // 0 - if `this` == `num`
  // -1 - if `this` < `num`
  BN.prototype.cmp = function cmp (num) {
    if (this.negative !== 0 && num.negative === 0) return -1;
    if (this.negative === 0 && num.negative !== 0) return 1;

    var res = this.ucmp(num);
    if (this.negative !== 0) return -res | 0;
    return res;
  };

  // Unsigned comparison
  BN.prototype.ucmp = function ucmp (num) {
    // At this point both numbers have the same sign
    if (this.length > num.length) return 1;
    if (this.length < num.length) return -1;

    var res = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      var a = this.words[i] | 0;
      var b = num.words[i] | 0;

      if (a === b) continue;
      if (a < b) {
        res = -1;
      } else if (a > b) {
        res = 1;
      }
      break;
    }
    return res;
  };

  BN.prototype.gtn = function gtn (num) {
    return this.cmpn(num) === 1;
  };

  BN.prototype.gt = function gt (num) {
    return this.cmp(num) === 1;
  };

  BN.prototype.gten = function gten (num) {
    return this.cmpn(num) >= 0;
  };

  BN.prototype.gte = function gte (num) {
    return this.cmp(num) >= 0;
  };

  BN.prototype.ltn = function ltn (num) {
    return this.cmpn(num) === -1;
  };

  BN.prototype.lt = function lt (num) {
    return this.cmp(num) === -1;
  };

  BN.prototype.lten = function lten (num) {
    return this.cmpn(num) <= 0;
  };

  BN.prototype.lte = function lte (num) {
    return this.cmp(num) <= 0;
  };

  BN.prototype.eqn = function eqn (num) {
    return this.cmpn(num) === 0;
  };

  BN.prototype.eq = function eq (num) {
    return this.cmp(num) === 0;
  };

  //
  // A reduce context, could be using montgomery or something better, depending
  // on the `m` itself.
  //
  BN.red = function red (num) {
    return new Red(num);
  };

  BN.prototype.toRed = function toRed (ctx) {
    assert(!this.red, 'Already a number in reduction context');
    assert(this.negative === 0, 'red works only with positives');
    return ctx.convertTo(this)._forceRed(ctx);
  };

  BN.prototype.fromRed = function fromRed () {
    assert(this.red, 'fromRed works only with numbers in reduction context');
    return this.red.convertFrom(this);
  };

  BN.prototype._forceRed = function _forceRed (ctx) {
    this.red = ctx;
    return this;
  };

  BN.prototype.forceRed = function forceRed (ctx) {
    assert(!this.red, 'Already a number in reduction context');
    return this._forceRed(ctx);
  };

  BN.prototype.redAdd = function redAdd (num) {
    assert(this.red, 'redAdd works only with red numbers');
    return this.red.add(this, num);
  };

  BN.prototype.redIAdd = function redIAdd (num) {
    assert(this.red, 'redIAdd works only with red numbers');
    return this.red.iadd(this, num);
  };

  BN.prototype.redSub = function redSub (num) {
    assert(this.red, 'redSub works only with red numbers');
    return this.red.sub(this, num);
  };

  BN.prototype.redISub = function redISub (num) {
    assert(this.red, 'redISub works only with red numbers');
    return this.red.isub(this, num);
  };

  BN.prototype.redShl = function redShl (num) {
    assert(this.red, 'redShl works only with red numbers');
    return this.red.shl(this, num);
  };

  BN.prototype.redMul = function redMul (num) {
    assert(this.red, 'redMul works only with red numbers');
    this.red._verify2(this, num);
    return this.red.mul(this, num);
  };

  BN.prototype.redIMul = function redIMul (num) {
    assert(this.red, 'redMul works only with red numbers');
    this.red._verify2(this, num);
    return this.red.imul(this, num);
  };

  BN.prototype.redSqr = function redSqr () {
    assert(this.red, 'redSqr works only with red numbers');
    this.red._verify1(this);
    return this.red.sqr(this);
  };

  BN.prototype.redISqr = function redISqr () {
    assert(this.red, 'redISqr works only with red numbers');
    this.red._verify1(this);
    return this.red.isqr(this);
  };

  // Square root over p
  BN.prototype.redSqrt = function redSqrt () {
    assert(this.red, 'redSqrt works only with red numbers');
    this.red._verify1(this);
    return this.red.sqrt(this);
  };

  BN.prototype.redInvm = function redInvm () {
    assert(this.red, 'redInvm works only with red numbers');
    this.red._verify1(this);
    return this.red.invm(this);
  };

  // Return negative clone of `this` % `red modulo`
  BN.prototype.redNeg = function redNeg () {
    assert(this.red, 'redNeg works only with red numbers');
    this.red._verify1(this);
    return this.red.neg(this);
  };

  BN.prototype.redPow = function redPow (num) {
    assert(this.red && !num.red, 'redPow(normalNum)');
    this.red._verify1(this);
    return this.red.pow(this, num);
  };

  // Prime numbers with efficient reduction
  var primes = {
    k256: null,
    p224: null,
    p192: null,
    p25519: null
  };

  // Pseudo-Mersenne prime
  function MPrime (name, p) {
    // P = 2 ^ N - K
    this.name = name;
    this.p = new BN(p, 16);
    this.n = this.p.bitLength();
    this.k = new BN(1).iushln(this.n).isub(this.p);

    this.tmp = this._tmp();
  }

  MPrime.prototype._tmp = function _tmp () {
    var tmp = new BN(null);
    tmp.words = new Array(Math.ceil(this.n / 13));
    return tmp;
  };

  MPrime.prototype.ireduce = function ireduce (num) {
    // Assumes that `num` is less than `P^2`
    // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
    var r = num;
    var rlen;

    do {
      this.split(r, this.tmp);
      r = this.imulK(r);
      r = r.iadd(this.tmp);
      rlen = r.bitLength();
    } while (rlen > this.n);

    var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
    if (cmp === 0) {
      r.words[0] = 0;
      r.length = 1;
    } else if (cmp > 0) {
      r.isub(this.p);
    } else {
      r.strip();
    }

    return r;
  };

  MPrime.prototype.split = function split (input, out) {
    input.iushrn(this.n, 0, out);
  };

  MPrime.prototype.imulK = function imulK (num) {
    return num.imul(this.k);
  };

  function K256 () {
    MPrime.call(
      this,
      'k256',
      'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');
  }
  inherits(K256, MPrime);

  K256.prototype.split = function split (input, output) {
    // 256 = 9 * 26 + 22
    var mask = 0x3fffff;

    var outLen = Math.min(input.length, 9);
    for (var i = 0; i < outLen; i++) {
      output.words[i] = input.words[i];
    }
    output.length = outLen;

    if (input.length <= 9) {
      input.words[0] = 0;
      input.length = 1;
      return;
    }

    // Shift by 9 limbs
    var prev = input.words[9];
    output.words[output.length++] = prev & mask;

    for (i = 10; i < input.length; i++) {
      var next = input.words[i] | 0;
      input.words[i - 10] = ((next & mask) << 4) | (prev >>> 22);
      prev = next;
    }
    prev >>>= 22;
    input.words[i - 10] = prev;
    if (prev === 0 && input.length > 10) {
      input.length -= 10;
    } else {
      input.length -= 9;
    }
  };

  K256.prototype.imulK = function imulK (num) {
    // K = 0x1000003d1 = [ 0x40, 0x3d1 ]
    num.words[num.length] = 0;
    num.words[num.length + 1] = 0;
    num.length += 2;

    // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390
    var lo = 0;
    for (var i = 0; i < num.length; i++) {
      var w = num.words[i] | 0;
      lo += w * 0x3d1;
      num.words[i] = lo & 0x3ffffff;
      lo = w * 0x40 + ((lo / 0x4000000) | 0);
    }

    // Fast length reduction
    if (num.words[num.length - 1] === 0) {
      num.length--;
      if (num.words[num.length - 1] === 0) {
        num.length--;
      }
    }
    return num;
  };

  function P224 () {
    MPrime.call(
      this,
      'p224',
      'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
  }
  inherits(P224, MPrime);

  function P192 () {
    MPrime.call(
      this,
      'p192',
      'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
  }
  inherits(P192, MPrime);

  function P25519 () {
    // 2 ^ 255 - 19
    MPrime.call(
      this,
      '25519',
      '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
  }
  inherits(P25519, MPrime);

  P25519.prototype.imulK = function imulK (num) {
    // K = 0x13
    var carry = 0;
    for (var i = 0; i < num.length; i++) {
      var hi = (num.words[i] | 0) * 0x13 + carry;
      var lo = hi & 0x3ffffff;
      hi >>>= 26;

      num.words[i] = lo;
      carry = hi;
    }
    if (carry !== 0) {
      num.words[num.length++] = carry;
    }
    return num;
  };

  // Exported mostly for testing purposes, use plain name instead
  BN._prime = function prime (name) {
    // Cached version of prime
    if (primes[name]) return primes[name];

    var prime;
    if (name === 'k256') {
      prime = new K256();
    } else if (name === 'p224') {
      prime = new P224();
    } else if (name === 'p192') {
      prime = new P192();
    } else if (name === 'p25519') {
      prime = new P25519();
    } else {
      throw new Error('Unknown prime ' + name);
    }
    primes[name] = prime;

    return prime;
  };

  //
  // Base reduction engine
  //
  function Red (m) {
    if (typeof m === 'string') {
      var prime = BN._prime(m);
      this.m = prime.p;
      this.prime = prime;
    } else {
      assert(m.gtn(1), 'modulus must be greater than 1');
      this.m = m;
      this.prime = null;
    }
  }

  Red.prototype._verify1 = function _verify1 (a) {
    assert(a.negative === 0, 'red works only with positives');
    assert(a.red, 'red works only with red numbers');
  };

  Red.prototype._verify2 = function _verify2 (a, b) {
    assert((a.negative | b.negative) === 0, 'red works only with positives');
    assert(a.red && a.red === b.red,
      'red works only with red numbers');
  };

  Red.prototype.imod = function imod (a) {
    if (this.prime) return this.prime.ireduce(a)._forceRed(this);
    return a.umod(this.m)._forceRed(this);
  };

  Red.prototype.neg = function neg (a) {
    if (a.isZero()) {
      return a.clone();
    }

    return this.m.sub(a)._forceRed(this);
  };

  Red.prototype.add = function add (a, b) {
    this._verify2(a, b);

    var res = a.add(b);
    if (res.cmp(this.m) >= 0) {
      res.isub(this.m);
    }
    return res._forceRed(this);
  };

  Red.prototype.iadd = function iadd (a, b) {
    this._verify2(a, b);

    var res = a.iadd(b);
    if (res.cmp(this.m) >= 0) {
      res.isub(this.m);
    }
    return res;
  };

  Red.prototype.sub = function sub (a, b) {
    this._verify2(a, b);

    var res = a.sub(b);
    if (res.cmpn(0) < 0) {
      res.iadd(this.m);
    }
    return res._forceRed(this);
  };

  Red.prototype.isub = function isub (a, b) {
    this._verify2(a, b);

    var res = a.isub(b);
    if (res.cmpn(0) < 0) {
      res.iadd(this.m);
    }
    return res;
  };

  Red.prototype.shl = function shl (a, num) {
    this._verify1(a);
    return this.imod(a.ushln(num));
  };

  Red.prototype.imul = function imul (a, b) {
    this._verify2(a, b);
    return this.imod(a.imul(b));
  };

  Red.prototype.mul = function mul (a, b) {
    this._verify2(a, b);
    return this.imod(a.mul(b));
  };

  Red.prototype.isqr = function isqr (a) {
    return this.imul(a, a.clone());
  };

  Red.prototype.sqr = function sqr (a) {
    return this.mul(a, a);
  };

  Red.prototype.sqrt = function sqrt (a) {
    if (a.isZero()) return a.clone();

    var mod3 = this.m.andln(3);
    assert(mod3 % 2 === 1);

    // Fast case
    if (mod3 === 3) {
      var pow = this.m.add(new BN(1)).iushrn(2);
      return this.pow(a, pow);
    }

    // Tonelli-Shanks algorithm (Totally unoptimized and slow)
    //
    // Find Q and S, that Q * 2 ^ S = (P - 1)
    var q = this.m.subn(1);
    var s = 0;
    while (!q.isZero() && q.andln(1) === 0) {
      s++;
      q.iushrn(1);
    }
    assert(!q.isZero());

    var one = new BN(1).toRed(this);
    var nOne = one.redNeg();

    // Find quadratic non-residue
    // NOTE: Max is such because of generalized Riemann hypothesis.
    var lpow = this.m.subn(1).iushrn(1);
    var z = this.m.bitLength();
    z = new BN(2 * z * z).toRed(this);

    while (this.pow(z, lpow).cmp(nOne) !== 0) {
      z.redIAdd(nOne);
    }

    var c = this.pow(z, q);
    var r = this.pow(a, q.addn(1).iushrn(1));
    var t = this.pow(a, q);
    var m = s;
    while (t.cmp(one) !== 0) {
      var tmp = t;
      for (var i = 0; tmp.cmp(one) !== 0; i++) {
        tmp = tmp.redSqr();
      }
      assert(i < m);
      var b = this.pow(c, new BN(1).iushln(m - i - 1));

      r = r.redMul(b);
      c = b.redSqr();
      t = t.redMul(c);
      m = i;
    }

    return r;
  };

  Red.prototype.invm = function invm (a) {
    var inv = a._invmp(this.m);
    if (inv.negative !== 0) {
      inv.negative = 0;
      return this.imod(inv).redNeg();
    } else {
      return this.imod(inv);
    }
  };

  Red.prototype.pow = function pow (a, num) {
    if (num.isZero()) return new BN(1);
    if (num.cmpn(1) === 0) return a.clone();

    var windowSize = 4;
    var wnd = new Array(1 << windowSize);
    wnd[0] = new BN(1).toRed(this);
    wnd[1] = a;
    for (var i = 2; i < wnd.length; i++) {
      wnd[i] = this.mul(wnd[i - 1], a);
    }

    var res = wnd[0];
    var current = 0;
    var currentLen = 0;
    var start = num.bitLength() % 26;
    if (start === 0) {
      start = 26;
    }

    for (i = num.length - 1; i >= 0; i--) {
      var word = num.words[i];
      for (var j = start - 1; j >= 0; j--) {
        var bit = (word >> j) & 1;
        if (res !== wnd[0]) {
          res = this.sqr(res);
        }

        if (bit === 0 && current === 0) {
          currentLen = 0;
          continue;
        }

        current <<= 1;
        current |= bit;
        currentLen++;
        if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;

        res = this.mul(res, wnd[current]);
        currentLen = 0;
        current = 0;
      }
      start = 26;
    }

    return res;
  };

  Red.prototype.convertTo = function convertTo (num) {
    var r = num.umod(this.m);

    return r === num ? r.clone() : r;
  };

  Red.prototype.convertFrom = function convertFrom (num) {
    var res = num.clone();
    res.red = null;
    return res;
  };

  //
  // Montgomery method engine
  //

  BN.mont = function mont (num) {
    return new Mont(num);
  };

  function Mont (m) {
    Red.call(this, m);

    this.shift = this.m.bitLength();
    if (this.shift % 26 !== 0) {
      this.shift += 26 - (this.shift % 26);
    }

    this.r = new BN(1).iushln(this.shift);
    this.r2 = this.imod(this.r.sqr());
    this.rinv = this.r._invmp(this.m);

    this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
    this.minv = this.minv.umod(this.r);
    this.minv = this.r.sub(this.minv);
  }
  inherits(Mont, Red);

  Mont.prototype.convertTo = function convertTo (num) {
    return this.imod(num.ushln(this.shift));
  };

  Mont.prototype.convertFrom = function convertFrom (num) {
    var r = this.imod(num.mul(this.rinv));
    r.red = null;
    return r;
  };

  Mont.prototype.imul = function imul (a, b) {
    if (a.isZero() || b.isZero()) {
      a.words[0] = 0;
      a.length = 1;
      return a;
    }

    var t = a.imul(b);
    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
    var u = t.isub(c).iushrn(this.shift);
    var res = u;

    if (u.cmp(this.m) >= 0) {
      res = u.isub(this.m);
    } else if (u.cmpn(0) < 0) {
      res = u.iadd(this.m);
    }

    return res._forceRed(this);
  };

  Mont.prototype.mul = function mul (a, b) {
    if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);

    var t = a.mul(b);
    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
    var u = t.isub(c).iushrn(this.shift);
    var res = u;
    if (u.cmp(this.m) >= 0) {
      res = u.isub(this.m);
    } else if (u.cmpn(0) < 0) {
      res = u.iadd(this.m);
    }

    return res._forceRed(this);
  };

  Mont.prototype.invm = function invm (a) {
    // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
    var res = this.imod(a._invmp(this.m).mul(this.r2));
    return res._forceRed(this);
  };
})(typeof module === 'undefined' || module, this);

},{}],8:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  get: function () {
    if (!(this instanceof Buffer)) {
      return undefined
    }
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  get: function () {
    if (!(this instanceof Buffer)) {
      return undefined
    }
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('Invalid typed array length')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (isArrayBuffer(value) || (value && isArrayBuffer(value.buffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  return fromObject(value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj) {
    if (ArrayBuffer.isView(obj) || 'length' in obj) {
      if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
        return createBuffer(0)
      }
      return fromArrayLike(obj)
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data)
    }
  }

  throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object.')
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (ArrayBuffer.isView(buf)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isArrayBuffer(string)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : new Buffer(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffers from another context (i.e. an iframe) do not pass the `instanceof` check
// but they should be treated as valid. See: https://github.com/feross/buffer/issues/166
function isArrayBuffer (obj) {
  return obj instanceof ArrayBuffer ||
    (obj != null && obj.constructor != null && obj.constructor.name === 'ArrayBuffer' &&
      typeof obj.byteLength === 'number')
}

function numberIsNaN (obj) {
  return obj !== obj // eslint-disable-line no-self-compare
}

},{"base64-js":6,"ieee754":24}],9:[function(require,module,exports){
(function (Buffer){
var sha3 = require('js-sha3').keccak_256
var uts46 = require('idna-uts46')

module.exports = function namehash (inputName) {
  // Reject empty names:
  var node = ''
  for (var i = 0; i < 32; i++) {
    node += '00'
  }

  name = normalize(inputName)

  if (name) {
    var labels = name.split('.')

    for(var i = labels.length - 1; i >= 0; i--) {
      var labelSha = sha3(labels[i])
      node = sha3(new Buffer(node + labelSha, 'hex'))
    }
  }

  return `0x${node}`
}

function normalize(name) {
  return name ? uts46.toUnicode(name, {useStd3ASCII: true, transitional: false}) : name
}

}).call(this,require("buffer").Buffer)
},{"buffer":8,"idna-uts46":23,"js-sha3":10}],10:[function(require,module,exports){
(function (process,global){
/**
 * [js-sha3]{@link https://github.com/emn178/js-sha3}
 *
 * @version 0.5.7
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2015-2016
 * @license MIT
 */
/*jslint bitwise: true */
(function () {
  'use strict';

  var root = typeof window === 'object' ? window : {};
  var NODE_JS = !root.JS_SHA3_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = global;
  }
  var COMMON_JS = !root.JS_SHA3_NO_COMMON_JS && typeof module === 'object' && module.exports;
  var HEX_CHARS = '0123456789abcdef'.split('');
  var SHAKE_PADDING = [31, 7936, 2031616, 520093696];
  var KECCAK_PADDING = [1, 256, 65536, 16777216];
  var PADDING = [6, 1536, 393216, 100663296];
  var SHIFT = [0, 8, 16, 24];
  var RC = [1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648, 32907, 0, 2147483649,
            0, 2147516545, 2147483648, 32777, 2147483648, 138, 0, 136, 0, 2147516425, 0,
            2147483658, 0, 2147516555, 0, 139, 2147483648, 32905, 2147483648, 32771,
            2147483648, 32770, 2147483648, 128, 2147483648, 32778, 0, 2147483658, 2147483648,
            2147516545, 2147483648, 32896, 2147483648, 2147483649, 0, 2147516424, 2147483648];
  var BITS = [224, 256, 384, 512];
  var SHAKE_BITS = [128, 256];
  var OUTPUT_TYPES = ['hex', 'buffer', 'arrayBuffer', 'array'];

  var createOutputMethod = function (bits, padding, outputType) {
    return function (message) {
      return new Keccak(bits, padding, bits).update(message)[outputType]();
    };
  };

  var createShakeOutputMethod = function (bits, padding, outputType) {
    return function (message, outputBits) {
      return new Keccak(bits, padding, outputBits).update(message)[outputType]();
    };
  };

  var createMethod = function (bits, padding) {
    var method = createOutputMethod(bits, padding, 'hex');
    method.create = function () {
      return new Keccak(bits, padding, bits);
    };
    method.update = function (message) {
      return method.create().update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createOutputMethod(bits, padding, type);
    }
    return method;
  };

  var createShakeMethod = function (bits, padding) {
    var method = createShakeOutputMethod(bits, padding, 'hex');
    method.create = function (outputBits) {
      return new Keccak(bits, padding, outputBits);
    };
    method.update = function (message, outputBits) {
      return method.create(outputBits).update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createShakeOutputMethod(bits, padding, type);
    }
    return method;
  };

  var algorithms = [
    {name: 'keccak', padding: KECCAK_PADDING, bits: BITS, createMethod: createMethod},
    {name: 'sha3', padding: PADDING, bits: BITS, createMethod: createMethod},
    {name: 'shake', padding: SHAKE_PADDING, bits: SHAKE_BITS, createMethod: createShakeMethod}
  ];

  var methods = {}, methodNames = [];

  for (var i = 0; i < algorithms.length; ++i) {
    var algorithm = algorithms[i];
    var bits  = algorithm.bits;
    for (var j = 0; j < bits.length; ++j) {
      var methodName = algorithm.name +'_' + bits[j];
      methodNames.push(methodName);
      methods[methodName] = algorithm.createMethod(bits[j], algorithm.padding);
    }
  }

  function Keccak(bits, padding, outputBits) {
    this.blocks = [];
    this.s = [];
    this.padding = padding;
    this.outputBits = outputBits;
    this.reset = true;
    this.block = 0;
    this.start = 0;
    this.blockCount = (1600 - (bits << 1)) >> 5;
    this.byteCount = this.blockCount << 2;
    this.outputBlocks = outputBits >> 5;
    this.extraBytes = (outputBits & 31) >> 3;

    for (var i = 0; i < 50; ++i) {
      this.s[i] = 0;
    }
  }

  Keccak.prototype.update = function (message) {
    var notString = typeof message !== 'string';
    if (notString && message.constructor === ArrayBuffer) {
      message = new Uint8Array(message);
    }
    var length = message.length, blocks = this.blocks, byteCount = this.byteCount,
      blockCount = this.blockCount, index = 0, s = this.s, i, code;

    while (index < length) {
      if (this.reset) {
        this.reset = false;
        blocks[0] = this.block;
        for (i = 1; i < blockCount + 1; ++i) {
          blocks[i] = 0;
        }
      }
      if (notString) {
        for (i = this.start; index < length && i < byteCount; ++index) {
          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
        }
      } else {
        for (i = this.start; index < length && i < byteCount; ++index) {
          code = message.charCodeAt(index);
          if (code < 0x80) {
            blocks[i >> 2] |= code << SHIFT[i++ & 3];
          } else if (code < 0x800) {
            blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else if (code < 0xd800 || code >= 0xe000) {
            blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else {
            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
            blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          }
        }
      }
      this.lastByteIndex = i;
      if (i >= byteCount) {
        this.start = i - byteCount;
        this.block = blocks[blockCount];
        for (i = 0; i < blockCount; ++i) {
          s[i] ^= blocks[i];
        }
        f(s);
        this.reset = true;
      } else {
        this.start = i;
      }
    }
    return this;
  };

  Keccak.prototype.finalize = function () {
    var blocks = this.blocks, i = this.lastByteIndex, blockCount = this.blockCount, s = this.s;
    blocks[i >> 2] |= this.padding[i & 3];
    if (this.lastByteIndex === this.byteCount) {
      blocks[0] = blocks[blockCount];
      for (i = 1; i < blockCount + 1; ++i) {
        blocks[i] = 0;
      }
    }
    blocks[blockCount - 1] |= 0x80000000;
    for (i = 0; i < blockCount; ++i) {
      s[i] ^= blocks[i];
    }
    f(s);
  };

  Keccak.prototype.toString = Keccak.prototype.hex = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
        extraBytes = this.extraBytes, i = 0, j = 0;
    var hex = '', block;
    while (j < outputBlocks) {
      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
        block = s[i];
        hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F] +
               HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F] +
               HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F] +
               HEX_CHARS[(block >> 28) & 0x0F] + HEX_CHARS[(block >> 24) & 0x0F];
      }
      if (j % blockCount === 0) {
        f(s);
        i = 0;
      }
    }
    if (extraBytes) {
      block = s[i];
      if (extraBytes > 0) {
        hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F];
      }
      if (extraBytes > 1) {
        hex += HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F];
      }
      if (extraBytes > 2) {
        hex += HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F];
      }
    }
    return hex;
  };

  Keccak.prototype.arrayBuffer = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
        extraBytes = this.extraBytes, i = 0, j = 0;
    var bytes = this.outputBits >> 3;
    var buffer;
    if (extraBytes) {
      buffer = new ArrayBuffer((outputBlocks + 1) << 2);
    } else {
      buffer = new ArrayBuffer(bytes);
    }
    var array = new Uint32Array(buffer);
    while (j < outputBlocks) {
      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
        array[j] = s[i];
      }
      if (j % blockCount === 0) {
        f(s);
      }
    }
    if (extraBytes) {
      array[i] = s[i];
      buffer = buffer.slice(0, bytes);
    }
    return buffer;
  };

  Keccak.prototype.buffer = Keccak.prototype.arrayBuffer;

  Keccak.prototype.digest = Keccak.prototype.array = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
        extraBytes = this.extraBytes, i = 0, j = 0;
    var array = [], offset, block;
    while (j < outputBlocks) {
      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
        offset = j << 2;
        block = s[i];
        array[offset] = block & 0xFF;
        array[offset + 1] = (block >> 8) & 0xFF;
        array[offset + 2] = (block >> 16) & 0xFF;
        array[offset + 3] = (block >> 24) & 0xFF;
      }
      if (j % blockCount === 0) {
        f(s);
      }
    }
    if (extraBytes) {
      offset = j << 2;
      block = s[i];
      if (extraBytes > 0) {
        array[offset] = block & 0xFF;
      }
      if (extraBytes > 1) {
        array[offset + 1] = (block >> 8) & 0xFF;
      }
      if (extraBytes > 2) {
        array[offset + 2] = (block >> 16) & 0xFF;
      }
    }
    return array;
  };

  var f = function (s) {
    var h, l, n, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9,
        b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17,
        b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33,
        b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49;
    for (n = 0; n < 48; n += 2) {
      c0 = s[0] ^ s[10] ^ s[20] ^ s[30] ^ s[40];
      c1 = s[1] ^ s[11] ^ s[21] ^ s[31] ^ s[41];
      c2 = s[2] ^ s[12] ^ s[22] ^ s[32] ^ s[42];
      c3 = s[3] ^ s[13] ^ s[23] ^ s[33] ^ s[43];
      c4 = s[4] ^ s[14] ^ s[24] ^ s[34] ^ s[44];
      c5 = s[5] ^ s[15] ^ s[25] ^ s[35] ^ s[45];
      c6 = s[6] ^ s[16] ^ s[26] ^ s[36] ^ s[46];
      c7 = s[7] ^ s[17] ^ s[27] ^ s[37] ^ s[47];
      c8 = s[8] ^ s[18] ^ s[28] ^ s[38] ^ s[48];
      c9 = s[9] ^ s[19] ^ s[29] ^ s[39] ^ s[49];

      h = c8 ^ ((c2 << 1) | (c3 >>> 31));
      l = c9 ^ ((c3 << 1) | (c2 >>> 31));
      s[0] ^= h;
      s[1] ^= l;
      s[10] ^= h;
      s[11] ^= l;
      s[20] ^= h;
      s[21] ^= l;
      s[30] ^= h;
      s[31] ^= l;
      s[40] ^= h;
      s[41] ^= l;
      h = c0 ^ ((c4 << 1) | (c5 >>> 31));
      l = c1 ^ ((c5 << 1) | (c4 >>> 31));
      s[2] ^= h;
      s[3] ^= l;
      s[12] ^= h;
      s[13] ^= l;
      s[22] ^= h;
      s[23] ^= l;
      s[32] ^= h;
      s[33] ^= l;
      s[42] ^= h;
      s[43] ^= l;
      h = c2 ^ ((c6 << 1) | (c7 >>> 31));
      l = c3 ^ ((c7 << 1) | (c6 >>> 31));
      s[4] ^= h;
      s[5] ^= l;
      s[14] ^= h;
      s[15] ^= l;
      s[24] ^= h;
      s[25] ^= l;
      s[34] ^= h;
      s[35] ^= l;
      s[44] ^= h;
      s[45] ^= l;
      h = c4 ^ ((c8 << 1) | (c9 >>> 31));
      l = c5 ^ ((c9 << 1) | (c8 >>> 31));
      s[6] ^= h;
      s[7] ^= l;
      s[16] ^= h;
      s[17] ^= l;
      s[26] ^= h;
      s[27] ^= l;
      s[36] ^= h;
      s[37] ^= l;
      s[46] ^= h;
      s[47] ^= l;
      h = c6 ^ ((c0 << 1) | (c1 >>> 31));
      l = c7 ^ ((c1 << 1) | (c0 >>> 31));
      s[8] ^= h;
      s[9] ^= l;
      s[18] ^= h;
      s[19] ^= l;
      s[28] ^= h;
      s[29] ^= l;
      s[38] ^= h;
      s[39] ^= l;
      s[48] ^= h;
      s[49] ^= l;

      b0 = s[0];
      b1 = s[1];
      b32 = (s[11] << 4) | (s[10] >>> 28);
      b33 = (s[10] << 4) | (s[11] >>> 28);
      b14 = (s[20] << 3) | (s[21] >>> 29);
      b15 = (s[21] << 3) | (s[20] >>> 29);
      b46 = (s[31] << 9) | (s[30] >>> 23);
      b47 = (s[30] << 9) | (s[31] >>> 23);
      b28 = (s[40] << 18) | (s[41] >>> 14);
      b29 = (s[41] << 18) | (s[40] >>> 14);
      b20 = (s[2] << 1) | (s[3] >>> 31);
      b21 = (s[3] << 1) | (s[2] >>> 31);
      b2 = (s[13] << 12) | (s[12] >>> 20);
      b3 = (s[12] << 12) | (s[13] >>> 20);
      b34 = (s[22] << 10) | (s[23] >>> 22);
      b35 = (s[23] << 10) | (s[22] >>> 22);
      b16 = (s[33] << 13) | (s[32] >>> 19);
      b17 = (s[32] << 13) | (s[33] >>> 19);
      b48 = (s[42] << 2) | (s[43] >>> 30);
      b49 = (s[43] << 2) | (s[42] >>> 30);
      b40 = (s[5] << 30) | (s[4] >>> 2);
      b41 = (s[4] << 30) | (s[5] >>> 2);
      b22 = (s[14] << 6) | (s[15] >>> 26);
      b23 = (s[15] << 6) | (s[14] >>> 26);
      b4 = (s[25] << 11) | (s[24] >>> 21);
      b5 = (s[24] << 11) | (s[25] >>> 21);
      b36 = (s[34] << 15) | (s[35] >>> 17);
      b37 = (s[35] << 15) | (s[34] >>> 17);
      b18 = (s[45] << 29) | (s[44] >>> 3);
      b19 = (s[44] << 29) | (s[45] >>> 3);
      b10 = (s[6] << 28) | (s[7] >>> 4);
      b11 = (s[7] << 28) | (s[6] >>> 4);
      b42 = (s[17] << 23) | (s[16] >>> 9);
      b43 = (s[16] << 23) | (s[17] >>> 9);
      b24 = (s[26] << 25) | (s[27] >>> 7);
      b25 = (s[27] << 25) | (s[26] >>> 7);
      b6 = (s[36] << 21) | (s[37] >>> 11);
      b7 = (s[37] << 21) | (s[36] >>> 11);
      b38 = (s[47] << 24) | (s[46] >>> 8);
      b39 = (s[46] << 24) | (s[47] >>> 8);
      b30 = (s[8] << 27) | (s[9] >>> 5);
      b31 = (s[9] << 27) | (s[8] >>> 5);
      b12 = (s[18] << 20) | (s[19] >>> 12);
      b13 = (s[19] << 20) | (s[18] >>> 12);
      b44 = (s[29] << 7) | (s[28] >>> 25);
      b45 = (s[28] << 7) | (s[29] >>> 25);
      b26 = (s[38] << 8) | (s[39] >>> 24);
      b27 = (s[39] << 8) | (s[38] >>> 24);
      b8 = (s[48] << 14) | (s[49] >>> 18);
      b9 = (s[49] << 14) | (s[48] >>> 18);

      s[0] = b0 ^ (~b2 & b4);
      s[1] = b1 ^ (~b3 & b5);
      s[10] = b10 ^ (~b12 & b14);
      s[11] = b11 ^ (~b13 & b15);
      s[20] = b20 ^ (~b22 & b24);
      s[21] = b21 ^ (~b23 & b25);
      s[30] = b30 ^ (~b32 & b34);
      s[31] = b31 ^ (~b33 & b35);
      s[40] = b40 ^ (~b42 & b44);
      s[41] = b41 ^ (~b43 & b45);
      s[2] = b2 ^ (~b4 & b6);
      s[3] = b3 ^ (~b5 & b7);
      s[12] = b12 ^ (~b14 & b16);
      s[13] = b13 ^ (~b15 & b17);
      s[22] = b22 ^ (~b24 & b26);
      s[23] = b23 ^ (~b25 & b27);
      s[32] = b32 ^ (~b34 & b36);
      s[33] = b33 ^ (~b35 & b37);
      s[42] = b42 ^ (~b44 & b46);
      s[43] = b43 ^ (~b45 & b47);
      s[4] = b4 ^ (~b6 & b8);
      s[5] = b5 ^ (~b7 & b9);
      s[14] = b14 ^ (~b16 & b18);
      s[15] = b15 ^ (~b17 & b19);
      s[24] = b24 ^ (~b26 & b28);
      s[25] = b25 ^ (~b27 & b29);
      s[34] = b34 ^ (~b36 & b38);
      s[35] = b35 ^ (~b37 & b39);
      s[44] = b44 ^ (~b46 & b48);
      s[45] = b45 ^ (~b47 & b49);
      s[6] = b6 ^ (~b8 & b0);
      s[7] = b7 ^ (~b9 & b1);
      s[16] = b16 ^ (~b18 & b10);
      s[17] = b17 ^ (~b19 & b11);
      s[26] = b26 ^ (~b28 & b20);
      s[27] = b27 ^ (~b29 & b21);
      s[36] = b36 ^ (~b38 & b30);
      s[37] = b37 ^ (~b39 & b31);
      s[46] = b46 ^ (~b48 & b40);
      s[47] = b47 ^ (~b49 & b41);
      s[8] = b8 ^ (~b0 & b2);
      s[9] = b9 ^ (~b1 & b3);
      s[18] = b18 ^ (~b10 & b12);
      s[19] = b19 ^ (~b11 & b13);
      s[28] = b28 ^ (~b20 & b22);
      s[29] = b29 ^ (~b21 & b23);
      s[38] = b38 ^ (~b30 & b32);
      s[39] = b39 ^ (~b31 & b33);
      s[48] = b48 ^ (~b40 & b42);
      s[49] = b49 ^ (~b41 & b43);

      s[0] ^= RC[n];
      s[1] ^= RC[n + 1];
    }
  };

  if (COMMON_JS) {
    module.exports = methods;
  } else {
    for (var i = 0; i < methodNames.length; ++i) {
      root[methodNames[i]] = methods[methodNames[i]];
    }
  }
})();

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":28}],11:[function(require,module,exports){
module.exports = {
  // Mainnet
  '1': '0x314159265dd8dbb310642f98f50c066173c1259b',
  // Ropsten
  '3': '0x112234455c3a32fd11230c42e7bccd4a84e02010',
}

},{}],12:[function(require,module,exports){
(function (Buffer){
'use strict';

/* eslint-disable */

var utils = require('./utils/index.js');
var uint256Coder = utils.uint256Coder;
var coderBoolean = utils.coderBoolean;
var coderFixedBytes = utils.coderFixedBytes;
var coderAddress = utils.coderAddress;
var coderDynamicBytes = utils.coderDynamicBytes;
var coderString = utils.coderString;
var coderArray = utils.coderArray;
var paramTypePart = utils.paramTypePart;
var getParamCoder = utils.getParamCoder;

function Result() {}

function encodeParams(types, values) {
  if (types.length !== values.length) {
    throw new Error('[ethjs-abi] while encoding params, types/values mismatch, Your contract requires ' + types.length + ' types (arguments), and you passed in ' + values.length);
  }

  var parts = [];

  types.forEach(function (type, index) {
    var coder = getParamCoder(type);
    parts.push({ dynamic: coder.dynamic, value: coder.encode(values[index]) });
  });

  function alignSize(size) {
    return parseInt(32 * Math.ceil(size / 32));
  }

  var staticSize = 0,
      dynamicSize = 0;
  parts.forEach(function (part) {
    if (part.dynamic) {
      staticSize += 32;
      dynamicSize += alignSize(part.value.length);
    } else {
      staticSize += alignSize(part.value.length);
    }
  });

  var offset = 0,
      dynamicOffset = staticSize;
  var data = new Buffer(staticSize + dynamicSize);

  parts.forEach(function (part, index) {
    if (part.dynamic) {
      uint256Coder.encode(dynamicOffset).copy(data, offset);
      offset += 32;

      part.value.copy(data, dynamicOffset);
      dynamicOffset += alignSize(part.value.length);
    } else {
      part.value.copy(data, offset);
      offset += alignSize(part.value.length);
    }
  });

  return '0x' + data.toString('hex');
}

// decode bytecode data from output names and types
function decodeParams(names, types, data) {
  var useNumberedParams = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  // Names is optional, so shift over all the parameters if not provided
  if (arguments.length < 3) {
    data = types;
    types = names;
    names = [];
  }

  data = utils.hexOrBuffer(data);
  var values = new Result();

  var offset = 0;
  types.forEach(function (type, index) {
    var coder = getParamCoder(type);
    if (coder.dynamic) {
      var dynamicOffset = uint256Coder.decode(data, offset);
      var result = coder.decode(data, dynamicOffset.value.toNumber());
      offset += dynamicOffset.consumed;
    } else {
      var result = coder.decode(data, offset);
      offset += result.consumed;
    }
    if (useNumberedParams) values[index] = result.value;
    if (names[index]) {
      values[names[index]] = result.value;
    }
  });
  return values;
}

// encode method ABI object with values in an array, output bytecode
function encodeMethod(method, values) {
  var signature = method.name + '(' + utils.getKeys(method.inputs, 'type').join(',') + ')';
  var signatureEncoded = '0x' + new Buffer(utils.keccak256(signature), 'hex').slice(0, 4).toString('hex');
  var paramsEncoded = encodeParams(utils.getKeys(method.inputs, 'type'), values).substring(2);

  return '' + signatureEncoded + paramsEncoded;
}

// decode method data bytecode, from method ABI object
function decodeMethod(method, data) {
  var outputNames = utils.getKeys(method.outputs, 'name', true);
  var outputTypes = utils.getKeys(method.outputs, 'type');

  return decodeParams(outputNames, outputTypes, utils.hexOrBuffer(data));
}

// decode method data bytecode, from method ABI object
function encodeEvent(eventObject, values) {
  return encodeMethod(eventObject, values);
}

function eventSignature(eventObject) {
  var signature = eventObject.name + '(' + utils.getKeys(eventObject.inputs, 'type').join(',') + ')';
  return '0x' + utils.keccak256(signature);
}

// decode method data bytecode, from method ABI object
function decodeEvent(eventObject, data, topics) {
  var useNumberedParams = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  var nonIndexed = eventObject.inputs.filter(function (input) {
    return !input.indexed;
  });
  var nonIndexedNames = utils.getKeys(nonIndexed, 'name', true);
  var nonIndexedTypes = utils.getKeys(nonIndexed, 'type');
  var event = decodeParams(nonIndexedNames, nonIndexedTypes, utils.hexOrBuffer(data), useNumberedParams);
  var topicOffset = eventObject.anonymous ? 0 : 1;
  eventObject.inputs.filter(function (input) {
    return input.indexed;
  }).map(function (input, i) {
    var topic = new Buffer(topics[i + topicOffset].slice(2), 'hex');
    var coder = getParamCoder(input.type);
    event[input.name] = coder.decode(topic, 0).value;
  });
  event._eventName = eventObject.name;
  return event;
}

// Decode a specific log item with a specific event abi
function decodeLogItem(eventObject, log) {
  var useNumberedParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (eventObject && log.topics[0] === eventSignature(eventObject)) {
    return decodeEvent(eventObject, log.data, log.topics, useNumberedParams);
  }
}

// Create a decoder for all events defined in an abi. It returns a function which is called
// on an array of log entries such as received from getLogs or getTransactionReceipt and parses
// any matching log entries
function logDecoder(abi) {
  var useNumberedParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  var eventMap = {};
  abi.filter(function (item) {
    return item.type === 'event';
  }).map(function (item) {
    eventMap[eventSignature(item)] = item;
  });
  return function (logItems) {
    return logItems.map(function (log) {
      return decodeLogItem(eventMap[log.topics[0]], log, useNumberedParams);
    }).filter(function (i) {
      return i;
    });
  };
}

module.exports = {
  encodeParams: encodeParams,
  decodeParams: decodeParams,
  encodeMethod: encodeMethod,
  decodeMethod: decodeMethod,
  encodeEvent: encodeEvent,
  decodeEvent: decodeEvent,
  decodeLogItem: decodeLogItem,
  logDecoder: logDecoder,
  eventSignature: eventSignature
};
}).call(this,require("buffer").Buffer)
},{"./utils/index.js":13,"buffer":8}],13:[function(require,module,exports){
(function (Buffer){
'use strict';

var BN = require('bn.js');
var numberToBN = require('number-to-bn');
var keccak256 = require('js-sha3').keccak_256;

// from ethereumjs-util
function stripZeros(aInput) {
  var a = aInput; // eslint-disable-line
  var first = a[0]; // eslint-disable-line
  while (a.length > 0 && first.toString() === '0') {
    a = a.slice(1);
    first = a[0];
  }
  return a;
}

function bnToBuffer(bnInput) {
  var bn = bnInput; // eslint-disable-line
  var hex = bn.toString(16); // eslint-disable-line
  if (hex.length % 2) {
    hex = '0' + hex;
  }
  return stripZeros(new Buffer(hex, 'hex'));
}

function isHexString(value, length) {
  if (typeof value !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }
  if (length && value.length !== 2 + 2 * length) {
    return false;
  }
  return true;
}

function hexOrBuffer(valueInput, name) {
  var value = valueInput; // eslint-disable-line
  if (!Buffer.isBuffer(value)) {
    if (!isHexString(value)) {
      var error = new Error(name ? '[ethjs-abi] invalid ' + name : '[ethjs-abi] invalid hex or buffer, must be a prefixed alphanumeric even length hex string');
      error.reason = '[ethjs-abi] invalid hex string, hex must be prefixed and alphanumeric (e.g. 0x023..)';
      error.value = value;
      throw error;
    }

    value = value.substring(2);
    if (value.length % 2) {
      value = '0' + value;
    }
    value = new Buffer(value, 'hex');
  }

  return value;
}

function hexlify(value) {
  if (typeof value === 'number') {
    return '0x' + bnToBuffer(new BN(value)).toString('hex');
  } else if (value.mod || value.modulo) {
    return '0x' + bnToBuffer(value).toString('hex');
  } else {
    // eslint-disable-line
    return '0x' + hexOrBuffer(value).toString('hex');
  }
}

// getKeys([{a: 1, b: 2}, {a: 3, b: 4}], 'a') => [1, 3]
function getKeys(params, key, allowEmpty) {
  var result = []; // eslint-disable-line

  if (!Array.isArray(params)) {
    throw new Error('[ethjs-abi] while getting keys, invalid params value ' + JSON.stringify(params));
  }

  for (var i = 0; i < params.length; i++) {
    // eslint-disable-line
    var value = params[i][key]; // eslint-disable-line
    if (allowEmpty && !value) {
      value = '';
    } else if (typeof value !== 'string') {
      throw new Error('[ethjs-abi] while getKeys found invalid ABI data structure, type value not string');
    }
    result.push(value);
  }

  return result;
}

function coderNumber(size, signed) {
  return {
    encode: function encodeNumber(valueInput) {
      var value = valueInput; // eslint-disable-line

      if (typeof value === 'object' && value.toString && (value.toTwos || value.dividedToIntegerBy)) {
        value = value.toString(10).split('.')[0];
      }

      if (typeof value === 'string' || typeof value === 'number') {
        value = String(value).split('.')[0];
      }

      value = numberToBN(value);
      value = value.toTwos(size * 8).maskn(size * 8);
      if (signed) {
        value = value.fromTwos(size * 8).toTwos(256);
      }
      return value.toArrayLike(Buffer, 'be', 32);
    },
    decode: function decodeNumber(data, offset) {
      var junkLength = 32 - size; // eslint-disable-line
      var value = new BN(data.slice(offset + junkLength, offset + 32)); // eslint-disable-line
      if (signed) {
        value = value.fromTwos(size * 8);
      } else {
        value = value.maskn(size * 8);
      }
      return {
        consumed: 32,
        value: new BN(value.toString(10))
      };
    }
  };
}
var uint256Coder = coderNumber(32, false);

var coderBoolean = {
  encode: function encodeBoolean(value) {
    return uint256Coder.encode(value ? 1 : 0);
  },
  decode: function decodeBoolean(data, offset) {
    var result = uint256Coder.decode(data, offset); // eslint-disable-line
    return {
      consumed: result.consumed,
      value: !result.value.isZero()
    };
  }
};

function coderFixedBytes(length) {
  return {
    encode: function encodeFixedBytes(valueInput) {
      var value = valueInput; // eslint-disable-line
      value = hexOrBuffer(value);

      if (value.length === 32) {
        return value;
      }

      var result = new Buffer(32); // eslint-disable-line
      result.fill(0);
      value.copy(result);
      return result;
    },
    decode: function decodeFixedBytes(data, offset) {
      if (data.length !== 0 && data.length < offset + 32) {
        throw new Error('[ethjs-abi] while decoding fixed bytes, invalid bytes data length: ' + length);
      }

      return {
        consumed: 32,
        value: '0x' + data.slice(offset, offset + length).toString('hex')
      };
    }
  };
}

var coderAddress = {
  encode: function encodeAddress(valueInput) {
    var value = valueInput; // eslint-disable-line
    var result = new Buffer(32); // eslint-disable-line
    if (!isHexString(value, 20)) {
      throw new Error('[ethjs-abi] while encoding address, invalid address value, not alphanumeric 20 byte hex string');
    }
    value = hexOrBuffer(value);
    result.fill(0);
    value.copy(result, 12);
    return result;
  },
  decode: function decodeAddress(data, offset) {
    if (data.length === 0) {
      return {
        consumed: 32,
        value: '0x'
      };
    }
    if (data.length !== 0 && data.length < offset + 32) {
      throw new Error('[ethjs-abi] while decoding address data, invalid address data, invalid byte length ' + data.length);
    }
    return {
      consumed: 32,
      value: '0x' + data.slice(offset + 12, offset + 32).toString('hex')
    };
  }
};

function encodeDynamicBytesHelper(value) {
  var dataLength = parseInt(32 * Math.ceil(value.length / 32)); // eslint-disable-line
  var padding = new Buffer(dataLength - value.length); // eslint-disable-line
  padding.fill(0);

  return Buffer.concat([uint256Coder.encode(value.length), value, padding]);
}

function decodeDynamicBytesHelper(data, offset) {
  if (data.length !== 0 && data.length < offset + 32) {
    throw new Error('[ethjs-abi] while decoding dynamic bytes data, invalid bytes length: ' + data.length + ' should be less than ' + (offset + 32));
  }

  var length = uint256Coder.decode(data, offset).value; // eslint-disable-line
  length = length.toNumber();
  if (data.length !== 0 && data.length < offset + 32 + length) {
    throw new Error('[ethjs-abi] while decoding dynamic bytes data, invalid bytes length: ' + data.length + ' should be less than ' + (offset + 32 + length));
  }

  return {
    consumed: parseInt(32 + 32 * Math.ceil(length / 32), 10),
    value: data.slice(offset + 32, offset + 32 + length)
  };
}

var coderDynamicBytes = {
  encode: function encodeDynamicBytes(value) {
    return encodeDynamicBytesHelper(hexOrBuffer(value));
  },
  decode: function decodeDynamicBytes(data, offset) {
    var result = decodeDynamicBytesHelper(data, offset); // eslint-disable-line
    result.value = '0x' + result.value.toString('hex');
    return result;
  },
  dynamic: true
};

var coderString = {
  encode: function encodeString(value) {
    return encodeDynamicBytesHelper(new Buffer(value, 'utf8'));
  },
  decode: function decodeString(data, offset) {
    var result = decodeDynamicBytesHelper(data, offset); // eslint-disable-line
    result.value = result.value.toString('utf8');
    return result;
  },
  dynamic: true
};

function coderArray(coder, lengthInput) {
  return {
    encode: function encodeArray(value) {
      var result = new Buffer(0); // eslint-disable-line
      var length = lengthInput; // eslint-disable-line

      if (!Array.isArray(value)) {
        throw new Error('[ethjs-abi] while encoding array, invalid array data, not type Object (Array)');
      }

      if (length === -1) {
        length = value.length;
        result = uint256Coder.encode(length);
      }

      if (length !== value.length) {
        throw new Error('[ethjs-abi] while encoding array, size mismatch array length ' + length + ' does not equal ' + value.length);
      }

      value.forEach(function (resultValue) {
        result = Buffer.concat([result, coder.encode(resultValue)]);
      });

      return result;
    },
    decode: function decodeArray(data, offsetInput) {
      var length = lengthInput; // eslint-disable-line
      var offset = offsetInput; // eslint-disable-line
      // @TODO:
      // if (data.length < offset + length * 32) { throw new Error('invalid array'); }

      var consumed = 0; // eslint-disable-line
      var decodeResult; // eslint-disable-line

      if (length === -1) {
        decodeResult = uint256Coder.decode(data, offset);
        length = decodeResult.value.toNumber();
        consumed += decodeResult.consumed;
        offset += decodeResult.consumed;
      }

      var value = []; // eslint-disable-line

      for (var i = 0; i < length; i++) {
        // eslint-disable-line
        var loopResult = coder.decode(data, offset);
        consumed += loopResult.consumed;
        offset += loopResult.consumed;
        value.push(loopResult.value);
      }

      return {
        consumed: consumed,
        value: value
      };
    },
    dynamic: lengthInput === -1
  };
}

// Break the type up into [staticType][staticArray]*[dynamicArray]? | [dynamicType] and
// build the coder up from its parts
var paramTypePart = new RegExp(/^((u?int|bytes)([0-9]*)|(address|bool|string)|(\[([0-9]*)\]))/);

function getParamCoder(typeInput) {
  var type = typeInput; // eslint-disable-line
  var coder = null; // eslint-disable-line
  var invalidTypeErrorMessage = '[ethjs-abi] while getting param coder (getParamCoder) type value ' + JSON.stringify(type) + ' is either invalid or unsupported by ethjs-abi.';

  while (type) {
    var part = type.match(paramTypePart); // eslint-disable-line
    if (!part) {
      throw new Error(invalidTypeErrorMessage);
    }
    type = type.substring(part[0].length);

    var prefix = part[2] || part[4] || part[5]; // eslint-disable-line
    switch (prefix) {
      case 'int':case 'uint':
        if (coder) {
          throw new Error(invalidTypeErrorMessage);
        }
        var intSize = parseInt(part[3] || 256); // eslint-disable-line
        if (intSize === 0 || intSize > 256 || intSize % 8 !== 0) {
          throw new Error('[ethjs-abi] while getting param coder for type ' + type + ', invalid ' + prefix + '<N> width: ' + type);
        }

        coder = coderNumber(intSize / 8, prefix === 'int');
        break;

      case 'bool':
        if (coder) {
          throw new Error(invalidTypeErrorMessage);
        }
        coder = coderBoolean;
        break;

      case 'string':
        if (coder) {
          throw new Error(invalidTypeErrorMessage);
        }
        coder = coderString;
        break;

      case 'bytes':
        if (coder) {
          throw new Error(invalidTypeErrorMessage);
        }
        if (part[3]) {
          var size = parseInt(part[3]); // eslint-disable-line
          if (size === 0 || size > 32) {
            throw new Error('[ethjs-abi] while getting param coder for prefix bytes, invalid type ' + type + ', size ' + size + ' should be 0 or greater than 32');
          }
          coder = coderFixedBytes(size);
        } else {
          coder = coderDynamicBytes;
        }
        break;

      case 'address':
        if (coder) {
          throw new Error(invalidTypeErrorMessage);
        }
        coder = coderAddress;
        break;

      case '[]':
        if (!coder || coder.dynamic) {
          throw new Error(invalidTypeErrorMessage);
        }
        coder = coderArray(coder, -1);
        break;

      // "[0-9+]"
      default:
        if (!coder || coder.dynamic) {
          throw new Error(invalidTypeErrorMessage);
        }
        var defaultSize = parseInt(part[6]); // eslint-disable-line
        coder = coderArray(coder, defaultSize);
    }
  }

  if (!coder) {
    throw new Error(invalidTypeErrorMessage);
  }
  return coder;
}

module.exports = {
  BN: BN,
  bnToBuffer: bnToBuffer,
  isHexString: isHexString,
  hexOrBuffer: hexOrBuffer,
  hexlify: hexlify,
  stripZeros: stripZeros,

  keccak256: keccak256,

  getKeys: getKeys,
  numberToBN: numberToBN,
  coderNumber: coderNumber,
  uint256Coder: uint256Coder,
  coderBoolean: coderBoolean,
  coderFixedBytes: coderFixedBytes,
  coderAddress: coderAddress,
  coderDynamicBytes: coderDynamicBytes,
  coderString: coderString,
  coderArray: coderArray,
  paramTypePart: paramTypePart,
  getParamCoder: getParamCoder
};
}).call(this,require("buffer").Buffer)
},{"bn.js":7,"buffer":8,"js-sha3":26,"number-to-bn":27}],14:[function(require,module,exports){
'use strict';

var abi = require('ethjs-abi'); // eslint-disable-line
var keccak256 = require('js-sha3').keccak_256; // eslint-disable-line
var EthFilter = require('ethjs-filter'); // eslint-disable-line
var getKeys = require('ethjs-util').getKeys; // eslint-disable-line
var arrayContainsArray = require('ethjs-util').arrayContainsArray;

function hasTransactionObject(args) {
  var txObjectProperties = ['from', 'to', 'data', 'value', 'gasPrice', 'gas'];
  if (typeof args === 'object' && Array.isArray(args) === true && args.length > 0) {
    if (typeof args[args.length - 1] === 'object' && (Object.keys(args[args.length - 1]).length === 0 || arrayContainsArray(Object.keys(args[args.length - 1]), txObjectProperties, true))) {
      return true;
    }
  }

  return false;
}

function getConstructorFromABI(contractABI) {
  return contractABI.filter(function (json) {
    return json.type === 'constructor';
  })[0];
}

function getCallableMethodsFromABI(contractABI) {
  return contractABI.filter(function (json) {
    return (json.type === 'function' || json.type === 'event') && json.name.length > 0;
  });
}

function contractFactory(query) {
  return function ContractFactory(contractABI, contractBytecode, contractDefaultTxObject) {
    if (!Array.isArray(contractABI)) {
      throw new Error('[ethjs-contract] Contract ABI must be type Array, got type ' + typeof contractABI);
    }
    if (typeof contractBytecode !== 'undefined' && typeof contractBytecode !== 'string') {
      throw new Error('[ethjs-contract] Contract bytecode must be type String, got type ' + typeof contractBytecode);
    }
    if (typeof contractDefaultTxObject !== 'undefined' && typeof contractDefaultTxObject !== 'object') {
      throw new Error('[ethjs-contract] Contract default tx object must be type Object, got type ' + typeof contractABI);
    }

    var output = {};
    output.at = function atContract(address) {
      function Contract() {
        var self = this;
        self.abi = contractABI || [];
        self.query = query;
        self.address = address || '0x';
        self.bytecode = contractBytecode || '0x';
        self.defaultTxObject = contractDefaultTxObject || {};
        self.filters = new EthFilter(query);

        getCallableMethodsFromABI(contractABI).forEach(function (methodObject) {
          self[methodObject.name] = function contractMethod() {
            // eslint-disable-line
            var queryMethod = 'call'; // eslint-disable-line
            var providedTxObject = {}; // eslint-disable-line
            var methodCallback = function methodCallback() {}; // eslint-disable-line
            var methodArgs = [].slice.call(arguments); // eslint-disable-line
            if (typeof methodArgs[methodArgs.length - 1] === 'function') {
              methodCallback = methodArgs.pop();
            }

            if (methodObject.type === 'function') {
              return new Promise(function (resolve, reject) {
                function newMethodCallback(callbackError, callbackResult) {
                  if (queryMethod === 'call' && !callbackError) {
                    try {
                      var decodedMethodResult = abi.decodeMethod(methodObject, callbackResult);

                      resolve(decodedMethodResult);
                      methodCallback(null, decodedMethodResult);
                    } catch (decodeFormattingError) {
                      var decodingError = new Error('[ethjs-contract] while formatting incoming raw call data ' + JSON.stringify(callbackResult) + ' ' + decodeFormattingError);

                      reject(decodingError);
                      methodCallback(decodingError, null);
                    }
                  } else if (queryMethod === 'sendTransaction' && !callbackError) {
                    resolve(callbackResult);
                    methodCallback(null, callbackResult);
                  } else {
                    reject(callbackError);
                    methodCallback(callbackError, null);
                  }
                }

                if (hasTransactionObject(methodArgs)) providedTxObject = methodArgs.pop();
                var methodTxObject = Object.assign({}, self.defaultTxObject, providedTxObject, {
                  to: self.address
                });
                methodTxObject.data = abi.encodeMethod(methodObject, methodArgs);

                if (methodObject.constant === false) {
                  queryMethod = 'sendTransaction';
                }

                query[queryMethod](methodTxObject, newMethodCallback);
              });
            } else if (methodObject.type === 'event') {
              var _ret = function () {
                var filterInputTypes = getKeys(methodObject.inputs, 'type', false);
                var filterTopic = '0x' + keccak256(methodObject.name + '(' + filterInputTypes.join(',') + ')');
                var filterTopcis = [filterTopic];
                var argsObject = Object.assign({}, methodArgs[0]) || {};

                return {
                  v: new self.filters.Filter(Object.assign({}, argsObject, {
                    decoder: function decoder(logData) {
                      return abi.decodeEvent(methodObject, logData, filterTopcis);
                    },
                    defaultFilterObject: Object.assign({}, methodArgs[0] || {}, {
                      to: self.address,
                      topics: filterTopcis
                    })
                  }))
                };
              }();

              if (typeof _ret === "object") return _ret.v;
            }
          };
        });
      }

      return new Contract();
    };

    output['new'] = function newContract() {
      var providedTxObject = {}; // eslint-disable-line
      var newMethodCallback = function newMethodCallback() {}; // eslint-disable-line
      var newMethodArgs = [].slice.call(arguments); // eslint-disable-line
      if (typeof newMethodArgs[newMethodArgs.length - 1] === 'function') newMethodCallback = newMethodArgs.pop();
      if (hasTransactionObject(newMethodArgs)) providedTxObject = newMethodArgs.pop();
      var constructMethod = getConstructorFromABI(contractABI);
      var assembleTxObject = Object.assign({}, contractDefaultTxObject, providedTxObject);

      // if contract bytecode was predefined
      if (contractBytecode) {
        assembleTxObject.data = contractBytecode;
      }

      // if constructor bytecode
      if (constructMethod) {
        var constructBytecode = abi.encodeParams(getKeys(constructMethod.inputs, 'type'), newMethodArgs).substring(2); // eslint-disable-line
        assembleTxObject.data = '' + assembleTxObject.data + constructBytecode;
      }

      return query.sendTransaction(assembleTxObject, newMethodCallback);
    };

    return output;
  };
}

function EthContract(query) {
  return contractFactory(query);
}

module.exports = EthContract;
},{"ethjs-abi":12,"ethjs-filter":15,"ethjs-util":21,"js-sha3":26}],15:[function(require,module,exports){
'use strict';

function constructFilter(filterName, query) {
  function Filter(options) {
    var self = this;
    self.filterId = null;
    self.options = Object.assign({
      delay: 300,
      decoder: function decodeData(data) {
        return data;
      },
      defaultFilterObject: {}
    }, options || {});

    self.watchers = {};
    self.interval = setInterval(function () {
      if (self.filterId !== null && Object.keys(self.watchers).length > 0) {
        query.getFilterChanges(self.filterId, function (changeError, changeResult) {
          var decodedChangeResults = [];
          var decodingError = null; // eslint-disable-line

          if (!changeError) {
            try {
              changeResult.forEach(function (log, logIndex) {
                decodedChangeResults[logIndex] = changeResult[logIndex];
                decodedChangeResults[logIndex].data = self.options.decoder(decodedChangeResults[logIndex].data);
              });
            } catch (decodingErrorMesage) {
              decodingError = new Error('[ethjs-filter] while decoding filter change event data from RPC \'' + JSON.stringify(decodedChangeResults) + '\': ' + decodingErrorMesage);
            }
          }

          Object.keys(self.watchers).forEach(function (id) {
            var watcher = self.watchers[id];
            if (watcher.stop === true) {
              delete self.watchers[id];
              return;
            }

            if (decodingError) {
              watcher.reject(decodingError);
              watcher.callback(decodingError, null);
            } else {
              if (changeError) {
                watcher.reject(changeError);
              } else if (Array.isArray(decodedChangeResults) && changeResult.length > 0) {
                watcher.resolve(decodedChangeResults);
              }

              watcher.callback(changeError, decodedChangeResults);
            }
          });
        });
      }
    }, self.options.delay);
  }

  Filter.prototype.at = function atFilter(filterId) {
    var self = this;
    self.filterId = filterId;
  };

  Filter.prototype.watch = function watchFilter(watchCallbackInput) {
    var callback = watchCallbackInput || function () {}; // eslint-disable-line
    var self = this;
    var id = Math.random().toString(36).substring(7);
    var output = new Promise(function (resolve, reject) {
      self.watchers[id] = { resolve: resolve, reject: reject, callback: callback, stop: false };
    });

    output.stopWatching = function stopWatching() {
      self.watchers[id].stop = true;
    };

    return output;
  };

  Filter.prototype.uninstall = function uninstallFilter(cb) {
    var self = this;
    var callback = cb || function emptyCallback() {};
    self.watchers = Object.assign({});
    clearInterval(self.interval);

    return new Promise(function (resolve, reject) {
      query.uninstallFilter(self.filterId, function (uninstallError, uninstallResilt) {
        if (uninstallError) {
          reject(uninstallError);
        } else {
          resolve(uninstallResilt);
        }

        callback(uninstallError, uninstallResilt);
      });
    });
  };

  Filter.prototype['new'] = function newFilter() {
    var callback = function callback() {}; // eslint-disable-line
    var self = this;
    var filterInputs = [];
    var args = [].slice.call(arguments); // eslint-disable-line
    // pop callback if provided
    if (typeof args[args.length - 1] === 'function') {
      callback = args.pop();
    }

    // if a param object was presented, push that into the inputs
    if (filterName === 'Filter') {
      filterInputs.push(Object.assign(self.options.defaultFilterObject, args[args.length - 1] || {}));
    }

    return new Promise(function (resolve, reject) {
      // add complex callback
      filterInputs.push(function (setupError, filterId) {
        if (!setupError) {
          self.filterId = filterId;
          resolve(filterId);
        } else {
          reject(setupError);
        }

        callback(setupError, filterId);
      });

      // apply filter, call new.. filter method
      query['new' + filterName].apply(query, filterInputs);
    });
  };

  return Filter;
}

/**
 * EthFilter constructor, intakes a query, helps manage filter event polling
 *
 * @method EthFilter
 * @param {Object} query the `ethjs-query` or `eth-query` object
 * @returns {Object} output an EthFilter instance
 * @throws error if new is not used
 */

function EthFilter(query) {
  var self = this;
  if (!(self instanceof EthFilter)) {
    throw new Error('the EthFilter object must be instantiated with `new` flag.. (e.g. `const filters = new EthFilter(query);`)');
  }
  if (typeof query !== 'object') {
    throw new Error('the EthFilter object must be instantiated with an EthQuery instance (e.g. `const filters = new EthFilter(new EthQuery(provider));`). See github.com/ethjs/ethjs-query for more details..');
  }

  self.Filter = constructFilter('Filter', query);
  self.BlockFilter = constructFilter('BlockFilter', query);
  self.PendingTransactionFilter = constructFilter('PendingTransactionFilter', query);
}

// export EthFilter
module.exports = EthFilter;
},{}],16:[function(require,module,exports){
'use strict';

var schema = require('ethjs-schema');
var util = require('ethjs-util');
var numberToBN = require('number-to-bn');
var stripHexPrefix = require('strip-hex-prefix');
var padToEven = util.padToEven;
var arrayContainsArray = util.arrayContainsArray;
var getBinarySize = util.getBinarySize;

/**
 * Format quantity values, either encode to hex or decode to BigNumber
 * should intake null, stringNumber, number, BN
 *
 * @method formatQuantity
 * @param {String|BigNumber|Number} value quantity or tag to convert
 * @param {Boolean} encode to hex or decode to BigNumber
 * @returns {Optional} output to BigNumber or string
 * @throws error if value is a float
 */
function formatQuantity(value, encode) {
  if (['string', 'number', 'object'].indexOf(typeof value) === -1 || value === null) {
    return value;
  }

  var numberValue = numberToBN(value);

  if (numberToBN(value).isNeg()) {
    throw new Error('[ethjs-format] while formatting quantity \'' + numberValue.toString(10) + '\', invalid negative number. Number must be positive or zero.');
  }

  return encode ? '0x' + numberValue.toString(16) : numberValue;
}

/**
 * Format quantity or tag, if tag bypass return, else format quantity
 * should intake null, stringNumber, number, BN, string tag
 *
 * @method formatQuantityOrTag
 * @param {String|BigNumber|Number} value quantity or tag to convert
 * @param {Boolean} encode encode the number to hex or decode to BigNumber
 * @returns {Object|String} output to BigNumber or string
 * @throws error if value is a float
 */
function formatQuantityOrTag(value, encode) {
  var output = value; // eslint-disable-line

  // if the value is a tag, bypass
  if (schema.tags.indexOf(value) === -1) {
    output = formatQuantity(value, encode);
  }

  return output;
}

/**
 * FormatData under strict conditions hex prefix
 *
 * @method formatData
 * @param {String} value the bytes data to be formatted
 * @param {Number} byteLength the required byte length (usually 20 or 32)
 * @returns {String} output output formatted data
 * @throws error if minimum length isnt met
 */
function formatData(value, byteLength) {
  var output = value; // eslint-disable-line
  var outputByteLength = 0; // eslint-disable-line

  // prefix only under strict conditions, else bypass
  if (typeof value === 'string') {
    output = '0x' + padToEven(stripHexPrefix(value));
    outputByteLength = getBinarySize(output);
  }

  // throw if bytelength is not correct
  if (typeof byteLength === 'number' && value !== null && output !== '0x' // support empty values
  && (!/^[0-9A-Fa-f]+$/.test(stripHexPrefix(output)) || outputByteLength !== 2 + byteLength * 2)) {
    throw new Error('[ethjs-format] hex string \'' + output + '\' must be an alphanumeric ' + (2 + byteLength * 2) + ' utf8 byte hex (chars: a-fA-F) string, is ' + outputByteLength + ' bytes');
  }

  return output;
}

/**
 * Format object, even with random RPC caviets
 *
 * @method formatObject
 * @param {String|Array} formatter the unit to convert to, default ether
 * @param {Object} value the object value
 * @param {Boolean} encode encode to hex or decode to BigNumber
 * @returns {Object} output object
 * @throws error if value is a float
 */
function formatObject(formatter, value, encode) {
  var output = Object.assign({}, value); // eslint-disable-line
  var formatObject = null; // eslint-disable-line

  // if the object is a string flag, then retreive the object
  if (typeof formatter === 'string') {
    if (formatter === 'Boolean|EthSyncing') {
      formatObject = Object.assign({}, schema.objects.EthSyncing);
    } else if (formatter === 'DATA|Transaction') {
      formatObject = Object.assign({}, schema.objects.Transaction);
    } else {
      formatObject = Object.assign({}, schema.objects[formatter]);
    }
  }

  // check if all required data keys are fulfilled
  if (!arrayContainsArray(Object.keys(value), formatObject.__required)) {
    // eslint-disable-line
    throw new Error('[ethjs-format] object ' + JSON.stringify(value) + ' must contain properties: ' + formatObject.__required.join(', ')); // eslint-disable-line
  }

  // assume formatObject is an object, go through keys and format each
  Object.keys(formatObject).forEach(function (valueKey) {
    if (valueKey !== '__required' && typeof value[valueKey] !== 'undefined') {
      output[valueKey] = format(formatObject[valueKey], value[valueKey], encode);
    }
  });

  return output;
}

/**
 * Format array
 *
 * @method formatArray
 * @param {String|Array} formatter the unit to convert to, default ether
 * @param {Object} value the value in question
 * @param {Boolean} encode encode to hex or decode to BigNumber
 * @param {Number} lengthRequirement the required minimum array length
 * @returns {Object} output object
 * @throws error if minimum length isnt met
 */
function formatArray(formatter, value, encode, lengthRequirement) {
  var output = value.slice(); // eslint-disable-line
  var formatObject = formatter; // eslint-disable-line

  // if the formatter is an array or data, then make format object an array data
  if (formatter === 'Array|DATA') {
    formatObject = ['D'];
  }

  // if formatter is a FilterChange and acts like a BlockFilter
  // or PendingTx change format object to tx hash array
  if (formatter === 'FilterChange' && typeof value[0] === 'string') {
    formatObject = ['D32'];
  }

  // enforce minimum value length requirements
  if (encode === true && typeof lengthRequirement === 'number' && value.length < lengthRequirement) {
    throw new Error('array ' + JSON.stringify(value) + ' must contain at least ' + lengthRequirement + ' params, but only contains ' + value.length + '.'); // eslint-disable-line
  }

  // make new array, avoid mutation
  formatObject = formatObject.slice();

  // assume formatObject is an object, go through keys and format each
  value.forEach(function (valueKey, valueIndex) {
    // use key zero as formatter for all values, unless otherwise specified
    var formatObjectKey = 0; // eslint-disable-line

    // if format array is exact, check each argument against formatter argument
    if (formatObject.length > 1) {
      formatObjectKey = valueIndex;
    }

    output[valueIndex] = format(formatObject[formatObjectKey], valueKey, encode);
  });

  return output;
}

/**
 * Format various kinds of data to RPC spec or into digestable JS objects
 *
 * @method format
 * @param {String|Array} formatter the data formatter
 * @param {String|Array|Object|Null|Number} value the data value input
 * @param {Boolean} encode encode to hex or decode to BigNumbers, Strings, Booleans, Null
 * @param {Number} lengthRequirement the minimum data length requirement
 * @throws error if minimum length isnt met
 */
function format(formatter, value, encode, lengthRequirement) {
  var output = value; // eslint-disable-line

  // if formatter is quantity or quantity or tag
  if (formatter === 'Q') {
    output = formatQuantity(value, encode);
  } else if (formatter === 'Q|T') {
    output = formatQuantityOrTag(value, encode);
  } else if (formatter === 'D') {
    output = formatData(value); // dont format data flagged objects like compiler output
  } else if (formatter === 'D20') {
    output = formatData(value, 20); // dont format data flagged objects like compiler output
  } else if (formatter === 'D32') {
    output = formatData(value, 32); // dont format data flagged objects like compiler output
  } else {
    // if value is an object or array
    if (typeof value === 'object' && value !== null && Array.isArray(value) === false) {
      output = formatObject(formatter, value, encode);
    } else if (Array.isArray(value)) {
      output = formatArray(formatter, value, encode, lengthRequirement);
    }
  }

  return output;
}

/**
 * Format RPC inputs generally to the node or TestRPC
 *
 * @method formatInputs
 * @param {Object} method the data formatter
 * @param {Array} inputs the data inputs
 * @returns {Array} output the formatted inputs array
 * @throws error if minimum length isnt met
 */
function formatInputs(method, inputs) {
  return format(schema.methods[method][0], inputs, true, schema.methods[method][2]);
}

/**
 * Format RPC outputs generally from the node or TestRPC
 *
 * @method formatOutputs
 * @param {Object} method the data formatter
 * @param {Array|String|Null|Boolean|Object} outputs the data inputs
 * @returns {Array|String|Null|Boolean|Object} output the formatted data
 */
function formatOutputs(method, outputs) {
  return format(schema.methods[method][1], outputs, false);
}

// export formatters
module.exports = {
  schema: schema,
  formatQuantity: formatQuantity,
  formatQuantityOrTag: formatQuantityOrTag,
  formatObject: formatObject,
  formatArray: formatArray,
  format: format,
  formatInputs: formatInputs,
  formatOutputs: formatOutputs
};
},{"ethjs-schema":20,"ethjs-util":21,"number-to-bn":27,"strip-hex-prefix":30}],17:[function(require,module,exports){
'use strict';

/**
 * @original-authors:
 *   Marek Kotewicz <marek@ethdev.com>
 *   Marian Oancea <marian@ethdev.com>
 *   Fabian Vogelsteller <fabian@ethdev.com>
 * @date 2015
 */

// workaround to use httpprovider in different envs
var XHR2 = require('xhr2');

/*
""
responseText
:
""
responseType
:
""
responseURL
:
"https://ropsten.infura.io/"
responseXML
:
null
status
:
405
statusText
:
"Method Not Allowed"
timeout
:
0
*/

/**
 * InvalidResponseError helper for invalid errors.
 */
function invalidResponseError(request, host) {
  var responseError = new Error('[ethjs-provider-http] Invalid JSON RPC response from provider\n    host: ' + host + '\n    response: ' + String(request.responseText) + ' ' + JSON.stringify(request.responseText, null, 2) + '\n    responseURL: ' + request.responseURL + '\n    status: ' + request.status + '\n    statusText: ' + request.statusText + '\n  ');
  responseError.value = request;
  return responseError;
}

/**
 * HttpProvider should be used to send rpc calls over http
 */
function HttpProvider(host, timeout) {
  if (!(this instanceof HttpProvider)) {
    throw new Error('[ethjs-provider-http] the HttpProvider instance requires the "new" flag in order to function normally (e.g. `const eth = new Eth(new HttpProvider());`).');
  }
  if (typeof host !== 'string') {
    throw new Error('[ethjs-provider-http] the HttpProvider instance requires that the host be specified (e.g. `new HttpProvider("http://localhost:8545")` or via service like infura `new HttpProvider("http://ropsten.infura.io")`)');
  }

  var self = this;
  self.host = host;
  self.timeout = timeout || 0;
}

/**
 * Should be used to make async request
 *
 * @method sendAsync
 * @param {Object} payload
 * @param {Function} callback triggered on end with (err, result)
 */
HttpProvider.prototype.sendAsync = function (payload, callback) {
  // eslint-disable-line
  var self = this;
  var request = new XHR2(); // eslint-disable-line

  request.timeout = self.timeout;
  request.open('POST', self.host, true);
  request.setRequestHeader('Content-Type', 'application/json');

  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.timeout !== 1) {
      var result = request.responseText; // eslint-disable-line
      var error = null; // eslint-disable-line

      try {
        result = JSON.parse(result);
      } catch (jsonError) {
        error = invalidResponseError(request, self.host);
      }

      callback(error, result);
    }
  };

  request.ontimeout = function () {
    callback('[ethjs-provider-http] CONNECTION TIMEOUT: http request timeout after ' + self.timeout + ' ms. (i.e. your connect has timed out for whatever reason, check your provider).', null);
  };

  try {
    request.send(JSON.stringify(payload));
  } catch (error) {
    callback('[ethjs-provider-http] CONNECTION ERROR: Couldn\'t connect to node \'' + self.host + '\': ' + JSON.stringify(error, null, 2), null);
  }
};

module.exports = HttpProvider;
},{"xhr2":31}],18:[function(require,module,exports){
'use strict';

var format = require('ethjs-format');
var EthRPC = require('ethjs-rpc');

module.exports = Eth;

function Eth(provider, options) {
  var self = this;
  var optionsObject = options || {};

  if (!(this instanceof Eth)) {
    throw new Error('[ethjs-query] the Eth object requires the "new" flag in order to function normally (i.e. `const eth = new Eth(provider);`).');
  }
  if (typeof provider !== 'object') {
    throw new Error('[ethjs-query] the Eth object requires that the first input \'provider\' must be an object, got \'' + typeof provider + '\' (i.e. \'const eth = new Eth(provider);\')');
  }

  self.options = Object.assign({
    debug: optionsObject.debug || false,
    logger: optionsObject.logger || console,
    jsonSpace: optionsObject.jsonSpace || 0
  });
  self.rpc = new EthRPC(provider);
  self.setProvider = self.rpc.setProvider;
}

Eth.prototype.log = function log(message) {
  var self = this;
  if (self.options.debug) self.options.logger.log('[ethjs-query log] ' + message);
};

Object.keys(format.schema.methods).forEach(function (rpcMethodName) {
  Object.defineProperty(Eth.prototype, rpcMethodName.replace('eth_', ''), {
    enumerable: true,
    value: generateFnFor(rpcMethodName, format.schema.methods[rpcMethodName])
  });
});

function generateFnFor(method, methodObject) {
  return function outputMethod() {
    var protoCallback = function protoCallback() {}; // eslint-disable-line
    var inputs = null; // eslint-disable-line
    var inputError = null; // eslint-disable-line
    var self = this;
    var args = [].slice.call(arguments); // eslint-disable-line
    var protoMethod = method.replace('eth_', ''); // eslint-disable-line

    if (args.length > 0 && typeof args[args.length - 1] === 'function') {
      protoCallback = args.pop();
    }

    return new Promise(function (resolve, reject) {
      var cb = function cb(callbackError, callbackResult) {
        if (callbackError) {
          reject(callbackError);
          protoCallback(callbackError, null);
        } else {
          try {
            self.log('attempting method formatting for \'' + protoMethod + '\' with raw outputs: ' + JSON.stringify(callbackResult, null, self.options.jsonSpace));
            var methodOutputs = format.formatOutputs(method, callbackResult);
            self.log('method formatting success for \'' + protoMethod + '\' formatted result: ' + JSON.stringify(methodOutputs, null, self.options.jsonSpace));

            resolve(methodOutputs);
            protoCallback(null, methodOutputs);
          } catch (outputFormattingError) {
            var outputError = new Error('[ethjs-query] while formatting outputs from RPC \'' + JSON.stringify(callbackResult, null, self.options.jsonSpace) + '\' for method \'' + protoMethod + '\' ' + outputFormattingError);

            reject(outputError);
            protoCallback(outputError, null);
          }
        }
      };

      if (args.length < methodObject[2]) {
        return cb(new Error('[ethjs-query] method \'' + protoMethod + '\' requires at least ' + methodObject[2] + ' input (format type ' + methodObject[0][0] + '), ' + args.length + ' provided. For more information visit: https://github.com/ethereum/wiki/wiki/JSON-RPC#' + method.toLowerCase()));
      }

      if (args.length > methodObject[0].length) {
        return cb(new Error('[ethjs-query] method \'' + protoMethod + '\' requires at most ' + methodObject[0].length + ' params, ' + args.length + ' provided \'' + JSON.stringify(args, null, self.options.jsonSpace) + '\'. For more information visit: https://github.com/ethereum/wiki/wiki/JSON-RPC#' + method.toLowerCase()));
      }

      if (methodObject[3] && args.length < methodObject[3]) {
        args.push('latest');
      }

      self.log('attempting method formatting for \'' + protoMethod + '\' with inputs ' + JSON.stringify(args, null, self.options.jsonSpace));

      try {
        inputs = format.formatInputs(method, args);
        self.log('method formatting success for \'' + protoMethod + '\' with formatted result: ' + JSON.stringify(inputs, null, self.options.jsonSpace));
      } catch (formattingError) {
        return cb(new Error('[ethjs-query] while formatting inputs \'' + JSON.stringify(args, null, self.options.jsonSpace) + '\' for method \'' + protoMethod + '\' error: ' + formattingError));
      }

      return self.rpc.sendAsync({ method: method, params: inputs }, cb);
    });
  };
}
},{"ethjs-format":16,"ethjs-rpc":19}],19:[function(require,module,exports){
'use strict';

module.exports = EthRPC;

/**
 * Constructs the EthRPC instance
 *
 * @method EthRPC
 * @param {Object} cprovider the eth rpc provider web3 standard..
 * @param {Object} options the options, if any
 * @returns {Object} ethrpc instance
 */
function EthRPC(cprovider, options) {
  var self = this;
  var optionsObject = options || {};

  if (!(this instanceof EthRPC)) {
    throw new Error('[ethjs-rpc] the EthRPC object requires the "new" flag in order to function normally (i.e. `const eth = new EthRPC(provider);`).');
  }

  self.options = Object.assign({
    jsonSpace: optionsObject.jsonSpace || 0,
    max: optionsObject.max || 9999999999999
  });
  self.idCounter = Math.floor(Math.random() * self.options.max);
  self.setProvider = function (provider) {
    if (typeof provider !== 'object') {
      throw new Error('[ethjs-rpc] the EthRPC object requires that the first input \'provider\' must be an object, got \'' + typeof provider + '\' (i.e. \'const eth = new EthRPC(provider);\')');
    }

    self.currentProvider = provider;
  };
  self.setProvider(cprovider);
}

/**
 * The main send async method
 *
 * @method sendAsync
 * @param {Object} payload the rpc payload object
 * @param {Function} cb the async standard callback
 * @callback {Object|Array|Boolean|String} vary result instance output
 */
EthRPC.prototype.sendAsync = function sendAsync(payload, cb) {
  var self = this;
  self.idCounter = self.idCounter % self.options.max;
  var parsedPayload = createPayload(payload, self.idCounter++);
  self.currentProvider.sendAsync(parsedPayload, function (err, response) {
    var responseObject = response || {};

    if (err || responseObject.error) {
      var payloadErrorMessage = '[ethjs-rpc] ' + (responseObject.error && 'rpc' || '') + ' error with payload ' + JSON.stringify(parsedPayload, null, self.options.jsonSpace) + ' ' + (String(err) || JSON.stringify(responseObject.error, null, self.options.jsonSpace));
      var payloadError = new Error(payloadErrorMessage);
      payloadError.value = err || responseObject.error;
      return cb(payloadError, null);
    }

    return cb(null, responseObject.result);
  });
};

/**
 * A simple create payload method
 *
 * @method createPayload
 * @param {Object} data the rpc payload data
 * @param {String} id the rpc data payload ID
 * @returns {Object} payload the completed payload object
 */
function createPayload(data, id) {
  return Object.assign({}, {
    id: id,
    jsonrpc: '2.0',
    params: []
  }, data);
}
},{}],20:[function(require,module,exports){
module.exports={
  "methods": {
    "web3_clientVersion": [[], "S"],
    "web3_sha3": [["S"], "D", 1],
    "net_version": [[], "S"],
    "net_peerCount": [[], "Q"],
    "net_listening": [[], "B"],
    "personal_sign": [["D20", "D", "S"], "D", 2],
    "personal_ecRecover": [["D", "D"], "D20", 2],
    "eth_protocolVersion": [[], "S"],
    "eth_syncing": [[], "Boolean|EthSyncing"],
    "eth_coinbase": [[], "D20"],
    "eth_mining": [[], "B"],
    "eth_hashrate": [[], "Q"],
    "eth_gasPrice": [[], "Q"],
    "eth_accounts": [[], ["D20"]],
    "eth_blockNumber": [[], "Q"],
    "eth_getBalance": [["D20", "Q|T"], "Q", 1, 2],
    "eth_getStorageAt": [["D20", "Q", "Q|T"], "D", 2, 2],
    "eth_getTransactionCount": [["D20", "Q|T"], "Q", 1, 2],
    "eth_getBlockTransactionCountByHash": [["D32"], "Q", 1],
    "eth_getBlockTransactionCountByNumber": [["Q|T"], "Q", 1],
    "eth_getUncleCountByBlockHash": [["D32"], "Q", 1],
    "eth_getUncleCountByBlockNumber": [["Q"], "Q", 1],
    "eth_getCode": [["D20", "Q|T"], "D", 1, 2],
    "eth_sign": [["D20", "D32"], "D", 2],
    "eth_sendTransaction": [["SendTransaction"], "D", 1],
    "eth_sendRawTransaction": [["D"], "D32", 1],
    "eth_call": [["CallTransaction", "Q|T"], "D", 1, 2],
    "eth_estimateGas": [["EstimateTransaction", "Q|T"], "Q", 1],
    "eth_getBlockByHash": [["D32", "B"], "Block", 2],
    "eth_getBlockByNumber": [["Q|T", "B"], "Block", 2],
    "eth_getTransactionByHash": [["D32"], "Transaction", 1],
    "eth_getTransactionByBlockHashAndIndex": [["D32", "Q"], "Transaction", 2],
    "eth_getTransactionByBlockNumberAndIndex": [["Q|T", "Q"], "Transaction", 2],
    "eth_getTransactionReceipt": [["D32"], "Receipt", 1],
    "eth_getUncleByBlockHashAndIndex": [["D32", "Q"], "Block", 1],
    "eth_getUncleByBlockNumberAndIndex": [["Q|T", "Q"], "Block", 2],
    "eth_getCompilers": [[], ["S"]],
    "eth_compileLLL": [["S"], "D", 1],
    "eth_compileSolidity": [["S"], "D", 1],
    "eth_compileSerpent": [["S"], "D", 1],
    "eth_newFilter": [["Filter"], "Q", 1],
    "eth_newBlockFilter": [[], "Q"],
    "eth_newPendingTransactionFilter": [[], "Q"],
    "eth_uninstallFilter": [["Q"], "B", 1],
    "eth_getFilterChanges": [["Q"], ["FilterChange"], 1],
    "eth_getFilterLogs": [["Q"], ["FilterChange"], 1],
    "eth_getLogs": [["Filter"], ["FilterChange"], 1],
    "eth_getWork": [[], ["D"]],
    "eth_submitWork": [["D", "D32", "D32"], "B", 3],
    "eth_submitHashrate": [["D", "D"], "B", 2],
    "db_putString": [["S", "S", "S"], "B", 2],
    "db_getString": [["S", "S"], "S", 2],
    "db_putHex": [["S", "S", "D"], "B", 2],
    "db_getHex": [["S", "S"], "D", 2],
    "shh_post": [["SHHPost"], "B", 1],
    "shh_version": [[], "S"],
    "shh_newIdentity": [[], "D"],
    "shh_hasIdentity": [["D"], "B"],
    "shh_newGroup": [[], "D"],
    "shh_addToGroup": [["D"], "B", 1],
    "shh_newFilter": [["SHHFilter"], "Q", 1],
    "shh_uninstallFilter": [["Q"], "B", 1],
    "shh_getFilterChanges": [["Q"], ["SHHFilterChange"], 1],
    "shh_getMessages": [["Q"], ["SHHFilterChange"], 1]
  },
  "tags": ["latest", "earliest", "pending"],
  "objects": {
    "EthSyncing": {
      "__required": [],
      "startingBlock": "Q",
      "currentBlock": "Q",
      "highestBlock": "Q"
    },
    "SendTransaction": {
      "__required": ["from", "data"],
      "from": "D20",
      "to": "D20",
      "gas": "Q",
      "gasPrice": "Q",
      "value": "Q",
      "data": "D",
      "nonce": "Q"
    },
    "EstimateTransaction": {
      "__required": [],
      "from": "D20",
      "to": "D20",
      "gas": "Q",
      "gasPrice": "Q",
      "value": "Q",
      "data": "D",
      "nonce": "Q"
    },
    "CallTransaction": {
      "__required": ["to"],
      "from": "D20",
      "to": "D20",
      "gas": "Q",
      "gasPrice": "Q",
      "value": "Q",
      "data": "D",
      "nonce": "Q"
    },
    "Block": {
      "__required": [],
      "number": "Q",
      "hash": "D32",
      "parentHash": "D32",
      "nonce": "D",
      "sha3Uncles": "D",
      "logsBloom": "D",
      "transactionsRoot": "D",
      "stateRoot": "D",
      "receiptsRoot": "D",
      "miner": "D",
      "difficulty": "Q",
      "totalDifficulty": "Q",
      "extraData": "D",
      "size": "Q",
      "gasLimit": "Q",
      "gasUsed": "Q",
      "timestamp": "Q",
      "transactions": ["DATA|Transaction"],
      "uncles": ["D"]
    },
    "Transaction": {
      "__required": [],
      "hash": "D32",
      "nonce": "Q",
      "blockHash": "D32",
      "blockNumber": "Q",
      "transactionIndex": "Q",
      "from": "D20",
      "to": "D20",
      "value": "Q",
      "gasPrice": "Q",
      "gas": "Q",
      "input": "D"
    },
    "Receipt": {
      "__required": [],
      "transactionHash": "D32",
      "transactionIndex": "Q",
      "blockHash": "D32",
      "blockNumber": "Q",
      "cumulativeGasUsed": "Q",
      "gasUsed": "Q",
      "contractAddress": "D20",
      "logs": ["FilterChange"]
    },
    "Filter": {
      "__required": [],
      "fromBlock": "Q|T",
      "toBlock": "Q|T",
      "address": "Array|Data",
      "topics": ["D"]
    },
    "FilterChange": {
      "__required": [],
      "removed": "B",
      "logIndex": "Q",
      "transactionIndex": "Q",
      "transactionHash": "D32",
      "blockHash": "D32",
      "blockNumber": "Q",
      "address": "D20",
      "data": "Array|DATA",
      "topics": ["D"]
    },
    "SHHPost": {
      "__required": ["topics", "payload", "priority", "ttl"],
      "from": "D",
      "to": "D",
      "topics": ["D"],
      "payload": "D",
      "priority": "Q",
      "ttl": "Q"
    },
    "SHHFilter": {
      "__required": ["topics"],
      "to": "D",
      "topics": ["D"]
    },
    "SHHFilterChange": {
      "__required": [],
      "hash": "D",
      "from": "D",
      "to": "D",
      "expiry": "Q",
      "ttl": "Q",
      "sent": "Q",
      "topics": ["D"],
      "payload": "D",
      "workProved": "Q"
    },
    "SHHMessage": {
      "__required": [],
      "hash": "D",
      "from": "D",
      "to": "D",
      "expiry": "Q",
      "ttl": "Q",
      "sent": "Q",
      "topics": ["D"],
      "payload": "D",
      "workProved": "Q"
    }
  }
}

},{}],21:[function(require,module,exports){
(function (Buffer){
'use strict';

var isHexPrefixed = require('is-hex-prefixed');
var stripHexPrefix = require('strip-hex-prefix');

/**
 * Pads a `String` to have an even length
 * @param {String} value
 * @return {String} output
 */
function padToEven(value) {
  var a = value; // eslint-disable-line

  if (typeof a !== 'string') {
    throw new Error('[ethjs-util] while padding to even, value must be string, is currently ' + typeof a + ', while padToEven.');
  }

  if (a.length % 2) {
    a = '0' + a;
  }

  return a;
}

/**
 * Converts a `Number` into a hex `String`
 * @param {Number} i
 * @return {String}
 */
function intToHex(i) {
  var hex = i.toString(16); // eslint-disable-line

  return '0x' + padToEven(hex);
}

/**
 * Converts an `Number` to a `Buffer`
 * @param {Number} i
 * @return {Buffer}
 */
function intToBuffer(i) {
  var hex = intToHex(i);

  return Buffer.from(hex.slice(2), 'hex');
}

/**
 * Get the binary size of a string
 * @param {String} str
 * @return {Number}
 */
function getBinarySize(str) {
  if (typeof str !== 'string') {
    throw new Error('[ethjs-util] while getting binary size, method getBinarySize requires input \'str\' to be type String, got \'' + typeof str + '\'.');
  }

  return Buffer.byteLength(str, 'utf8');
}

/**
 * Returns TRUE if the first specified array contains all elements
 * from the second one. FALSE otherwise.
 *
 * @param {array} superset
 * @param {array} subset
 *
 * @returns {boolean}
 */
function arrayContainsArray(superset, subset, some) {
  if (Array.isArray(superset) !== true) {
    throw new Error('[ethjs-util] method arrayContainsArray requires input \'superset\' to be an array got type \'' + typeof superset + '\'');
  }
  if (Array.isArray(subset) !== true) {
    throw new Error('[ethjs-util] method arrayContainsArray requires input \'subset\' to be an array got type \'' + typeof subset + '\'');
  }

  return subset[Boolean(some) && 'some' || 'every'](function (value) {
    return superset.indexOf(value) >= 0;
  });
}

/**
 * Should be called to get utf8 from it's hex representation
 *
 * @method toUtf8
 * @param {String} string in hex
 * @returns {String} ascii string representation of hex value
 */
function toUtf8(hex) {
  var bufferValue = new Buffer(padToEven(stripHexPrefix(hex).replace(/^0+|0+$/g, '')), 'hex');

  return bufferValue.toString('utf8');
}

/**
 * Should be called to get ascii from it's hex representation
 *
 * @method toAscii
 * @param {String} string in hex
 * @returns {String} ascii string representation of hex value
 */
function toAscii(hex) {
  var str = ''; // eslint-disable-line
  var i = 0,
      l = hex.length; // eslint-disable-line

  if (hex.substring(0, 2) === '0x') {
    i = 2;
  }

  for (; i < l; i += 2) {
    var code = parseInt(hex.substr(i, 2), 16);
    str += String.fromCharCode(code);
  }

  return str;
}

/**
 * Should be called to get hex representation (prefixed by 0x) of utf8 string
 *
 * @method fromUtf8
 * @param {String} string
 * @param {Number} optional padding
 * @returns {String} hex representation of input string
 */
function fromUtf8(stringValue) {
  var str = new Buffer(stringValue, 'utf8');

  return '0x' + padToEven(str.toString('hex')).replace(/^0+|0+$/g, '');
}

/**
 * Should be called to get hex representation (prefixed by 0x) of ascii string
 *
 * @method fromAscii
 * @param {String} string
 * @param {Number} optional padding
 * @returns {String} hex representation of input string
 */
function fromAscii(stringValue) {
  var hex = ''; // eslint-disable-line
  for (var i = 0; i < stringValue.length; i++) {
    // eslint-disable-line
    var code = stringValue.charCodeAt(i);
    var n = code.toString(16);
    hex += n.length < 2 ? '0' + n : n;
  }

  return '0x' + hex;
}

/**
 * getKeys([{a: 1, b: 2}, {a: 3, b: 4}], 'a') => [1, 3]
 *
 * @method getKeys get specific key from inner object array of objects
 * @param {String} params
 * @param {String} key
 * @param {Boolean} allowEmpty
 * @returns {Array} output just a simple array of output keys
 */
function getKeys(params, key, allowEmpty) {
  if (!Array.isArray(params)) {
    throw new Error('[ethjs-util] method getKeys expecting type Array as \'params\' input, got \'' + typeof params + '\'');
  }
  if (typeof key !== 'string') {
    throw new Error('[ethjs-util] method getKeys expecting type String for input \'key\' got \'' + typeof key + '\'.');
  }

  var result = []; // eslint-disable-line

  for (var i = 0; i < params.length; i++) {
    // eslint-disable-line
    var value = params[i][key]; // eslint-disable-line
    if (allowEmpty && !value) {
      value = '';
    } else if (typeof value !== 'string') {
      throw new Error('invalid abi');
    }
    result.push(value);
  }

  return result;
}

/**
 * Is the string a hex string.
 *
 * @method check if string is hex string of specific length
 * @param {String} value
 * @param {Number} length
 * @returns {Boolean} output the string is a hex string
 */
function isHexString(value, length) {
  if (typeof value !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }

  if (length && value.length !== 2 + 2 * length) {
    return false;
  }

  return true;
}

module.exports = {
  arrayContainsArray: arrayContainsArray,
  intToBuffer: intToBuffer,
  getBinarySize: getBinarySize,
  isHexPrefixed: isHexPrefixed,
  stripHexPrefix: stripHexPrefix,
  padToEven: padToEven,
  intToHex: intToHex,
  fromAscii: fromAscii,
  fromUtf8: fromUtf8,
  toAscii: toAscii,
  toUtf8: toUtf8,
  getKeys: getKeys,
  isHexString: isHexString
};
}).call(this,require("buffer").Buffer)
},{"buffer":8,"is-hex-prefixed":25,"strip-hex-prefix":30}],22:[function(require,module,exports){
/* This file is generated from the Unicode IDNA table, using
   the build-unicode-tables.py script. Please edit that
   script instead of this file. */

/* istanbul ignore next */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () { return factory(); });
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.uts46_map = factory();
  }
}(this, function () {
var blocks = [
  new Uint32Array([2157250,2157314,2157378,2157442,2157506,2157570,2157634,0,2157698,2157762,2157826,2157890,2157954,0,2158018,0]),
  new Uint32Array([2179041,6291456,2179073,6291456,2179105,6291456,2179137,6291456,2179169,6291456,2179201,6291456,2179233,6291456,2179265,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,14680064,14680064,14680064,14680064,14680064]),
  new Uint32Array([0,2113729,2197345,2197377,2113825,2197409,2197441,2113921,2197473,2114017,2197505,2197537,2197569,2197601,2197633,2197665]),
  new Uint32Array([6291456,6291456,6291456,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,6291456,23068672,23068672,0,0]),
  new Uint32Array([6291456,6291456,6291456,6291456,0,0,0,0,23068672,23068672,23068672,0,0,0,0,23068672]),
  new Uint32Array([14680064,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,14680064,14680064]),
  new Uint32Array([2196001,2196033,2196065,2196097,2196129,2196161,2196193,2196225,2196257,2196289,2196321,2196353,2196385,2196417,2196449,2196481]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,23068672,6291456,0,0,0,0,0]),
  new Uint32Array([2097281,2105921,2097729,2106081,0,2097601,2162337,2106017,2133281,2097505,2105889,2097185,2097697,2135777,2097633,2097441]),
  new Uint32Array([2177025,6291456,2177057,6291456,2177089,6291456,2177121,6291456,2177153,6291456,2177185,6291456,2177217,6291456,2177249,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,0,6291456,6291456,0,0,0,0,0,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,6291456]),
  new Uint32Array([0,23068672,23068672,23068672,0,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,0,6291456]),
  new Uint32Array([2134435,2134531,2134627,2134723,2134723,2134819,2134819,2134915,2134915,2135011,2105987,2135107,2135203,2135299,2131587,2135395]),
  new Uint32Array([0,0,0,0,0,0,0,6291456,2168673,2169249,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2147906,2147970,2148034,2148098,2148162,2148226,2148290,2148354,2147906,2147970,2148034,2148098,2148162,2148226,2148290,2148354]),
  new Uint32Array([2125219,2125315,2152834,2152898,2125411,2152962,2153026,2125506,2125507,2125603,2153090,2153154,2153218,2153282,2153346,2105348]),
  new Uint32Array([2203393,6291456,2203425,6291456,2203457,6291456,2203489,6291456,6291456,6291456,6291456,2203521,6291456,2181281,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,23068672,23068672,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([6291456,23068672,6291456,2145538,23068672,23068672,23068672,23068672,23068672,23068672,23068672,0,0,0,0,6291456]),
  new Uint32Array([2139426,2160834,2160898,2160962,2134242,2161026,2161090,2161154,2161218,2161282,2161346,2161410,2138658,2161474,2161538,2134722]),
  new Uint32Array([2119939,2124930,2125026,2106658,2125218,2128962,2129058,2129154,2129250,2129346,2129442,2108866,2108770,2150466,2150530,2150594]),
  new Uint32Array([2201601,6291456,2201633,6291456,2201665,6291456,2201697,6291456,2201729,6291456,2201761,6291456,2201793,6291456,2201825,6291456]),
  new Uint32Array([2193537,2193569,2193601,2193633,2193665,2193697,2193729,2193761,2193793,2193825,2193857,2193889,2193921,2193953,2193985,2194017]),
  new Uint32Array([6291456,23068672,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([0,6291456,6291456,0,0,0,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([2190561,6291456,2190593,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,2190625,6291456,2190657,6291456,23068672]),
  new Uint32Array([2215905,2215937,2215969,2216001,2216033,2216065,2216097,2216129,2216161,2216193,2216225,2216257,2105441,2216289,2216321,2216353]),
  new Uint32Array([23068672,18884130,23068672,23068672,23068672,6291456,23068672,23068672,6291456,6291456,6291456,6291456,6291456,23068672,23068672,23068672]),
  new Uint32Array([23068672,23068672,0,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([6291456,6291456,23068672,23068672,0,0,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([2191233,2191265,2191297,2191329,2191361,2191393,2191425,2117377,2191457,2191489,2191521,2191553,2191585,2191617,2191649,2117953]),
  new Uint32Array([2132227,2132323,2132419,2132419,2132515,2132515,2132611,2132707,2132707,2132803,2132899,2132899,2132995,2132995,2133091,2133187]),
  new Uint32Array([0,0,0,0,0,0,0,0,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([23068672,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,23068672,23068672,23068672,6291456,0,0]),
  new Uint32Array([2112481,2112577,2098177,2098305,2108321,2108289,2100865,2113153,2108481,2113345,2113441,10609889,10610785,10609921,10610817,2222241]),
  new Uint32Array([6291456,6291456,6291456,23068672,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,23068672,23068672,0,0]),
  new Uint32Array([2219969,2157121,2157441,2157505,2157889,2157953,2220001,2158465,2158529,10575617,2156994,2157058,2129923,2130019,2157122,2157186]),
  new Uint32Array([6291456,6291456,6291456,6291456,23068672,23068672,23068672,23068672,23068672,23068672,23068672,0,0,0,0,0]),
  new Uint32Array([2185249,6291456,2185281,6291456,2185313,6291456,2185345,6291456,2185377,6291456,2185409,6291456,2185441,6291456,2185473,6291456]),
  new Uint32Array([0,0,0,0,6291456,6291456,6291456,6291456,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([6291456,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,0,0,23068672,23068672,0,0,23068672,23068672,23068672,6291456,0]),
  new Uint32Array([2183361,6291456,2183393,6291456,2183425,6291456,2183457,6291456,2183489,6291456,2183521,6291456,2183553,6291456,2183585,6291456]),
  new Uint32Array([2192161,2192193,2192225,2192257,2192289,2192321,2192353,2192385,2192417,2192449,2192481,2192513,2192545,2192577,2192609,2192641]),
  new Uint32Array([2212001,2212033,2212065,2212097,2212129,2212161,2212193,2212225,2212257,2212289,2212321,2212353,2212385,2212417,2212449,2207265]),
  new Uint32Array([2249825,2249857,2249889,2249921,2249954,2250018,2250082,2250145,2250177,2250209,2250241,2250274,2250337,2250370,2250433,2250465]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,2147905,2147969,2148033,2148097,2148161,2148225,2148289,2148353]),
  new Uint32Array([10485857,6291456,2197217,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,0,23068672,23068672]),
  new Uint32Array([0,23068672,23068672,23068672,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,6291456,6291456]),
  new Uint32Array([2180353,2180385,2144033,2180417,2180449,2180481,2180513,0,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2112481,2112577,2098177,2098305,2108321,2108289,2100865,2113153,2108481,2113345,2113441,10610209,10610465,10610241,10610753,10609857]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,23068672,0,0]),
  new Uint32Array([2223842,2223906,2223970,2224034,2224098,2224162,2224226,2224290,2224354,2224418,2224482,2224546,2224610,2224674,2224738,2224802]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,23068672,23068672,23068672,23068672,6291456,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,6291456]),
  new Uint32Array([23068672,23068672,23068672,18923650,23068672,23068672,23068672,23068672,0,23068672,23068672,23068672,23068672,18923714,23068672,23068672]),
  new Uint32Array([2126179,2125538,2126275,2126371,2126467,2125634,2126563,2105603,2105604,2125346,2126659,2126755,2126851,2098179,2098181,2098182]),
  new Uint32Array([2227426,2227490,2227554,2227618,0,0,0,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2192353,2240642,2240642,2240705,2240737,2240737,2240769,2240802,2240866,2240929,2240961,2240993,2241025,2241057,2241089,2241121]),
  new Uint32Array([6291456,2170881,2170913,2170945,6291456,2170977,6291456,2171009,2171041,6291456,6291456,6291456,2171073,6291456,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([2132226,2132514,2163586,2132610,2160386,2133090,2133186,2160450,2160514,2160578,2133570,2106178,2160642,2133858,2160706,2160770]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,10532162,10532226,10532290,10532354,10532418,10532482,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,6291456,23068672]),
  new Uint32Array([2098209,2108353,2108193,2108481,2170241,2111713,2105473,2105569,2105601,2112289,2112481,2098305,2108321,0,0,0]),
  new Uint32Array([2209121,2209153,2209185,2209217,2209249,2209281,2209313,2209345,2209377,2209409,2209441,2209473,2207265,2209505,2209537,2209569]),
  new Uint32Array([2189025,6291456,2189057,6291456,2189089,6291456,2189121,6291456,2189153,6291456,2189185,6291456,2189217,6291456,2189249,6291456]),
  new Uint32Array([2173825,2153473,2173857,2173889,2173921,2173953,2173985,2173761,2174017,2174049,2174081,2174113,2174145,2174177,2149057,2233057]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,2165764,2140004]),
  new Uint32Array([2215105,6291456,2215137,6291456,6291456,2215169,2215201,6291456,6291456,6291456,2215233,2215265,2215297,2215329,2215361,2215393]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,0,0,6291456,0,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([23068672,23068672,6291456,6291456,6291456,23068672,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([10505091,10505187,10505283,10505379,10505475,10505571,10505667,10505763,10505859,10505955,10506051,10506147,10506243,10506339,10506435,10506531]),
  new Uint32Array([2229730,2229794,2229858,2229922,2229986,2230050,2230114,2230178,2230242,2230306,2230370,2230434,2230498,2230562,2230626,2230690]),
  new Uint32Array([2105505,2098241,2108353,2108417,2105825,0,2100897,2111905,2105473,2105569,2105601,2112289,2108193,2112481,2112577,2098177]),
  new Uint32Array([6291456,6291456,6291456,6291456,10502115,10502178,10502211,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([0,23068672,23068672,23068672,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,6291456]),
  new Uint32Array([2190305,6291456,2190337,6291456,2190369,6291456,2190401,6291456,2190433,6291456,2190465,6291456,2190497,6291456,2190529,6291456]),
  new Uint32Array([2173793,2173985,2174017,6291456,2173761,2173697,6291456,2174689,6291456,2174017,2174721,6291456,6291456,2174753,2174785,2174817]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2099521,2099105,2120705,2098369,2120801,2103361,2097985,2098433,2121377,2121473,2099169,2099873,2098401,2099393,2152609,2100033]),
  new Uint32Array([2132898,2163842,2163906,2133282,2132034,2131938,2137410,2132802,2132706,2164866,2133282,2160578,2165186,2165186,6291456,6291456]),
  new Uint32Array([10500003,10500099,10500195,10500291,10500387,10500483,10500579,10500675,10500771,10500867,10500963,10501059,10501155,10501251,10501347,10501443]),
  new Uint32Array([2163458,2130978,2131074,2131266,2131362,2163522,2160130,2132066,2131010,2131106,2106018,2131618,2131298,2132034,2131938,2137410]),
  new Uint32Array([2212961,2116993,2212993,2213025,2213057,2213089,2213121,2213153,2213185,2213217,2213249,2209633,2213281,2213313,2213345,2213377]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,23068672,6291456,6291456,6291456,6291456,6291456,6291456,0,6291456,6291456]),
  new Uint32Array([2113729,2113825,2113921,2114017,2114113,2114209,2114305,2114401,2114497,2114593,2114689,2114785,2114881,2114977,2115073,2115169]),
  new Uint32Array([2238177,2238209,2238241,2238273,2238305,2238337,2238337,2217537,2238369,2238401,2238433,2238465,2215649,2238497,2238529,2238561]),
  new Uint32Array([2108289,2100865,2113153,2108481,2113345,2113441,2098209,2111137,2105505,2098241,2108353,2108417,2105825,2111713,2100897,2111905]),
  new Uint32Array([6291456,6291456,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,6291456,0,0]),
  new Uint32Array([6291456,0,6291456,2145026,0,6291456,2145090,0,6291456,6291456,0,0,23068672,0,23068672,23068672]),
  new Uint32Array([2099233,2122017,2200673,2098113,2121537,2103201,2200705,2104033,2121857,2121953,2122401,2099649,2099969,2123009,2100129,2100289]),
  new Uint32Array([6291456,23068672,6291456,0,0,0,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([6291456,6291456,23068672,23068672,0,0,23068672,23068672,23068672,23068672,23068672,23068672,23068672,0,0,0]),
  new Uint32Array([2187681,2187713,2187745,2187777,2187809,2187841,2187873,2187905,2187937,2187969,2188001,2188033,2188065,2188097,2188129,2188161]),
  new Uint32Array([0,10554498,10554562,10554626,10554690,10554754,10554818,10554882,10554946,10555010,10555074,6291456,6291456,0,0,0]),
  new Uint32Array([2235170,2235234,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,0,0,0,0]),
  new Uint32Array([2181153,6291456,2188897,6291456,6291456,2188929,6291456,6291456,6291456,6291456,6291456,6291456,2111905,2100865,2188961,2188993]),
  new Uint32Array([2100833,2100897,0,0,2101569,2101697,2101825,2101953,2102081,2102209,10575617,2187041,10502177,10489601,10489697,2112289]),
  new Uint32Array([6291456,2172833,6291456,2172865,2172897,2172929,2172961,6291456,2172993,6291456,2173025,6291456,2173057,6291456,2173089,6291456]),
  new Uint32Array([6291456,0,6291456,6291456,0,6291456,6291456,6291456,6291456,6291456,0,0,23068672,6291456,23068672,23068672]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,0,0,0,0,2190721]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,6291456,6291456,6291456,6291456,23068672,6291456,6291456]),
  new Uint32Array([2184993,6291456,2185025,6291456,2185057,6291456,2185089,6291456,2185121,6291456,2185153,6291456,2185185,6291456,2185217,6291456]),
  new Uint32Array([2115265,2115361,2115457,2115553,2115649,2115745,2115841,2115937,2116033,2116129,2116225,2116321,2150658,2150722,2200225,6291456]),
  new Uint32Array([2168321,6291456,2168353,6291456,2168385,6291456,2168417,6291456,2168449,6291456,2168481,6291456,2168513,6291456,2168545,6291456]),
  new Uint32Array([23068672,23068672,23068672,6291456,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([6291456,0,6291456,6291456,6291456,6291456,0,0,0,6291456,6291456,0,6291456,0,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,2186625,0,0,6291456,6291456,2186657,2186689,2186721,2173505,0,10496067,10496163,10496259]),
  new Uint32Array([2178785,6291456,2178817,6291456,2178849,6291456,2178881,6291456,2178913,6291456,2178945,6291456,2178977,6291456,2179009,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,0,0]),
  new Uint32Array([2097152,0,0,0,2097152,0,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,6291456,6291456]),
  new Uint32Array([6291456,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([0,0,2197857,2197889,2197921,2197953,2197985,2198017,0,0,2198049,2198081,2198113,2198145,2198177,2198209]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,2098209,2167297,2111137,6291456]),
  new Uint32Array([2171393,6291456,2171425,6291456,2171457,6291456,2171489,6291456,2171521,6291456,2171553,6291456,2171585,6291456,2171617,6291456]),
  new Uint32Array([2206753,2206785,2195457,2206817,2206849,2206881,2206913,2197153,2197153,2206945,2117857,2206977,2207009,2207041,2207073,2207105]),
  new Uint32Array([0,0,0,0,0,0,0,23068672,0,0,0,0,2144834,2144898,0,2144962]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,0,0,23068672]),
  new Uint32Array([2108193,2112481,2112577,2098177,2098305,2108321,2108289,2100865,2113153,2108481,2113345,2113441,2098209,0,2105505,2098241]),
  new Uint32Array([6291456,6291456,6291456,6291456,0,6291456,6291456,6291456,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([6291456,6291456,2202049,6291456,2202081,6291456,2202113,6291456,2202145,6291456,2202177,6291456,2202209,6291456,2202241,6291456]),
  new Uint32Array([10501155,10501251,10501347,10501443,10501539,10501635,10501731,10501827,10501923,10502019,2141731,2105505,2098177,2155586,2166530,0]),
  new Uint32Array([2102081,2102209,2100833,2100737,2098337,2101441,2101569,2101697,2101825,2101953,2102081,2102209,2100833,2100737,2098337,2101441]),
  new Uint32Array([2146882,2146946,2147010,2147074,2147138,2147202,2147266,2147330,2146882,2146946,2147010,2147074,2147138,2147202,2147266,2147330]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,23068672,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0]),
  new Uint32Array([10502307,10502403,10502499,10502595,10502691,10502787,10502883,10502979,10503075,10503171,10503267,10503363,10503459,10503555,10503651,10503747]),
  new Uint32Array([2179937,2179969,2180001,2180033,2156545,2180065,2156577,2180097,2180129,2180161,2180193,2180225,2180257,2180289,2156737,2180321]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,0,6291456,6291456,0,0,0,6291456,0,0,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,0]),
  new Uint32Array([2227682,2227746,2227810,2227874,2227938,2228002,2228066,2228130,2228194,2228258,2228322,2228386,2228450,2228514,2228578,2228642]),
  new Uint32Array([2105601,2169121,2108193,2170049,2181025,2181057,2112481,2108321,2108289,2181089,2170497,2100865,2181121,2173601,2173633,2173665]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,2180641,6291456,6291456,6291456]),
  new Uint32Array([0,6291456,6291456,6291456,0,6291456,0,6291456,0,0,6291456,6291456,0,6291456,6291456,6291456]),
  new Uint32Array([2178273,6291456,2178305,6291456,2178337,6291456,2178369,6291456,2178401,6291456,2178433,6291456,2178465,6291456,2178497,6291456]),
  new Uint32Array([6291456,6291456,23068672,23068672,23068672,6291456,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,14680064,14680064,14680064,14680064,14680064,14680064]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,6291456]),
  new Uint32Array([2237377,2237409,2236225,2237441,2237473,2217441,2215521,2215553,2217473,2237505,2237537,2209697,2237569,2215585,2237601,2237633]),
  new Uint32Array([2221985,2165601,2165601,2165665,2165665,2222017,2222017,2165729,2165729,2158913,2158913,2158913,2158913,2097281,2097281,2105921]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,0,23068672,23068672,23068672,0,23068672,23068672,23068672,23068672,0,0]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,2149634,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2176897,6291456,6291456,23068672,23068672,23068672,23068672,23068672,23068672,23068672,2176929,6291456,2176961,6291456,2176993,6291456]),
  new Uint32Array([2172641,6291456,2172673,6291456,6291456,6291456,6291456,6291456,6291456,6291456,2172705,2172737,6291456,2172769,2172801,6291456]),
  new Uint32Array([2099173,2104196,2121667,2099395,2121763,2152258,2152322,2098946,2152386,2121859,2121955,2099333,2122051,2104324,2099493,2122147]),
  new Uint32Array([6291456,6291456,6291456,2145794,6291456,6291456,6291456,6291456,0,6291456,6291456,6291456,6291456,2145858,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,23068672,23068672,23068672,0,0,6291456,0]),
  new Uint32Array([0,2105921,2097729,0,2097377,0,0,2106017,0,2097505,2105889,2097185,2097697,2135777,2097633,2097441]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([2239074,2239138,2239201,2239233,2239265,2239297,2239329,2239361,0,2239393,2239425,2239425,2239458,2239521,2239553,2209569]),
  new Uint32Array([14680064,2098209,2111137,2105505,2098241,2108353,2108417,2105825,2111713,2100897,2111905,2105473,2105569,2105601,2112289,2108193]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,23068672,23068672,23068672,23068672,23068672,23068672,23068672,0,6291456,23068672]),
  new Uint32Array([2108321,2108289,2113153,2098209,2180897,2180929,2180961,2111137,2098241,2108353,2170241,2170273,2180993,2105825,6291456,2105473]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,2146114,6291456,6291456,6291456,0,0,0]),
  new Uint32Array([2105921,2105921,2105921,2222049,2222049,2130977,2130977,2130977,2130977,2160065,2160065,2160065,2160065,2097729,2097729,2097729]),
  new Uint32Array([2218145,2214785,2207937,2218177,2218209,2192993,2210113,2212769,2218241,2218273,2216129,2218305,2216161,2218337,2218369,2218401]),
  new Uint32Array([0,0,0,2156546,2156610,2156674,2156738,2156802,0,0,0,0,0,2156866,23068672,2156930]),
  new Uint32Array([23068672,23068672,23068672,0,0,0,0,23068672,23068672,0,0,23068672,23068672,23068672,0,0]),
  new Uint32Array([2213409,2213441,2213473,2213505,2213537,2213569,2213601,2213633,2213665,2195681,2213697,2213729,2213761,2213793,2213825,2213857]),
  new Uint32Array([2100033,2099233,2122017,2200673,2098113,2121537,2103201,2200705,2104033,2121857,2121953,2122401,2099649,2099969,2123009,2100129]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([2201857,6291456,2201889,6291456,2201921,6291456,2201953,6291456,2201985,6291456,2202017,6291456,2176193,2176257,23068672,23068672]),
  new Uint32Array([6291456,6291456,23068672,23068672,0,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2188193,2188225,2188257,2188289,2188321,2188353,2188385,2188417,2188449,2188481,2188513,2188545,2188577,2188609,2188641,0]),
  new Uint32Array([10554529,2221089,0,10502113,10562017,10537921,10538049,2221121,2221153,0,0,0,0,0,0,0]),
  new Uint32Array([2213889,2213921,2213953,2213985,2214017,2214049,2214081,2194177,2214113,2214145,2214177,2214209,2214241,2214273,2214305,2214337]),
  new Uint32Array([2166978,2167042,2099169,0,0,0,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,2180545,6291456,6291456,6291456]),
  new Uint32Array([10518915,10519011,10519107,10519203,2162242,2162306,2159554,2162370,2159362,2159618,2105922,2162434,2159746,2162498,2159810,2159874]),
  new Uint32Array([2161730,2161794,2135586,2161858,2161922,2137186,2131810,2160290,2135170,2161986,2137954,2162050,2162114,2162178,10518723,10518819]),
  new Uint32Array([10506627,10506723,10506819,10506915,10507011,10507107,10507203,10507299,10507395,10507491,10507587,10507683,10507779,10507875,10507971,10508067]),
  new Uint32Array([6291456,23068672,23068672,23068672,0,23068672,23068672,0,0,0,0,0,23068672,23068672,23068672,23068672]),
  new Uint32Array([23068672,23068672,23068672,23068672,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,0,0]),
  new Uint32Array([2175873,2175905,2175937,2175969,2176001,2176033,2176065,2176097,2176129,2176161,2176193,2176225,2176257,2176289,2176321,2176353]),
  new Uint32Array([2140006,2140198,2140390,2140582,2140774,23068672,23068672,23068672,23068672,23068672,6291456,6291456,6291456,23068672,23068672,23068672]),
  new Uint32Array([2108193,2112481,2112577,2098177,2098305,2108321,2108289,2100865,2113153,2108481,2113345,2113441,2098209,2111137,2105505,2098241]),
  new Uint32Array([0,23068672,0,0,0,0,0,0,0,2145154,2145218,2145282,6291456,0,2145346,0]),
  new Uint32Array([0,0,0,0,10531458,10495395,2148545,2143201,2173473,2148865,2173505,0,2173537,0,2173569,2149121]),
  new Uint32Array([10537282,10495683,2148738,2148802,2148866,0,6291456,2148930,2186593,2173473,2148737,2148865,2148802,10495779,10495875,10495971]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,0,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([2215425,2215457,2215489,2215521,2215553,2215585,2215617,2215649,2215681,2215713,2215745,2215777,2192033,2215809,2215841,2215873]),
  new Uint32Array([2242049,2242081,2242113,2242145,2242177,2242209,2242241,2242273,2215937,2242305,2242338,2242401,2242433,2242465,2242497,2216001]),
  new Uint32Array([10554529,2221089,0,0,10562017,10502113,10538049,10537921,2221185,10489601,10489697,10609889,10609921,2141729,2141793,10610273]),
  new Uint32Array([2141923,2142019,2142115,2142211,2142307,2142403,2142499,2142595,2142691,0,0,0,0,0,0,0]),
  new Uint32Array([0,2221185,2221217,10609857,10609857,10489601,10489697,10609889,10609921,2141729,2141793,2221345,2221377,2221409,2221441,2187105]),
  new Uint32Array([6291456,23068672,23068672,23068672,23068672,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,0]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,18923970,23068672,23068672,23068672,0,6291456,6291456]),
  new Uint32Array([2183105,6291456,2183137,6291456,2183169,6291456,2183201,6291456,2183233,6291456,2183265,6291456,2183297,6291456,2183329,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0]),
  new Uint32Array([23068672,23068672,23068672,23068672,0,0,0,0,0,0,0,0,6291456,6291456,6291456,6291456]),
  new Uint32Array([2134434,2134818,2097666,2097186,2097474,2097698,2105986,2131586,2132450,2131874,2131778,2135970,2135778,2161602,2136162,2161666]),
  new Uint32Array([2236865,2236897,2236930,2236993,2237025,2235681,2237058,2237121,2237153,2237185,2237217,2217281,2237250,2191233,2237313,2237345]),
  new Uint32Array([2190049,6291456,2190081,6291456,2190113,6291456,2190145,6291456,2190177,6291456,2190209,6291456,2190241,6291456,2190273,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,23068672,23068672,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2101922,2102050,2102178,2102306,10498755,10498851,10498947,10499043,10499139,10499235,10499331,10499427,10499523,10489604,10489732,10489860]),
  new Uint32Array([2166914,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,0,0,0,0,0]),
  new Uint32Array([2181601,2170561,2181633,2181665,2170753,2181697,2172897,2170881,2181729,2170913,2172929,2113441,2181761,2181793,2171009,2173761]),
  new Uint32Array([0,2105921,2097729,2106081,0,2097601,2162337,2106017,2133281,2097505,0,2097185,2097697,2135777,2097633,2097441]),
  new Uint32Array([6291456,6291456,6291456,23068672,23068672,23068672,23068672,23068672,6291456,6291456,6291456,6291456,0,0,0,0]),
  new Uint32Array([2248001,2248033,2248066,2248130,2248193,2248226,2248289,2248322,2248385,2248417,2216673,2248450,2248514,2248577,2248610,2248673]),
  new Uint32Array([6291456,6291456,0,0,0,0,0,0,0,6291456,6291456,6291456,6291456,0,0,0]),
  new Uint32Array([2169729,6291456,2169761,6291456,2169793,6291456,2169825,6291456,2169857,2169889,6291456,2169921,6291456,2143329,6291456,2098305]),
  new Uint32Array([2162178,2163202,2163266,2135170,2136226,2161986,2137954,2159426,2159490,2163330,2159554,2163394,2159682,2139522,2136450,2159746]),
  new Uint32Array([2173953,2173985,0,2174017,2174049,2174081,2174113,2174145,2174177,2149057,2174209,2174241,6291456,6291456,6291456,6291456]),
  new Uint32Array([6291456,6291456,4271169,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,2174273]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([6291456,6291456,0,0,0,0,0,0,0,6291456,0,0,0,0,0,0]),
  new Uint32Array([6291456,6291456,6291456,2190785,0,0,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([2189793,6291456,2189825,6291456,2189857,6291456,2189889,6291456,2189921,6291456,2189953,6291456,2189985,6291456,2190017,6291456]),
  new Uint32Array([2105601,2112289,2108193,2112481,2112577,0,2098305,2108321,2108289,2100865,2113153,2108481,2113345,0,2098209,2111137]),
  new Uint32Array([2172129,6291456,2172161,6291456,2172193,6291456,2172225,6291456,2172257,6291456,2172289,6291456,2172321,6291456,2172353,6291456]),
  new Uint32Array([2214753,6291456,2214785,6291456,6291456,2214817,2214849,2214881,2214913,2214945,2214977,2215009,2215041,2215073,2194401,6291456]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,6291456,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([0,0,0,0,6291456,6291456,6291456,23068672,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([10610305,10610337,10575617,2221761,10610401,10610433,10502177,0,10610465,10610497,10610529,10610561,0,0,0,0]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,23068672,0,0,0,0,23068672]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,2187105,2187137,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2199393,2199425,2199457,2199489,2199521,2199553,2199585,2199617,2199649,2199681,2199713,2199745,2199777,2199809,2199841,0]),
  new Uint32Array([2217249,2217281,2217313,2217345,2217377,2217409,2217441,2217473,2215617,2217505,2217537,2217569,2214753,2217601,2217633,2217665]),
  new Uint32Array([2170273,2170305,6291456,2170337,2170369,6291456,2170401,2170433,2170465,6291456,6291456,6291456,2170497,2170529,6291456,2170561]),
  new Uint32Array([2188673,6291456,2188705,2188737,2188769,6291456,6291456,2188801,6291456,2188833,6291456,2188865,6291456,2180929,2181505,2180897]),
  new Uint32Array([10489988,10490116,10490244,10490372,10490500,10490628,10490756,10490884,0,0,0,0,0,0,0,0]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,2147393,2147457,2147521,2147585,2147649,2147713,2147777,2147841]),
  new Uint32Array([23068672,23068672,0,23068672,23068672,0,23068672,23068672,23068672,23068672,23068672,0,0,0,0,0]),
  new Uint32Array([2241153,2241185,2241217,2215809,2241250,2241313,2241345,2241377,2217921,2241377,2241409,2215873,2241441,2241473,2241505,2241537]),
  new Uint32Array([23068672,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2220417,2220417,2220449,2220449,2220481,2220481,2220513,2220513,2220545,2220545,2220577,2220577,2220609,2220609,2220641,2220641]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,2144002,0,6291456,6291456,0,0,6291456,6291456,6291456]),
  new Uint32Array([2167105,2167137,2167169,2167201,2167233,2167265,2167297,2167329,2167361,2167393,2167425,2167457,2167489,2167521,2167553,2167585]),
  new Uint32Array([10575521,2098209,2111137,2105505,2098241,2108353,2108417,2105825,2111713,2100897,2111905,2105473,2105569,2105601,2112289,2108193]),
  new Uint32Array([2234146,2234210,2234274,2234338,2234402,2234466,2234530,2234594,2234658,2234722,2234786,2234850,2234914,2234978,2235042,2235106]),
  new Uint32Array([0,0,0,0,0,0,0,2180577,0,0,0,0,0,2180609,0,0]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,23068672,23068672,23068672,23068672,23068672,0,0,6291456,6291456]),
  new Uint32Array([2098209,2111137,2105505,2098241,2108353,2108417,2105825,2111713,2100897,2111905,2105473,2105569,2105601,2112289,2108193,2112481]),
  new Uint32Array([23068672,23068672,23068672,23068672,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2242529,2242561,2242593,2242625,2242657,2242689,2242721,2242753,2207937,2218177,2242785,2242817,2242849,2242882,2242945,2242977]),
  new Uint32Array([2118049,2105345,2118241,2105441,2118433,2118529,2118625,2118721,2118817,2200257,2200289,2191809,2200321,2200353,2200385,2200417]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,23068672,23068672,23068672,6291456,6291456]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,0]),
  new Uint32Array([2185505,6291456,2185537,6291456,2185569,6291456,2185601,6291456,2185633,6291456,2185665,6291456,2185697,6291456,2185729,6291456]),
  new Uint32Array([2231970,2232034,2232098,2232162,2232226,2232290,2232354,2232418,2232482,2232546,2232610,2232674,2232738,2232802,2232866,2232930]),
  new Uint32Array([2218625,2246402,2246466,2246530,2246594,2246657,2246689,2246689,2218657,2219681,2246721,2246753,2246785,2246818,2246881,2208481]),
  new Uint32Array([2197025,2197057,2197089,2197121,2197153,2197185,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([2219137,2216961,2219169,2219201,2219233,2219265,2219297,2217025,2215041,2219329,2217057,2219361,2217089,2219393,2197153,2219426]),
  new Uint32Array([23068672,23068672,23068672,0,0,0,23068672,23068672,23068672,0,23068672,23068672,23068672,23068672,0,0]),
  new Uint32Array([2098305,2108321,2108289,2100865,2113153,2108481,2113345,2113441,2098209,2111137,2105505,2098241,2108353,2108417,2105825,2111713]),
  new Uint32Array([2243522,2243585,2243617,2243649,2243681,2210113,2243713,2243746,2243810,2243874,2243937,2243970,2244033,2244065,2244097,2244129]),
  new Uint32Array([2178017,6291456,2178049,6291456,2178081,6291456,2178113,6291456,2178145,6291456,2178177,6291456,2178209,6291456,2178241,6291456]),
  new Uint32Array([10553858,2165314,10518722,6291456,10518818,0,10518914,2130690,10519010,2130786,10519106,2130882,10519202,2165378,10554050,2165506]),
  new Uint32Array([0,0,2135491,2135587,2135683,2135779,2135875,2135971,2135971,2136067,2136163,2136259,2136355,2136355,2136451,2136547]),
  new Uint32Array([23068672,23068672,23068672,6291456,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,6291456,6291456]),
  new Uint32Array([0,0,0,0,0,0,0,0,0,0,0,0,6291456,6291456,6291456,6291456]),
  new Uint32Array([23068672,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([2220033,2220033,2220065,2220065,2220065,2220065,2220097,2220097,2220097,2220097,2220129,2220129,2220129,2220129,2220161,2220161]),
  new Uint32Array([6291456,6291456,6291456,0,0,0,0,0,0,0,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,0,23068672,0,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([2100897,2100898,2100899,2150018,2100865,2100866,2100867,2100868,2150082,2108481,2109858,2109859,2105569,2105505,2098241,2105601]),
  new Uint32Array([2097217,2097505,2097505,2097505,2097505,2165570,2165570,2165634,2165634,2165698,2165698,2097858,2097858,0,0,2097152]),
  new Uint32Array([23068672,6291456,23068672,23068672,23068672,6291456,6291456,23068672,23068672,6291456,6291456,6291456,6291456,6291456,23068672,23068672]),
  new Uint32Array([23068672,23068672,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0]),
  new Uint32Array([10503843,10503939,10504035,10504131,10504227,10504323,10504419,10504515,10504611,10504707,10504803,10504899,10504995,10491140,10491268,0]),
  new Uint32Array([2173697,2173729,2148801,2173761,2143969,2173793,2173825,2153473,2173857,2173889,2173921,2173953,2173985,2173761,2174017,2174049]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,0,23068672,23068672,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([2134145,2097153,2134241,2105953,2132705,2130977,2160065,2131297,2162049,2133089,2160577,2133857,2235297,2220769,2235329,2235361]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,23068672,23068672,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([2222401,2222433,2222465,10531394,2222497,2222529,2222561,0,2222593,2222625,2222657,2222689,2222721,2222753,2222785,0]),
  new Uint32Array([2184481,6291456,2184513,6291456,2184545,6291456,2184577,6291456,2184609,6291456,2184641,6291456,2184673,6291456,2184705,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,23068672,23068672,23068672,23068672,6291456,6291456,6291456,6291456,23068672,23068672]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,23068672,23068672,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([2105570,2156034,2126947,2156098,2153666,2127043,2127139,2156162,0,2127235,2156226,2156290,2156354,2156418,2127331,2127427]),
  new Uint32Array([2215905,2207041,2153185,2241569,2241601,2241633,2241665,2241697,2241730,2241793,2241825,2241857,2241889,2241921,2241954,2242017]),
  new Uint32Array([2203777,6291456,2203809,6291456,2203841,6291456,2203873,6291456,2203905,6291456,2173121,2180993,2181249,2203937,2181313,0]),
  new Uint32Array([2168577,6291456,2168609,6291456,2168641,6291456,2168673,6291456,2168705,6291456,2168737,6291456,2168769,6291456,2168801,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,6291456,23068672,23068672,6291456]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,0,23068672,23068672,23068672,0,23068672,23068672,23068672,0,0]),
  new Uint32Array([2210113,2195521,2210145,2210177,2210209,2210241,2210273,2210305,2210337,2210369,2210401,2210433,2210465,2210497,2210529,2210561]),
  new Uint32Array([6291456,0,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0]),
  new Uint32Array([2228706,2228770,2228834,2228898,2228962,2229026,2229090,2229154,2229218,2229282,2229346,2229410,2229474,2229538,2229602,2229666]),
  new Uint32Array([23068672,6291456,6291456,6291456,6291456,0,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([6291456,6291456,6291456,0,0,0,0,0,0,0,0,0,0,0,0,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,0,6291456,6291456,6291456,6291456,18874368,18874368,18874368,0,0]),
  new Uint32Array([2133089,2133281,2133281,2133281,2133281,2160577,2160577,2160577,2160577,2097441,2097441,2097441,2097441,2133857,2133857,2133857]),
  new Uint32Array([6291456,0,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,0,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2173825,2153473,2173857,2173889,2173921,2173953,2173985,2174017,2174017,2174049,2174081,2174113,2174145,2174177,2149057,2233089]),
  new Uint32Array([2178529,6291456,2178561,6291456,2178593,6291456,2178625,6291456,2178657,6291456,2178689,6291456,2178721,6291456,2178753,6291456]),
  new Uint32Array([2221025,2221025,2221057,2221057,2159329,2159329,2159329,2159329,2097217,2097217,2158914,2158914,2158978,2158978,2159042,2159042]),
  new Uint32Array([2208161,2208193,2208225,2208257,2194433,2208289,2208321,2208353,2208385,2208417,2208449,2208481,2208513,2208545,2208577,2208609]),
  new Uint32Array([2169217,6291456,2169249,6291456,2169281,6291456,2169313,6291456,2169345,6291456,2169377,6291456,2169409,6291456,2169441,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,6291456,6291456,6291456,6291456]),
  new Uint32Array([2133187,2133283,2133283,2133379,2133475,2133571,2133667,2133667,2133763,2133859,2133955,2134051,2134147,2134147,2134243,2134339]),
  new Uint32Array([2197697,2114113,2114209,2197729,2197761,2114305,2197793,2114401,2114497,2197825,2114593,2114689,2114785,2114881,2114977,0]),
  new Uint32Array([2193089,2193121,2193153,2193185,2117665,2117569,2193217,2193249,2193281,2193313,2193345,2193377,2193409,2193441,2193473,2193505]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0]),
  new Uint32Array([6291456,6291456,6291456,0,0,0,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([6291456,6291456,6291456,0,0,0,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2184225,6291456,2184257,6291456,2184289,6291456,2184321,6291456,2184353,6291456,2184385,6291456,2184417,6291456,2184449,6291456]),
  new Uint32Array([2112577,2098177,2098305,2108321,2108289,2100865,2113153,2108481,2113345,2113441,2100833,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,23068672,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([2098657,2098049,2200737,2123489,2123681,2200769,2098625,2100321,2098145,2100449,2098017,2098753,2200801,2200833,2200865,0]),
  new Uint32Array([23068672,23068672,23068672,0,0,0,0,0,0,0,0,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,23068672,23068672,23068672,23068672,23068672,0,0,0,0,0]),
  new Uint32Array([2098305,2108321,2108289,2100865,2113153,2108481,2113345,2113441,2098209,2111137,0,2098241,2108353,2108417,2105825,0]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,2181153,2105505,2181185,2167617,2180993]),
  new Uint32Array([2160002,2160066,2160130,2160194,2160258,2132066,2131010,2131106,2106018,2131618,2160322,2131298,2132034,2131938,2137410,2132226]),
  new Uint32Array([6291456,6291456,6291456,6291456,0,0,0,0,0,0,0,0,0,0,0,6291456]),
  new Uint32Array([2183617,6291456,2183649,6291456,2183681,6291456,2183713,6291456,2183745,6291456,2183777,6291456,2183809,6291456,2183841,6291456]),
  new Uint32Array([0,6291456,6291456,0,6291456,0,0,6291456,6291456,0,6291456,0,0,6291456,0,0]),
  new Uint32Array([2250977,2251009,2251041,2251073,2195009,2251106,2251169,2251201,2251233,2251265,2251297,2251330,2251394,2251457,2251489,2251521]),
  new Uint32Array([2205729,2205761,2205793,2205825,2205857,2205889,2205921,2205953,2205985,2206017,2206049,2206081,2206113,2206145,2206177,2206209]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,0,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2143170,2168993,6291456,2169025,6291456,2169057,6291456,2169089,6291456,2143234,2169121,6291456,2169153,6291456,2169185,6291456]),
  new Uint32Array([23068672,23068672,2190689,6291456,0,0,0,0,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2248706,2248769,2248801,2248833,2248865,2248897,2248929,2248962,2249026,2249090,2249154,2240705,2249217,2249249,2249281,2249313]),
  new Uint32Array([10485857,6291456,6291456,6291456,6291456,6291456,6291456,6291456,10495394,6291456,2098209,6291456,6291456,2097152,6291456,10531394]),
  new Uint32Array([0,6291456,6291456,6291456,6291456,6291456,6291456,0,0,6291456,6291456,6291456,6291456,6291456,6291456,0]),
  new Uint32Array([14680064,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2173985,2173953,2148481,2173601,2173633,2173665,2173697,2173729,2148801,2173761,2143969,2173793,2173825,2153473,2173857,2173889]),
  new Uint32Array([6291456,2186977,6291456,6291456,6291456,6291456,6291456,10537858,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2209601,2209633,2209665,2209697,2209729,2209761,2209793,2209825,2209857,2209889,2209921,2209953,2209985,2210017,2210049,2210081]),
  new Uint32Array([10501539,10501635,10501731,10501827,10501923,10502019,2098209,2111137,2105505,2098241,2108353,2108417,2105825,2111713,2100897,2111905]),
  new Uint32Array([2173697,2173729,2148801,2173761,2143969,2173793,2173825,2153473,2173857,2173889,2173921,2173953,2173985,2174017,2174017,2174049]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,6291456,6291456,6291456,6291456,0,0]),
  new Uint32Array([6291456,6291456,23068672,23068672,23068672,0,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([2194561,2194593,2194625,2119777,2119873,2194657,2194689,2194721,2194753,2194785,2194817,2194849,2194881,2194913,2194945,2194977]),
  new Uint32Array([2113153,2108481,2113345,2113441,2098209,2111137,2105505,2098241,2108353,2108417,2105825,2111713,2100897,2111905,2105473,2105569]),
  new Uint32Array([2222818,2222882,2222946,2223010,2223074,2223138,2223202,2223266,2223330,2223394,2223458,2223522,2223586,2223650,2223714,2223778]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,23068672]),
  new Uint32Array([0,2179553,2179585,2179617,2179649,2144001,2179681,2179713,2179745,2179777,2179809,2156705,2179841,2156833,2179873,2179905]),
  new Uint32Array([6291456,23068672,6291456,2145602,23068672,23068672,23068672,23068672,23068672,23068672,0,23068672,23068672,6291456,0,0]),
  new Uint32Array([2196513,2196545,2196577,2196609,2196641,2196673,2196705,2196737,2196769,2196801,2196833,2196865,2196897,2196929,2196961,2196993]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2177281,6291456,2177313,6291456,2177345,6291456,2177377,6291456,2177409,6291456,2177441,6291456,2177473,6291456,2177505,6291456]),
  new Uint32Array([2187137,2221473,2221505,2221537,2221569,6291456,6291456,10610209,10610241,10537986,10537986,10537986,10537986,10609857,10609857,10609857]),
  new Uint32Array([2243009,2243041,2216033,2243074,2243137,2243169,2243201,2219617,2243233,2243265,2243297,2243329,2243362,2243425,2243457,2243489]),
  new Uint32Array([10485857,10485857,10485857,10485857,10485857,10485857,10485857,10485857,10485857,10485857,10485857,2097152,4194304,4194304,0,0]),
  new Uint32Array([2143042,6291456,2143106,2143106,2168833,6291456,2168865,6291456,6291456,2168897,6291456,2168929,6291456,2168961,6291456,2143170]),
  new Uint32Array([6291456,6291456,23068672,23068672,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2204193,2204225,2204257,2204289,2204321,2204353,2204385,2204417,2204449,2204481,2204513,2204545,2204577,2204609,2204641,2204673]),
  new Uint32Array([2202753,6291456,2202785,6291456,2202817,6291456,2202849,6291456,2202881,6291456,2202913,6291456,2202945,6291456,2202977,6291456]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,0,0,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([2108353,2108417,2105825,2111713,2100897,2111905,2105473,2105569,2105601,2112289,2108193,2112481,2112577,2098177,2098305,2108321]),
  new Uint32Array([2147394,2147458,2147522,2147586,2147650,2147714,2147778,2147842,2147394,2147458,2147522,2147586,2147650,2147714,2147778,2147842]),
  new Uint32Array([2253313,2253346,2253409,2253441,2253473,2253505,2253537,2253569,2253601,2253634,2219393,2253697,2253729,2253761,2253793,2253825]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,23068672,23068672,23068672,23068672,6291456,6291456]),
  new Uint32Array([2162562,2162626,2131362,2162690,2159938,2160002,2162754,2162818,2160130,2162882,2160194,2160258,2160834,2160898,2161026,2161090]),
  new Uint32Array([2175361,2175393,2175425,2175457,2175489,2175521,2175553,2175585,2175617,2175649,2175681,2175713,2175745,2175777,2175809,2175841]),
  new Uint32Array([2253858,2253921,2253954,2254018,2254082,2196737,2254145,2196865,2254177,2254209,2254241,2254273,2197025,2254306,0,0]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,2202113,2204129,2188705,2204161]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,6291456,0,6291456,6291456,6291456,6291456,0,0]),
  new Uint32Array([2173985,2174017,2174017,2174049,2174081,2174113,2174145,2174177,2149057,2233089,2173697,2173761,2173793,2174113,2173985,2173953]),
  new Uint32Array([2101569,2101697,2101825,2101953,2102081,2102209,2100833,2100737,2098337,2101441,2101569,2101697,2101825,2101953,2102081,2102209]),
  new Uint32Array([2108289,2100865,2113153,2108481,2113345,2113441,2098209,2111137,2105505,2098241,0,2108417,0,2111713,2100897,2111905]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,0,0,0,0,0,0,0,0]),
  new Uint32Array([2175425,2175489,2175809,2175905,2175937,2175937,2176193,2176417,2180865,0,0,0,0,0,0,0]),
  new Uint32Array([6291456,6291456,6291456,6291456,2143298,2143298,2143298,2143362,2143362,2143362,2143426,2143426,2143426,2171105,6291456,2171137]),
  new Uint32Array([2120162,2120258,2151618,2151682,2151746,2151810,2151874,2151938,2152002,2120035,2120131,2120227,2152066,2120323,2152130,2120419]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,0,0,0,0,0,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2195361,2142433,2236065,2236097,2236129,2236161,2118241,2117473,2236193,2236225,2236257,2236289,0,0,0,0]),
  new Uint32Array([2189281,6291456,2189313,6291456,2189345,6291456,2189377,6291456,2189409,6291456,2189441,6291456,2189473,6291456,2189505,6291456]),
  new Uint32Array([6291456,6291456,2145922,6291456,6291456,6291456,6291456,2145986,6291456,6291456,6291456,6291456,2146050,6291456,6291456,6291456]),
  new Uint32Array([2100833,2100737,2098337,2101441,2101569,2101697,2101825,2101953,2102081,2102209,10502113,10562017,10610401,10502177,10610433,10538049]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,2186401,0,2186433,0,2186465,0,2186497]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,23068672,23068672,23068672]),
  new Uint32Array([0,0,2198241,2198273,2198305,2198337,2198369,2198401,0,0,2198433,2198465,2198497,0,0,0]),
  new Uint32Array([6291456,0,6291456,6291456,6291456,6291456,0,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,0,6291456,0,23068672,23068672,23068672,23068672,23068672,23068672,0,0]),
  new Uint32Array([6291456,6291456,6291456,6291456,0,6291456,6291456,6291456,6291456,6291456,0,0,23068672,6291456,23068672,23068672]),
  new Uint32Array([0,2105921,2097729,0,2097377,0,0,2106017,2133281,2097505,2105889,0,2097697,2135777,2097633,2097441]),
  new Uint32Array([2197889,2197921,2197953,2197985,2198017,2198049,2198081,2198113,2198145,2198177,2198209,2198241,2198273,2198305,2198337,2198369]),
  new Uint32Array([2132514,2132610,2160386,2133090,2133186,2160450,2160514,2133282,2160578,2133570,2106178,2160642,2133858,2160706,2160770,2134146]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,23068672,23068672,0,0,0,0,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([6291456,23068672,23068672,6291456,23068672,23068672,6291456,23068672,0,0,0,0,0,0,0,0]),
  new Uint32Array([2184737,6291456,2184769,6291456,2184801,6291456,2184833,6291456,2184865,6291456,2184897,6291456,2184929,6291456,2184961,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,6291456,0,6291456,6291456,6291456,6291456,0,6291456]),
  new Uint32Array([6291456,6291456,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([23068672,23068672,23068672,23068672,6291456,23068672,23068672,23068672,6291456,23068672,23068672,23068672,23068672,23068672,0,0]),
  new Uint32Array([6291456,6291456,6291456,2186753,6291456,6291456,6291456,6291456,2186785,2186817,2186849,2173569,2186881,10496355,10495395,10575521]),
  new Uint32Array([0,0,2097729,0,0,0,0,2106017,0,2097505,0,2097185,0,2135777,2097633,2097441]),
  new Uint32Array([2189537,6291456,2189569,6291456,2189601,6291456,2189633,6291456,2189665,6291456,2189697,6291456,2189729,6291456,2189761,6291456]),
  new Uint32Array([2202497,6291456,2202529,6291456,2202561,6291456,2202593,6291456,2202625,6291456,2202657,6291456,2202689,6291456,2202721,6291456]),
  new Uint32Array([2245217,2218369,2245249,2245282,2245345,2245377,2245410,2245474,2245537,2245569,2245601,2245633,2245665,2245665,2245697,2245729]),
  new Uint32Array([6291456,0,23068672,23068672,0,0,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([6291456,0,0,0,0,0,0,23068672,0,0,0,0,0,0,0,0]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,23068672,6291456,23068672,6291456,23068672,6291456,6291456,6291456,6291456,23068672,23068672]),
  new Uint32Array([0,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([2097281,2105921,2097729,2106081,2097377,2097601,2162337,2106017,2133281,2097505,0,2097185,2097697,2135777,2097633,2097441]),
  new Uint32Array([2176641,6291456,2176673,6291456,2176705,6291456,2176737,6291456,2176769,6291456,2176801,6291456,2176833,6291456,2176865,6291456]),
  new Uint32Array([2174145,2174177,2149057,2233089,2173697,2173761,2173793,2174113,2173985,2173953,2174369,2174369,0,0,2100833,2100737]),
  new Uint32Array([2116513,2190817,2190849,2190881,2190913,2190945,2116609,2190977,2191009,2191041,2191073,2117185,2191105,2191137,2191169,2191201]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,0,0,6291456,6291456,6291456]),
  new Uint32Array([0,0,0,0,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,6291456]),
  new Uint32Array([2167617,2167649,2167681,2167713,2167745,2167777,2167809,6291456,2167841,2167873,2167905,2167937,2167969,2168001,2168033,4240130]),
  new Uint32Array([2165122,2163970,2164034,2164098,2164162,2164226,2164290,2164354,2164418,2164482,2164546,2133122,2134562,2132162,2132834,2136866]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,0,0,2186209,2186241,2186273,2186305,2186337,2186369,0,0]),
  new Uint32Array([2112481,2112577,2098177,2098305,2108321,2108289,2100865,2113153,2108481,2113345,2113441,14680064,14680064,14680064,14680064,14680064]),
  new Uint32Array([0,0,23068672,6291456,0,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,6291456,6291456]),
  new Uint32Array([0,10537921,10610689,10610273,10610497,10610529,10610305,10610721,10489601,10489697,10610337,10575617,10554529,2221761,2197217,10496577]),
  new Uint32Array([2105473,2105569,2105601,2112289,0,2112481,2112577,2098177,2098305,2108321,2108289,2100865,2113153,2108481,2113345,2113441]),
  new Uint32Array([2100897,2111905,2105473,2105569,2105601,2112289,2108193,2112481,2112577,2098177,2098305,2108321,2108289,2100865,2113153,2108481]),
  new Uint32Array([2125346,2153410,2153474,2127394,2153538,2153602,2153666,2153730,2105507,2105476,2153794,2153858,2153922,2153986,2154050,2105794]),
  new Uint32Array([2200449,2119681,2200481,2153313,2199873,2199905,2199937,2200513,2200545,2200577,2200609,2119105,2119201,2119297,2119393,2119489]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,2175777,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2222273,2197217,2221473,2221505,2221089,2222305,2200865,2099681,2104481,2222337,2099905,2120737,2222369,2103713,2100225,2098785]),
  new Uint32Array([2201377,6291456,2201409,6291456,2201441,6291456,2201473,6291456,2201505,6291456,2201537,6291456,2201569,6291456,6291456,23068672]),
  new Uint32Array([2174081,2174113,2174145,2174177,2149057,2233057,2148481,2173601,2173633,2173665,2173697,2173729,2148801,2173761,2143969,2173793]),
  new Uint32Array([2200897,6291456,2200929,6291456,2200961,6291456,2200993,6291456,2201025,6291456,2180865,6291456,2201057,6291456,2201089,6291456]),
  new Uint32Array([0,0,0,0,0,23068672,23068672,0,6291456,6291456,6291456,0,0,0,0,0]),
  new Uint32Array([2161154,2161410,2138658,2161474,2161538,2097666,2097186,2097474,2162946,2132450,2163010,2163074,2136162,2163138,2161666,2161730]),
  new Uint32Array([2148481,2173601,2173633,2173665,2173697,2173729,2148801,2173761,2143969,2173793,2173825,2153473,2173857,2173889,2173921,2173953]),
  new Uint32Array([0,0,0,0,0,0,23068672,23068672,0,0,0,0,2145410,2145474,0,6291456]),
  new Uint32Array([2244161,2216065,2212769,2244193,2244225,2244257,2244290,2244353,2244385,2244417,2244449,2218273,2244481,2244514,2244577,2244609]),
  new Uint32Array([2125730,2125699,2125795,2125891,2125987,2154114,2154178,2154242,2154306,2154370,2154434,2154498,2126082,2126178,2126274,2126083]),
  new Uint32Array([2237665,2237697,2237697,2237697,2237730,2237793,2237825,2237857,2237890,2237953,2237985,2238017,2238049,2238081,2238113,2238145]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,2150146,6291456,6291456,6291456]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,0,0,23068672,23068672,0,0,23068672,23068672,23068672,0,0]),
  new Uint32Array([2214369,2238593,2238625,2238657,2238689,2238721,2238753,2238785,2238817,2238850,2238913,2238945,2238977,2235457,2239009,2239041]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0]),
  new Uint32Array([2252066,2252130,2252193,2252225,2252257,2252290,2252353,2252385,2252417,2252449,2252481,2252513,2252545,2252578,2252641,2252673]),
  new Uint32Array([2197697,2114113,2114209,2197729,2197761,2114305,2197793,2114401,2114497,2197825,2114593,2114689,2114785,2114881,2114977,2197857]),
  new Uint32Array([2224866,2224930,2224994,2225058,2225122,2225186,2225250,2225314,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2219490,2219554,2219617,2219649,2219681,2219714,2219778,2219842,2219905,2219937,0,0,0,0,0,0]),
  new Uint32Array([6291456,23068672,23068672,23068672,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,6291456]),
  new Uint32Array([2113345,2113441,2098209,2111137,2105505,2098241,2108353,2108417,2105825,2111713,2100897,2111905,2105473,2105569,2105601,2112289]),
  new Uint32Array([2174081,2174113,2174145,2174177,2149057,2233089,2173697,2173761,2173793,2174113,2173985,2173953,2148481,2173601,2173633,2173665]),
  new Uint32Array([2220161,2220161,2220193,2220193,2220193,2220193,2220225,2220225,2220225,2220225,2220257,2220257,2220257,2220257,2220289,2220289]),
  new Uint32Array([2192673,2192705,2192737,2192769,2192801,2192833,2192865,2118049,2192897,2117473,2117761,2192929,2192961,2192993,2193025,2193057]),
  new Uint32Array([2179297,6291456,2179329,6291456,2179361,6291456,2179393,6291456,2179425,6291456,2179457,6291456,2179489,6291456,2179521,6291456]),
  new Uint32Array([6291456,6291456,6291456,23068672,6291456,6291456,6291456,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([2235745,2235777,2193633,2235809,2235841,2235873,2235905,2235937,2235969,2116513,2116705,2236001,2200513,2199905,2200545,2236033]),
  new Uint32Array([2113153,2108481,2113345,2113441,2232993,2233025,0,0,2148481,2173601,2173633,2173665,2173697,2173729,2148801,2173761]),
  new Uint32Array([2170593,6291456,2170625,6291456,2170657,6291456,2170689,2170721,6291456,2170753,6291456,6291456,2170785,6291456,2170817,2170849]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,2166786,2166850,0,0,0,0]),
  new Uint32Array([23068672,6291456,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,6291456,6291456]),
  new Uint32Array([2100833,2100737,2098337,2101441,2101569,2101697,2101825,2101953,2102081,2102209,10575617,2187041,10502177,10489601,10489697,0]),
  new Uint32Array([0,0,0,0,0,0,0,0,0,0,0,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2134562,2132162,2132834,2136866,2136482,2164610,2164674,2164738,2164802,2132802,2132706,2164866,2132898,2164930,2164994,2165058]),
  new Uint32Array([6291456,6291456,2098337,2101441,10531458,2153473,6291456,6291456,10531522,2100737,2108193,6291456,2106499,2106595,2106691,6291456]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,23068672,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([2233122,2233186,2233250,2233314,2233378,2233442,2233506,2233570,2233634,2233698,2233762,2233826,2233890,2233954,2234018,2234082]),
  new Uint32Array([23068672,6291456,23068672,23068672,23068672,6291456,6291456,23068672,23068672,23068672,23068672,23068672,23068672,23068672,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,0,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,0,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([2205217,2205249,2205281,2205313,2205345,2205377,2205409,2205441,2205473,2205505,2205537,2205569,2205601,2205633,2205665,2205697]),
  new Uint32Array([6291456,0,6291456,0,0,0,6291456,6291456,6291456,6291456,0,0,23068672,6291456,23068672,23068672]),
  new Uint32Array([2173601,2173761,2174081,2173569,2174241,2174113,2173953,6291456,2174305,6291456,2174337,6291456,2174369,6291456,2174401,6291456]),
  new Uint32Array([6291456,23068672,23068672,23068672,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,6291456,6291456]),
  new Uint32Array([2152450,2152514,2099653,2104452,2099813,2122243,2099973,2152578,2122339,2122435,2122531,2122627,2122723,2104580,2122819,2152642]),
  new Uint32Array([2236385,2236417,2236449,2236482,2236545,2215425,2236577,2236609,2236641,2236673,2215457,2236705,2236737,2236770,2215489,2236833]),
  new Uint32Array([2163394,2159746,2163458,2131362,2163522,2160130,2163778,2132226,2163842,2132898,2163906,2161410,2138658,2097666,2136162,2163650]),
  new Uint32Array([2218721,2246913,2246946,2216385,2247010,2247074,2215009,2247137,2247169,2216481,2247201,2247233,2247266,2247330,2247330,0]),
  new Uint32Array([2129730,2129762,2129858,2129731,2129827,2156482,2156482,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,6291456,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,0,6291456,0,0,0,0,0,6291456,0,0]),
  new Uint32Array([2203969,2204001,2181377,2204033,2204065,6291456,2204097,6291456,0,0,0,0,0,0,0,0]),
  new Uint32Array([2169473,6291456,2169505,6291456,2169537,6291456,2169569,6291456,2169601,6291456,2169633,6291456,2169665,6291456,2169697,6291456]),
  new Uint32Array([2141542,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2220801,2220801,2220801,2220801,2220833,2220833,2220865,2220865,2220865,2220865,2220897,2220897,2220897,2220897,2139873,2139873]),
  new Uint32Array([0,0,0,0,0,23068672,23068672,0,0,0,0,0,0,0,6291456,0]),
  new Uint32Array([2214849,2218433,2218465,2218497,2218529,2218561,2214881,2218593,2218625,2218657,2218689,2218721,2218753,2216545,2218785,2218817]),
  new Uint32Array([23068672,23068672,23068672,23068672,0,0,0,0,0,0,0,0,0,0,0,6291456]),
  new Uint32Array([2136482,2164610,2164674,2164738,2164802,2132802,2132706,2164866,2132898,2164930,2164994,2165058,2165122,2132802,2132706,2164866]),
  new Uint32Array([2207649,2207681,2207713,2207745,2207777,2207809,2207841,2207873,2207905,2207937,2207969,2208001,2208033,2208065,2208097,2208129]),
  new Uint32Array([2123683,2105092,2152706,2123779,2105220,2152770,2100453,2098755,2123906,2124002,2124098,2124194,2124290,2124386,2124482,2124578]),
  new Uint32Array([6291456,6291456,6291456,6291456,0,0,0,6291456,0,0,0,0,0,0,0,10485857]),
  new Uint32Array([6291456,6291456,6291456,6291456,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([10508163,10508259,10508355,10508451,2200129,2200161,2192737,2200193,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2203553,6291456,2203585,6291456,6291456,6291456,2203617,6291456,2203649,6291456,2203681,6291456,2203713,6291456,2203745,6291456]),
  new Uint32Array([18884449,18884065,23068672,18884417,18884034,18921185,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,18874368]),
  new Uint32Array([2247393,2247426,2247489,2247521,2247553,2247586,2247649,2247681,2247713,2247745,2247777,2247810,2247873,2247905,2247937,2247969]),
  new Uint32Array([6291456,6291456,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,6291456,23068672]),
  new Uint32Array([2134145,2097153,2134241,0,2132705,2130977,2160065,2131297,0,2133089,2160577,2133857,2235297,0,2235329,0]),
  new Uint32Array([2182593,6291456,2182625,6291456,2182657,6291456,2182689,6291456,2182721,6291456,2182753,6291456,2182785,6291456,2182817,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,2102402,2102403,6291456,2110050]),
  new Uint32Array([2149890,2108323,2149954,6291456,2113441,6291456,2149057,6291456,2113441,6291456,2105473,2167265,2111137,2105505,6291456,2108353]),
  new Uint32Array([2219105,2219137,2195233,2251554,2251617,2251649,2251681,2251713,2251746,2251810,2251873,2251905,2251937,2251970,2252033,2219169]),
  new Uint32Array([2203009,6291456,2203041,6291456,2203073,6291456,2203105,6291456,2203137,6291456,2203169,6291456,2203201,6291456,2203233,6291456]),
  new Uint32Array([2128195,2128291,2128387,2128483,2128579,2128675,2128771,2128867,2128963,2129059,2129155,2129251,2129347,2129443,2129539,2129635]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,2140964,2141156,2140966,2141158,2141350]),
  new Uint32Array([0,0,0,0,0,0,0,0,0,0,0,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,23068672,6291456,6291456,6291456,6291456,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([2225378,2225442,2225506,2225570,2225634,2225698,2225762,2225826,2225890,2225954,2226018,2226082,2226146,2226210,2226274,2226338]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([23068672,23068672,23068672,23068672,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2112577,2098177,2098305,2108321,2108289,2100865,2113153,2108481,2113345,2113441,2098209,2111137,2105505,2098241,2108353,2108417]),
  new Uint32Array([2108353,2108417,0,2105601,2108193,2157121,2157313,2157377,2157441,2100897,6291456,2108419,2173953,2173633,2173633,2173953]),
  new Uint32Array([2111713,2173121,2111905,2098177,2173153,2173185,2173217,2113153,2113345,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,6291456,6291456,6291456,6291456,2190753]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,2197249,6291456,2117377,2197281,2197313,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([6291456,0,0,0,0,0,0,23068672,0,0,0,0,0,6291456,6291456,6291456]),
  new Uint32Array([2098337,2101441,2101569,2101697,2101825,2101953,2102081,2102209,2100833,2100737,2098337,2101441,2101569,2101697,2101825,2101953]),
  new Uint32Array([23068672,23068672,23068672,23068672,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0]),
  new Uint32Array([0,0,0,0,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,23068672,23068672,23068672]),
  new Uint32Array([2173281,6291456,2173313,6291456,2173345,6291456,2173377,6291456,0,0,10532546,6291456,6291456,6291456,10562017,2173441]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,23068672,23068672,0,0]),
  new Uint32Array([23068672,23068672,23068672,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,23068672,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2159426,2159490,2159554,2159362,2159618,2159682,2139522,2136450,2159746,2159810,2159874,2130978,2131074,2131266,2131362,2159938]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,0,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2203233,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,2203265,6291456,2203297,6291456,2203329,2203361,6291456]),
  new Uint32Array([6291456,6291456,2148418,2148482,2148546,0,6291456,2148610,2186529,2186561,2148417,2148545,2148482,10495778,2143969,10495778]),
  new Uint32Array([2134146,2139426,2160962,2134242,2161218,2161282,2161346,2161410,2138658,2134722,2134434,2134818,2097666,2097346,2097698,2105986]),
  new Uint32Array([2198881,2198913,2198945,2198977,2199009,2199041,2199073,2199105,2199137,2199169,2199201,2199233,2199265,2199297,2199329,2199361]),
  new Uint32Array([0,23068672,23068672,23068672,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,6291456]),
  new Uint32Array([10610561,2098209,2111137,2105505,2098241,2108353,2108417,2105825,2111713,2100897,2111905,2105473,2105569,2105601,2112289,2108193]),
  new Uint32Array([2183873,6291456,2183905,6291456,2183937,6291456,2183969,6291456,2184001,6291456,2184033,6291456,2184065,6291456,2184097,6291456]),
  new Uint32Array([2244642,2244706,2244769,2244801,2218305,2244833,2244865,2244897,2244929,2244961,2244993,2245026,2245089,2245122,2245185,0]),
  new Uint32Array([6291456,6291456,2116513,2116609,2116705,2116801,2199873,2199905,2199937,2199969,2190913,2200001,2200033,2200065,2200097,2191009]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,0,0,2180673,2180705,2180737,2180769,2180801,2180833,0,0]),
  new Uint32Array([2098081,2099521,2099105,2120705,2098369,2120801,2103361,2097985,2098433,2121377,2121473,2099169,2099873,2098401,2099393,2152609]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,2150402]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,2145666,2145730,6291456,6291456]),
  new Uint32Array([2173921,2173953,2173985,2173761,2174017,2174049,2174081,2174113,2174145,2174177,2149057,2233057,2148481,2173601,2173633,2173665]),
  new Uint32Array([2187073,6291456,6291456,6291456,6291456,2098241,2098241,2108353,2100897,2111905,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,2102404,6291456,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,2100612,6291456,6291456,6291456,6291456,6291456,6291456,6291456,10485857]),
  new Uint32Array([2149057,2233057,2148481,2173601,2173633,2173665,2173697,2173729,2148801,2173761,2143969,2173793,2173825,2153473,2173857,2173889]),
  new Uint32Array([2217697,2217729,2217761,2217793,2217825,2217857,2217889,2217921,2217953,2215873,2217985,2215905,2218017,2218049,2218081,2218113]),
  new Uint32Array([2211233,2218849,2216673,2218881,2218913,2218945,2218977,2219009,2216833,2219041,2215137,2219073,2216865,2209505,2219105,2216897]),
  new Uint32Array([2240097,2240129,2240161,2240193,2240225,2240257,2240289,2240321,2240353,2240386,2240449,2240481,2240513,2240545,2207905,2240578]),
  new Uint32Array([6291456,6291456,2202273,6291456,2202305,6291456,2202337,6291456,2202369,6291456,2202401,6291456,2202433,6291456,2202465,6291456]),
  new Uint32Array([0,23068672,23068672,18923394,23068672,18923458,18923522,18884099,18923586,18884195,23068672,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([2201121,6291456,2201153,6291456,2201185,6291456,2201217,6291456,2201249,6291456,2201281,6291456,2201313,6291456,2201345,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,6291456,6291456]),
  new Uint32Array([2211041,2211073,2211105,2211137,2211169,2211201,2211233,2211265,2211297,2211329,2211361,2211393,2211425,2211457,2211489,2211521]),
  new Uint32Array([2181825,6291456,2181857,6291456,2181889,6291456,2181921,6291456,2181953,6291456,2181985,6291456,2182017,6291456,2182049,6291456]),
  new Uint32Array([2162337,2097633,2097633,2097633,2097633,2132705,2132705,2132705,2132705,2097153,2097153,2097153,2097153,2133089,2133089,2133089]),
  new Uint32Array([6291456,6291456,6291456,6291456,0,0,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([6291456,2148545,6291456,2173473,6291456,2148865,6291456,2173505,6291456,2173537,6291456,2173569,6291456,2149121,0,0]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,6291456,6291456,0,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,23068672,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,0]),
  new Uint32Array([2148801,2173761,2143969,2173793,2173825,2153473,2173857,2173889,2173921,2173953,2173985,2174017,2174017,2174049,2174081,2174113]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,23068672,0,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([2207137,2207169,2207201,2207233,2207265,2207297,2207329,2207361,2207393,2207425,2207457,2207489,2207521,2207553,2207585,2207617]),
  new Uint32Array([6291456,6291456,23068672,23068672,23068672,6291456,6291456,0,23068672,23068672,0,0,0,0,0,0]),
  new Uint32Array([2198401,2198433,2198465,2198497,0,2198529,2198561,2198593,2198625,2198657,2198689,2198721,2198753,2198785,2198817,2198849]),
  new Uint32Array([2105505,2098241,2108353,2108417,2105825,2111713,2100897,2111905,2105473,2105569,2105601,2112289,2108193,2112481,2112577,2098177]),
  new Uint32Array([23068672,23068672,23068672,23068672,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,23068672,0,0]),
  new Uint32Array([2216385,2118721,2216417,2216449,2216481,2216513,2216545,2211233,2216577,2216609,2216641,2216673,2216705,2216737,2216737,2216769]),
  new Uint32Array([2216801,2216833,2216865,2216897,2216929,2216961,2216993,2215169,2217025,2217057,2217089,2217121,2217154,2217217,0,0]),
  new Uint32Array([2210593,2191809,2210625,2210657,2210689,2210721,2210753,2210785,2210817,2210849,2191297,2210881,2210913,2210945,2210977,2211009]),
  new Uint32Array([0,0,2105825,0,0,2111905,2105473,0,0,2112289,2108193,2112481,2112577,0,2098305,2108321]),
  new Uint32Array([0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([0,2097153,2134241,0,2132705,0,0,2131297,0,2133089,0,2133857,0,2220769,0,2235361]),
  new Uint32Array([14680064,14680064,14680064,14680064,14680064,14680064,14680064,14680064,14680064,14680064,14680064,14680064,14680064,6291456,6291456,14680064]),
  new Uint32Array([23068672,23068672,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,0,0,0,0,0]),
  new Uint32Array([2171873,6291456,2171905,6291456,2171937,6291456,2171969,6291456,2172001,6291456,2172033,6291456,2172065,6291456,2172097,6291456]),
  new Uint32Array([2220929,2220929,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2133857,2134145,2134145,2134145,2134145,2134241,2134241,2134241,2134241,2105889,2105889,2105889,2105889,2097185,2097185,2097185]),
  new Uint32Array([2173697,2173761,2173793,2174113,2173985,2173953,2148481,2173601,2173633,2173665,2173697,2173729,2148801,2173761,2143969,2173793]),
  new Uint32Array([0,0,0,0,0,0,0,0,0,0,0,0,10499619,10499715,10499811,10499907]),
  new Uint32Array([0,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([6291456,0,0,0,0,0,0,0,0,0,0,0,0,0,0,23068672]),
  new Uint32Array([6291456,6291456,6291456,6291456,0,0,0,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,0,0,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,6291456,6291456,0,6291456]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,6291456,6291456,6291456]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,0,23068672,23068672,23068672,0,23068672,23068672,23068672,23068672,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,6291456,23068672,23068672]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,0,0,0,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([6291456,23068672,23068672,23068672,23068672,23068672,23068672,23068672,2144322,2144386,2144450,2144514,2144578,2144642,2144706,2144770]),
  new Uint32Array([23068672,23068672,23068672,6291456,6291456,23068672,23068672,23068672,23068672,23068672,23068672,23068672,6291456,6291456,6291456,6291456]),
  new Uint32Array([2113153,2108481,2113345,2113441,2098209,2111137,0,2098241,2108353,2108417,2105825,0,0,2111905,2105473,2105569]),
  new Uint32Array([2236321,2236353,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([2152194,2121283,2103684,2103812,2097986,2098533,2097990,2098693,2098595,2098853,2099013,2103940,2121379,2121475,2121571,2104068]),
  new Uint32Array([2206241,2206273,2206305,2206337,2206369,2206401,2206433,2206465,2206497,2206529,2206561,2206593,2206625,2206657,2206689,2206721]),
  new Uint32Array([6291456,6291456,6291456,6291456,16777216,16777216,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,23068672,23068672,10538818,10538882,6291456,6291456,2150338]),
  new Uint32Array([6291456,6291456,6291456,0,0,0,0,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2214369,2214401,2214433,2214465,2214497,2214529,2214561,2214593,2194977,2214625,2195073,2214657,2214689,2214721,6291456,6291456]),
  new Uint32Array([2097152,2097152,2097152,2097152,0,0,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([2182081,6291456,2182113,6291456,2182145,6291456,2182177,6291456,2182209,6291456,2182241,6291456,2182273,6291456,2182305,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,2146881,2146945,2147009,2147073,2147137,2147201,2147265,2147329]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,6291456,23068672,23068672]),
  new Uint32Array([0,0,0,0,0,0,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2122915,2123011,2123107,2104708,2123203,2123299,2123395,2100133,2104836,2100290,2100293,2104962,2104964,2098052,2123491,2123587]),
  new Uint32Array([23068672,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,6291456]),
  new Uint32Array([6291456,2171169,6291456,2171201,6291456,2171233,6291456,2171265,6291456,2171297,6291456,2171329,6291456,6291456,2171361,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,0,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([0,0,2148994,2149058,2149122,0,6291456,2149186,2186945,2173537,2148993,2149121,2149058,10531458,10496066,0]),
  new Uint32Array([2195009,2195041,2195073,2195105,2195137,2195169,2195201,2195233,2195265,2195297,2195329,2195361,2195393,2195425,2195457,2195489]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,6291456,0,0,6291456,6291456]),
  new Uint32Array([2182849,6291456,2182881,6291456,2182913,6291456,2182945,6291456,2182977,6291456,2183009,6291456,2183041,6291456,2183073,6291456]),
  new Uint32Array([2211553,2210081,2211585,2211617,2211649,2211681,2211713,2211745,2211777,2211809,2209569,2211841,2211873,2211905,2211937,2211969]),
  new Uint32Array([2112577,2098177,2098305,2108321,2108289,2100865,2113153,2108481,2113345,2113441,2166594,2127298,2166658,2142978,2141827,2166722]),
  new Uint32Array([2173985,2173761,2174017,2174049,2174081,2174113,2174145,2174177,2149057,2233057,2148481,2173601,2173633,2173665,2173697,2173729]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,0,0,2185761,2185793,2185825,2185857,2185889,2185921,0,0]),
  new Uint32Array([6291456,2148481,2173601,2173633,2173665,2173697,2173729,2148801,2173761,2143969,2173793,2173825,2153473,2173857,2173889,2173921]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,0,0,6291456]),
  new Uint32Array([0,0,0,2220961,2220961,2220961,2220961,2144193,2144193,2159201,2159201,2159265,2159265,2144194,2220993,2220993]),
  new Uint32Array([2192641,2235393,2235425,2152257,2116609,2235457,2235489,2200065,2235521,2235553,2235585,2212449,2235617,2235649,2235681,2235713]),
  new Uint32Array([2194049,2194081,2194113,2194145,2194177,2194209,2194241,2194273,2194305,2194337,2194369,2194401,2194433,2194465,2194497,2194529]),
  new Uint32Array([2196673,2208641,2208673,2208705,2208737,2208769,2208801,2208833,2208865,2208897,2208929,2208961,2208993,2209025,2209057,2209089]),
  new Uint32Array([2191681,2191713,2191745,2191777,2153281,2191809,2191841,2191873,2191905,2191937,2191969,2192001,2192033,2192065,2192097,2192129]),
  new Uint32Array([2230946,2231010,2231074,2231138,2231202,2231266,2231330,2231394,2231458,2231522,2231586,2231650,2231714,2231778,2231842,2231906]),
  new Uint32Array([14680064,14680064,14680064,14680064,14680064,14680064,14680064,14680064,14680064,14680064,14680064,14680064,14680064,14680064,14680064,14680064]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,2185953,2185985,2186017,2186049,2186081,2186113,2186145,2186177]),
  new Uint32Array([2139811,2139907,2097284,2105860,2105988,2106116,2106244,2097444,2097604,2097155,10485778,10486344,2106372,6291456,0,0]),
  new Uint32Array([2110051,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([0,0,0,0,0,0,0,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2172385,6291456,2172417,6291456,2172449,6291456,2172481,6291456,2172513,6291456,2172545,6291456,2172577,6291456,2172609,6291456]),
  new Uint32Array([0,0,23068672,23068672,6291456,0,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([2249345,2249377,2249409,2249441,2249473,2249505,2249537,2249570,2210209,2249633,2249665,2249697,2249729,2249761,2249793,2216769]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,23068672,23068672,23068672,23068672]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,0,6291456,6291456,6291456,6291456]),
  new Uint32Array([2187169,2187201,2187233,2187265,2187297,2187329,2187361,2187393,2187425,2187457,2187489,2187521,2187553,2187585,2187617,2187649]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,23068672,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([0,0,0,6291456,6291456,0,0,0,6291456,6291456,6291456,0,0,0,6291456,6291456]),
  new Uint32Array([2182337,6291456,2182369,6291456,2182401,6291456,2182433,6291456,2182465,6291456,2182497,6291456,2182529,6291456,2182561,6291456]),
  new Uint32Array([2138179,2138275,2138371,2138467,2134243,2134435,2138563,2138659,2138755,2138851,2138947,2139043,2138947,2138755,2139139,2139235]),
  new Uint32Array([23068672,23068672,23068672,23068672,6291456,6291456,6291456,6291456,0,0,0,0,0,0,0,0]),
  new Uint32Array([0,0,23068672,23068672,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2250498,2250562,2250625,2250657,2208321,2250689,2250721,2250753,2250785,2250817,2250849,2218945,2250881,2250913,2250945,0]),
  new Uint32Array([2170369,2105569,2098305,2108481,2173249,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([23068672,23068672,23068672,23068672,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,6291456]),
  new Uint32Array([2100897,2111905,2105473,2105569,2105601,0,2108193,0,0,0,2098305,2108321,2108289,2100865,2113153,2108481]),
  new Uint32Array([2100897,2100897,2105569,2105569,6291456,2112289,2149826,6291456,6291456,2112481,2112577,2098177,2098177,2098177,6291456,6291456]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,0,0,6291456,6291456,6291456]),
  new Uint32Array([6291456,2169953,2169985,6291456,2170017,6291456,2170049,2170081,6291456,2170113,2170145,2170177,6291456,6291456,2170209,2170241]),
  new Uint32Array([6291456,6291456,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([0,0,0,0,0,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2220641,2220641,2220673,2220673,2220673,2220673,2220705,2220705,2220705,2220705,2220737,2220737,2220737,2220737,2220769,2220769]),
  new Uint32Array([2127650,2127746,2127842,2127938,2128034,2128130,2128226,2128322,2128418,2127523,2127619,2127715,2127811,2127907,2128003,2128099]),
  new Uint32Array([2143969,2173793,2173825,2153473,2173857,2173889,2173921,2173953,2173985,2173761,2174017,2174049,2174081,2174113,2174145,2174177]),
  new Uint32Array([0,0,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([2204705,2204737,2204769,2204801,2204833,2204865,2204897,2204929,2204961,2204993,2205025,2205057,2205089,2205121,2205153,2205185]),
  new Uint32Array([2176385,6291456,2176417,6291456,2176449,6291456,2176481,6291456,2176513,6291456,2176545,6291456,2176577,6291456,2176609,6291456]),
  new Uint32Array([2195521,2195553,2195585,2195617,2195649,2195681,2117857,2195713,2195745,2195777,2195809,2195841,2195873,2195905,2195937,2195969]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,0]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,6291456,6291456,6291456]),
  new Uint32Array([2173921,2173953,2173985,2174017,2174017,2174049,2174081,2174113,2174145,2174177,2149057,2233089,2173697,2173761,2173793,2174113]),
  new Uint32Array([2131586,2132450,2135970,2135778,2161602,2136162,2163650,2161794,2135586,2163714,2137186,2131810,2160290,2135170,2097506,2159554]),
  new Uint32Array([2134145,2097153,2134241,2105953,2132705,2130977,2160065,2131297,2162049,2133089,2160577,2133857,0,0,0,0]),
  new Uint32Array([2116513,2116609,2116705,2116801,2116897,2116993,2117089,2117185,2117281,2117377,2117473,2117569,2117665,2117761,2117857,2117953]),
  new Uint32Array([2100737,2098337,2101441,2101569,2101697,2101825,2101953,2102081,2102209,2100802,2101154,2101282,2101410,2101538,2101666,2101794]),
  new Uint32Array([2100289,2098657,2098049,2200737,2123489,2123681,2200769,2098625,2100321,2098145,2100449,2098017,2098753,2098977,2150241,2150305]),
  new Uint32Array([6291456,6291456,6291456,0,6291456,6291456,6291456,6291456,6291456,2109955,6291456,6291456,0,0,0,0]),
  new Uint32Array([18874368,18874368,18874368,18874368,18874368,18874368,18874368,18874368,18874368,18874368,18874368,18874368,18874368,18874368,18874368,18874368]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,6291456,0,6291456,0,0]),
  new Uint32Array([2130979,2131075,2131075,2131171,2131267,2131363,2131459,2131555,2131651,2131651,2131747,2131843,2131939,2132035,2132131,2132227]),
  new Uint32Array([0,2177793,6291456,2177825,6291456,2177857,6291456,2177889,6291456,2177921,6291456,2177953,6291456,2177985,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672]),
  new Uint32Array([6291456,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([2113345,0,2098209,2111137,2105505,2098241,2108353,2108417,2105825,2111713,2100897,2111905,2105473,2105569,2105601,2112289]),
  new Uint32Array([2136643,2136739,2136835,2136931,2137027,2137123,2137219,2137315,2137411,2137507,2137603,2137699,2137795,2137891,2137987,2138083]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0]),
  new Uint32Array([2174433,6291456,2174465,6291456,2174497,6291456,2174529,6291456,2174561,6291456,2174593,6291456,2174625,6291456,2174657,6291456]),
  new Uint32Array([0,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2105473,2105569,2105601,2112289,2108193,2112481,2112577,2098177,2098305,2108321,2108289,2100865,2113153,2108481,2113345,2113441]),
  new Uint32Array([10496547,10496643,2105505,2149698,6291456,10496739,10496835,2170273,6291456,2149762,2105825,2111713,2111713,2111713,2111713,2168673]),
  new Uint32Array([6291456,2143490,2143490,2143490,2171649,6291456,2171681,2171713,2171745,6291456,2171777,6291456,2171809,6291456,2171841,6291456]),
  new Uint32Array([2159106,2159106,2159170,2159170,2159234,2159234,2159298,2159298,2159298,2159362,2159362,2159362,2106401,2106401,2106401,2106401]),
  new Uint32Array([2105601,2112289,2108193,2112481,2112577,2098177,2098305,2108321,2108289,2100865,2113153,2108481,2113345,2113441,2098209,2111137]),
  new Uint32Array([2108417,2181217,2181249,2181281,2170433,2170401,2181313,2181345,2181377,2181409,2181441,2181473,2181505,2181537,2170529,2181569]),
  new Uint32Array([2218433,2245761,2245793,2245825,2245857,2245890,2245953,2245986,2209665,2246050,2246113,2246146,2246210,2246274,2246337,2246369]),
  new Uint32Array([2230754,2230818,2230882,0,0,0,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([6291456,0,6291456,6291456,6291456,6291456,0,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([6291456,0,0,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2184129,6291456,2184161,6291456,2184193,6291456,6291456,6291456,6291456,6291456,2146818,2183361,6291456,6291456,2142978,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2135170,2097506,2130691,2130787,2130883,2163970,2164034,2164098,2164162,2164226,2164290,2164354,2164418,2164482,2164546,2133122]),
  new Uint32Array([2108515,2108611,2100740,2108707,2108803,2108899,2108995,2109091,2109187,2109283,2109379,2109475,2109571,2109667,2109763,2100738]),
  new Uint32Array([2102788,2102916,2103044,2120515,2103172,2120611,2120707,2098373,2103300,2120803,2120899,2120995,2103428,2103556,2121091,2121187]),
  new Uint32Array([2158082,2158146,0,2158210,2158274,0,2158338,2158402,2158466,2129922,2158530,2158594,2158658,2158722,2158786,2158850]),
  new Uint32Array([10499619,10499715,10499811,10499907,10500003,10500099,10500195,10500291,10500387,10500483,10500579,10500675,10500771,10500867,10500963,10501059]),
  new Uint32Array([2239585,2239618,2239681,2239713,0,2191969,2239745,2239777,2192033,2239809,2239841,2239874,2239937,2239970,2240033,2240065]),
  new Uint32Array([2252705,2252738,2252801,2252833,2252865,2252897,2252930,2252994,2253057,2253089,2253121,2253154,2253217,2253250,2219361,2219361]),
  new Uint32Array([2105825,2111713,2100897,2111905,2105473,2105569,2105601,2112289,2108193,2112481,2112577,2098177,2098305,2108321,2108289,2100865]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,10538050,10538114,10538178,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([2226402,2226466,2226530,2226594,2226658,2226722,2226786,2226850,2226914,2226978,2227042,2227106,2227170,2227234,2227298,2227362]),
  new Uint32Array([23068672,6291456,6291456,6291456,6291456,2144066,2144130,2144194,2144258,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,23068672,23068672,23068672,6291456,23068672,23068672]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,0,0,0,0,0]),
  new Uint32Array([2124674,2124770,2123875,2123971,2124067,2124163,2124259,2124355,2124451,2124547,2124643,2124739,2124835,2124931,2125027,2125123]),
  new Uint32Array([2168065,6291456,2168097,6291456,2168129,6291456,2168161,6291456,2168193,6291456,2168225,6291456,2168257,6291456,2168289,6291456]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,0,0,0,0]),
  new Uint32Array([23068672,23068672,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,2100610,2100611,6291456,2107842,2107843,6291456,6291456,6291456,6291456,10537922,6291456,10537986,6291456]),
  new Uint32Array([2174849,2174881,2174913,2174945,2174977,2175009,2175041,2175073,2175105,2175137,2175169,2175201,2175233,2175265,2175297,2175329]),
  new Uint32Array([2154562,2154626,2154690,2154754,2141858,2154818,2154882,2127298,2154946,2127298,2155010,2155074,2155138,2155202,2155266,2155202]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,6291456,6291456,6291456,6291456,6291456,6291456,23068672,0]),
  new Uint32Array([2200641,2150786,2150850,2150914,2150978,2151042,2106562,2151106,2150562,2151170,2151234,2151298,2151362,2151426,2151490,2151554]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,23068672,0,0,0,0,0,0,0,0,6291456,6291456]),
  new Uint32Array([2220289,2220289,2220321,2220321,2220321,2220321,2220353,2220353,2220353,2220353,2220385,2220385,2220385,2220385,2220417,2220417]),
  new Uint32Array([2155330,2155394,0,2155458,2155522,2155586,2105732,0,2155650,2155714,2155778,2125314,2155842,2155906,2126274,2155970]),
  new Uint32Array([23068672,23068672,23068672,23068672,23068672,6291456,6291456,23068672,23068672,6291456,23068672,23068672,23068672,23068672,6291456,6291456]),
  new Uint32Array([6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,6291456,0,0,0,0,0,0]),
  new Uint32Array([2097729,2106017,2106017,2106017,2106017,2131297,2131297,2131297,2131297,2106081,2106081,2162049,2162049,2105953,2105953,2162337]),
  new Uint32Array([2097185,2097697,2097697,2097697,2097697,2135777,2135777,2135777,2135777,2097377,2097377,2097377,2097377,2097601,2097601,2097217]),
  new Uint32Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,23068672]),
  new Uint32Array([2139331,2139427,2139523,2139043,2133571,2132611,2139619,2139715,0,0,0,0,0,0,0,0]),
  new Uint32Array([2174113,2174145,2100897,2098177,2108289,2100865,2173601,2173633,2173985,2174113,2174145,6291456,6291456,6291456,6291456,6291456]),
  new Uint32Array([6291456,6291456,23068672,6291456,6291456,6291456,23068672,6291456,6291456,6291456,6291456,23068672,6291456,6291456,6291456,6291456]),
  new Uint32Array([23068672,23068672,18923778,23068672,23068672,23068672,23068672,18923842,23068672,23068672,23068672,23068672,18923906,23068672,23068672,23068672]),
  new Uint32Array([2134145,2097153,2134241,0,2132705,2130977,2160065,2131297,0,2133089,0,2133857,0,0,0,0]),
  new Uint32Array([6291456,6291456,6291456,6291456,0,0,0,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([2177537,6291456,2177569,6291456,2177601,6291456,2177633,6291456,2177665,6291456,2177697,6291456,2177729,6291456,2177761,6291456]),
  new Uint32Array([2212481,2212513,2212545,2212577,2197121,2212609,2212641,2212673,2212705,2212737,2212769,2212801,2212833,2212865,2212897,2212929]),
  new Uint32Array([6291456,6291456,23068672,23068672,23068672,6291456,6291456,0,0,0,0,0,0,0,0,0]),
  new Uint32Array([2098241,2108353,2170209,2105825,2111713,2100897,2111905,2105473,2105569,2105601,2112289,6291456,2108193,2172417,2112481,2098177]),
  new Uint32Array([6291456,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,23068672,6291456,6291456]),
];
var blockIdxes = new Uint16Array([616,616,565,147,161,411,330,2,131,131,328,454,241,408,86,86,696,113,285,350,325,301,473,214,639,232,447,64,369,598,124,672,567,223,621,154,107,86,86,86,86,86,86,505,86,68,634,86,218,218,218,218,486,218,218,513,188,608,216,86,217,463,668,85,700,360,184,86,86,86,647,402,153,10,346,718,662,260,145,298,117,1,443,342,138,54,563,86,240,572,218,70,387,86,118,460,641,602,86,86,306,218,86,692,86,86,86,86,86,162,707,86,458,26,86,218,638,86,86,86,86,86,65,449,86,86,306,183,86,58,391,667,86,157,131,131,131,131,86,433,131,406,31,218,247,86,86,693,218,581,351,86,438,295,69,462,45,126,173,650,14,295,69,97,168,187,641,78,523,390,69,108,287,664,173,219,83,295,69,108,431,426,173,694,412,115,628,52,257,398,641,118,501,121,69,579,151,423,173,620,464,121,69,382,151,476,173,27,53,121,86,594,578,226,173,86,632,130,86,96,228,268,641,622,563,86,86,21,148,650,131,131,321,43,144,343,381,531,131,131,178,20,86,399,156,375,164,541,30,60,715,198,92,118,131,131,86,86,306,407,86,280,457,196,488,358,131,131,244,86,86,143,86,86,86,86,86,667,563,86,86,86,86,86,86,86,86,86,86,86,86,86,336,363,86,86,336,86,86,380,678,67,86,86,86,678,86,86,86,512,86,307,86,708,86,86,86,86,86,528,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,563,307,86,86,86,86,86,104,450,337,86,720,86,32,450,397,86,86,86,587,218,558,708,708,293,708,86,86,86,86,86,694,205,86,8,86,86,86,86,549,86,667,697,697,679,86,458,460,86,86,650,86,708,543,86,86,86,245,86,86,86,140,218,127,708,708,458,197,131,131,131,131,500,86,86,483,251,86,306,510,515,86,722,86,86,86,65,201,86,86,483,580,470,86,86,86,368,131,131,131,694,114,110,555,86,86,123,721,163,142,713,418,86,317,675,209,218,218,218,371,545,592,629,490,603,199,46,320,525,680,310,279,388,111,42,252,593,607,235,617,410,377,50,548,135,356,17,520,189,116,392,600,349,332,482,699,690,535,119,106,451,71,152,667,131,218,218,265,671,637,492,504,533,683,269,269,658,86,86,86,86,86,86,86,86,86,491,619,86,86,6,86,86,86,86,86,86,86,86,86,86,86,229,86,86,86,86,86,86,86,86,86,86,86,86,667,86,86,171,131,118,131,656,206,234,571,89,334,670,246,311,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,534,86,86,86,86,86,86,82,86,86,86,86,86,430,86,86,86,86,86,86,86,86,86,599,86,324,86,470,69,640,264,131,626,101,174,86,86,667,233,105,73,374,394,221,204,84,28,326,86,86,471,86,86,86,109,573,86,171,200,200,200,200,218,218,86,86,86,86,460,131,131,131,86,506,86,86,86,86,86,220,404,34,614,47,442,305,25,612,338,601,648,7,344,255,131,131,51,86,312,507,563,86,86,86,86,588,86,86,86,86,86,530,511,86,458,3,435,384,556,522,230,527,86,118,86,86,717,86,137,273,79,181,484,23,93,112,655,249,417,703,370,87,98,313,684,585,155,465,596,481,695,18,416,428,61,701,706,282,643,495,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,549,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,549,131,131,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,307,86,86,86,171,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,650,131,422,542,420,263,24,172,86,86,86,86,86,566,86,86,132,540,395,353,494,519,19,485,284,472,131,131,131,16,714,86,211,708,86,86,86,694,698,86,86,483,704,708,218,272,86,86,120,86,159,478,86,307,247,86,86,663,597,459,627,667,86,86,277,455,39,302,86,250,86,86,86,271,99,452,306,281,329,400,200,86,86,362,549,352,646,461,323,586,86,86,4,708,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,717,86,518,86,86,650,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,125,554,480,300,613,72,333,288,561,544,604,48,719,91,169,176,590,224,76,191,29,559,560,231,537,166,477,538,256,437,131,131,469,167,40,0,685,266,441,705,239,642,475,568,640,610,299,673,517,318,385,22,202,180,179,359,424,215,90,66,521,653,467,682,453,409,479,88,131,661,35,303,15,262,666,630,712,131,131,618,659,175,218,195,347,193,227,261,150,165,709,546,294,569,710,270,413,376,524,55,242,38,419,529,170,657,3,304,122,379,278,131,651,86,67,576,458,458,131,131,86,86,86,86,86,86,86,118,309,86,86,547,86,86,86,86,667,650,664,131,131,86,86,56,131,131,131,131,131,131,131,131,86,307,86,86,86,664,238,650,86,86,717,86,118,86,86,315,86,59,86,86,574,549,131,131,340,57,436,86,86,86,86,86,86,458,708,499,691,62,86,650,86,86,694,86,86,86,319,131,131,131,131,131,131,131,131,131,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,171,86,549,694,131,131,131,131,131,131,131,131,131,77,86,86,139,86,502,86,86,86,667,595,131,131,131,86,12,86,13,86,609,131,131,131,131,86,86,86,625,86,669,86,86,182,129,86,5,694,104,86,86,86,86,131,131,86,86,386,171,86,86,86,345,86,324,86,589,86,213,36,131,131,131,131,131,86,86,86,86,104,131,131,131,141,290,80,677,86,86,86,267,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,86,667,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,515,86,86,33,136,669,86,711,515,86,86,550,640,86,104,708,515,86,159,372,717,86,86,444,515,86,86,663,37,86,563,460,86,390,624,702,131,131,131,131,389,59,708,86,86,341,208,708,635,295,69,108,431,508,100,190,131,131,131,131,131,131,131,131,86,86,86,649,516,660,131,131,86,86,86,218,631,708,131,131,131,131,131,131,131,131,131,131,86,86,341,575,238,514,131,131,86,86,86,218,291,708,307,131,86,86,306,367,708,131,131,131,86,378,697,86,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,615,253,86,86,86,292,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,86,86,86,104,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,69,86,341,553,549,86,307,86,86,645,275,455,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,708,131,131,131,131,131,131,86,86,86,86,86,86,667,460,86,86,86,86,86,86,86,86,86,86,86,86,717,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,667,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,171,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,104,86,667,459,131,131,131,131,131,131,86,458,225,86,86,86,516,549,11,390,405,86,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,86,86,86,86,460,44,218,197,711,515,131,131,131,131,664,131,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,307,131,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,308,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,640,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,86,86,86,86,86,86,118,307,104,286,591,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,549,86,86,681,86,86,75,185,314,582,86,358,496,474,86,104,131,86,86,86,86,146,131,131,131,131,131,131,131,131,131,131,131,86,86,86,86,86,171,86,640,131,131,131,131,131,131,131,131,246,503,689,339,674,81,258,415,439,128,562,366,414,246,503,689,583,222,557,316,636,665,186,355,95,670,246,503,689,339,674,557,258,415,439,186,355,95,670,246,503,689,446,644,536,652,331,532,335,440,274,421,297,570,74,425,364,425,606,552,403,509,134,365,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,218,218,218,498,218,218,577,627,551,497,572,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,553,354,236,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,86,86,86,86,86,86,86,86,86,86,86,86,296,455,131,131,456,243,103,86,41,459,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,9,276,158,716,393,564,383,489,401,654,210,654,131,131,131,640,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,86,86,650,86,86,86,86,86,86,717,667,563,563,563,86,549,102,686,133,246,605,86,448,86,86,207,307,131,131,131,641,86,177,611,445,373,194,584,131,131,131,131,131,131,131,131,131,131,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,308,307,171,86,86,86,86,86,86,86,717,86,86,86,86,86,460,131,131,650,86,86,86,694,708,86,86,694,86,458,131,131,131,131,131,131,667,694,289,650,667,131,131,86,640,131,131,664,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,171,131,131,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,460,86,86,86,86,86,86,86,86,86,86,86,86,86,458,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,640,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,466,203,149,429,94,432,160,687,539,63,237,283,192,248,348,259,427,526,396,676,254,468,487,212,327,623,49,633,322,493,434,688,357,361,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131,131]);
var mappingStr = "صلى الله عليه وسلمجل جلالهキロメートルrad∕s2エスクードキログラムキロワットグラムトンクルゼイロサンチームパーセントピアストルファラッドブッシェルヘクタールマンションミリバールレントゲン′′′′1⁄10viii(10)(11)(12)(13)(14)(15)(16)(17)(18)(19)(20)∫∫∫∫(오전)(오후)アパートアルファアンペアイニングエーカーカラットカロリーキュリーギルダークローネサイクルシリングバーレルフィートポイントマイクロミクロンメガトンリットルルーブル株式会社kcalm∕s2c∕kgاكبرمحمدصلعمرسولریال1⁄41⁄23⁄4 ̈́ྲཱྀླཱྀ ̈͂ ̓̀ ̓́ ̓͂ ̔̀ ̔́ ̔͂ ̈̀‵‵‵a/ca/sc/oc/utelfax1⁄71⁄91⁄32⁄31⁄52⁄53⁄54⁄51⁄65⁄61⁄83⁄85⁄87⁄8xii0⁄3∮∮∮(1)(2)(3)(4)(5)(6)(7)(8)(9)(a)(b)(c)(d)(e)(f)(g)(h)(i)(j)(k)(l)(m)(n)(o)(p)(q)(r)(s)(t)(u)(v)(w)(x)(y)(z)::====(ᄀ)(ᄂ)(ᄃ)(ᄅ)(ᄆ)(ᄇ)(ᄉ)(ᄋ)(ᄌ)(ᄎ)(ᄏ)(ᄐ)(ᄑ)(ᄒ)(가)(나)(다)(라)(마)(바)(사)(아)(자)(차)(카)(타)(파)(하)(주)(一)(二)(三)(四)(五)(六)(七)(八)(九)(十)(月)(火)(水)(木)(金)(土)(日)(株)(有)(社)(名)(特)(財)(祝)(労)(代)(呼)(学)(監)(企)(資)(協)(祭)(休)(自)(至)pte10月11月12月ergltdアールインチウォンオンスオームカイリガロンガンマギニーケースコルナコーポセンチダースノットハイツパーツピクルフランペニヒヘルツペンスページベータボルトポンドホールホーンマイルマッハマルクヤードヤールユアンルピー10点11点12点13点14点15点16点17点18点19点20点21点22点23点24点hpabardm2dm3khzmhzghzthzmm2cm2km2mm3cm3km3kpampagpalogmilmolppmv∕ma∕m10日11日12日13日14日15日16日17日18日19日20日21日22日23日24日25日26日27日28日29日30日31日galffifflשּׁשּׂ ٌّ ٍّ َّ ُّ ِّ ّٰـَّـُّـِّتجمتحجتحمتخمتمجتمحتمخجمححميحمىسحجسجحسجىسمحسمجسممصححصممشحمشجيشمخشممضحىضخمطمحطممطميعجمعممعمىغممغميغمىفخمقمحقمملحملحيلحىلججلخملمحمحجمحيمجحمجممخممجخهمجهممنحمنحىنجمنجىنمينمىيممبخيتجيتجىتخيتخىتميتمىجميجحىجمىسخىصحيشحيضحيلجيلمييحييجييميمميقمينحيعميكمينجحمخيلجمكممجحيحجيمجيفميبحيسخينجيصلےقلے𝅘𝅥𝅮𝅘𝅥𝅯𝅘𝅥𝅰𝅘𝅥𝅱𝅘𝅥𝅲𝆹𝅥𝅮𝆺𝅥𝅮𝆹𝅥𝅯𝆺𝅥𝅯〔s〕ppv〔本〕〔三〕〔二〕〔安〕〔点〕〔打〕〔盗〕〔勝〕〔敗〕 ̄ ́ ̧ssi̇ijl·ʼndžljnjdz ̆ ̇ ̊ ̨ ̃ ̋ ιեւاٴوٴۇٴيٴक़ख़ग़ज़ड़ढ़फ़य़ড়ঢ়য়ਲ਼ਸ਼ਖ਼ਗ਼ਜ਼ਫ਼ଡ଼ଢ଼ําໍາຫນຫມགྷཌྷདྷབྷཛྷཀྵཱཱིུྲྀླྀྒྷྜྷྡྷྦྷྫྷྐྵaʾἀιἁιἂιἃιἄιἅιἆιἇιἠιἡιἢιἣιἤιἥιἦιἧιὠιὡιὢιὣιὤιὥιὦιὧιὰιαιάιᾶι ͂ὴιηιήιῆιὼιωιώιῶι ̳!! ̅???!!?rs°c°fnosmtmivix⫝̸ ゙ ゚よりコト333435참고주의363738394042444546474849503月4月5月6月7月8月9月hgevギガデシドルナノピコビルペソホンリラレムdaauovpciu平成昭和大正明治naμakakbmbgbpfnfμfμgmgμlmldlklfmnmμmpsnsμsmsnvμvkvpwnwμwmwkwkωmωbqcccddbgyhainkkktlnlxphprsrsvwbstմնմեմիվնմխיִײַשׁשׂאַאָאּבּגּדּהּוּזּטּיּךּכּלּמּנּסּףּפּצּקּרּתּוֹבֿכֿפֿאלئائەئوئۇئۆئۈئېئىئجئحئمئيبجبمبىبيتىتيثجثمثىثيخحضجضمطحظمغجفجفحفىفيقحقىقيكاكجكحكخكلكىكينخنىنيهجهىهييىذٰرٰىٰئرئزئنبزبنترتزتنثرثزثنمانرنزننيريزئخئهبهتهصخنههٰثهسهشهطىطيعىعيغىغيسىسيشىشيصىصيضىضيشخشرسرصرضراً ًـًـّ ْـْلآلألإ𝅗𝅥0,1,2,3,4,5,6,7,8,9,wzhvsdwcmcmddjほかココàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþāăąćĉċčďđēĕėęěĝğġģĥħĩīĭįĵķĺļľłńņňŋōŏőœŕŗřśŝşšţťŧũūŭůűųŵŷÿźżɓƃƅɔƈɖɗƌǝəɛƒɠɣɩɨƙɯɲɵơƣƥʀƨʃƭʈưʊʋƴƶʒƹƽǎǐǒǔǖǘǚǜǟǡǣǥǧǩǫǭǯǵƕƿǹǻǽǿȁȃȅȇȉȋȍȏȑȓȕȗșțȝȟƞȣȥȧȩȫȭȯȱȳⱥȼƚⱦɂƀʉʌɇɉɋɍɏɦɹɻʁʕͱͳʹͷ;ϳέίόύβγδεζθκλνξοπρστυφχψϊϋϗϙϛϝϟϡϣϥϧϩϫϭϯϸϻͻͼͽѐёђѓєѕіїјљњћќѝўџабвгдежзийклмнопрстуфхцчшщъыьэюяѡѣѥѧѩѫѭѯѱѳѵѷѹѻѽѿҁҋҍҏґғҕҗҙқҝҟҡңҥҧҩҫҭүұҳҵҷҹһҽҿӂӄӆӈӊӌӎӑӓӕӗәӛӝӟӡӣӥӧөӫӭӯӱӳӵӷӹӻӽӿԁԃԅԇԉԋԍԏԑԓԕԗԙԛԝԟԡԣԥԧԩԫԭԯաբգդզէըթժլծկհձղճյշոչպջռստրցփքօֆ་ⴧⴭნᏰᏱᏲᏳᏴᏵꙋɐɑᴂɜᴖᴗᴝᴥɒɕɟɡɥɪᵻʝɭᶅʟɱɰɳɴɸʂƫᴜʐʑḁḃḅḇḉḋḍḏḑḓḕḗḙḛḝḟḡḣḥḧḩḫḭḯḱḳḵḷḹḻḽḿṁṃṅṇṉṋṍṏṑṓṕṗṙṛṝṟṡṣṥṧṩṫṭṯṱṳṵṷṹṻṽṿẁẃẅẇẉẋẍẏẑẓẕạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹỻỽỿἐἑἒἓἔἕἰἱἲἳἴἵἶἷὀὁὂὃὄὅὑὓὕὗᾰᾱὲΐῐῑὶΰῠῡὺῥ`ὸ‐+−∑〈〉ⰰⰱⰲⰳⰴⰵⰶⰷⰸⰹⰺⰻⰼⰽⰾⰿⱀⱁⱂⱃⱄⱅⱆⱇⱈⱉⱊⱋⱌⱍⱎⱏⱐⱑⱒⱓⱔⱕⱖⱗⱘⱙⱚⱛⱜⱝⱞⱡɫᵽɽⱨⱪⱬⱳⱶȿɀⲁⲃⲅⲇⲉⲋⲍⲏⲑⲓⲕⲗⲙⲛⲝⲟⲡⲣⲥⲧⲩⲫⲭⲯⲱⲳⲵⲷⲹⲻⲽⲿⳁⳃⳅⳇⳉⳋⳍⳏⳑⳓⳕⳗⳙⳛⳝⳟⳡⳣⳬⳮⳳⵡ母龟丨丶丿乙亅亠人儿入冂冖冫几凵刀力勹匕匚匸卜卩厂厶又口囗士夂夊夕女子宀寸小尢尸屮山巛工己巾干幺广廴廾弋弓彐彡彳心戈戶手支攴文斗斤方无曰欠止歹殳毋比毛氏气爪父爻爿片牙牛犬玄玉瓜瓦甘生用田疋疒癶白皮皿目矛矢石示禸禾穴立竹米糸缶网羊羽老而耒耳聿肉臣臼舌舛舟艮色艸虍虫血行衣襾見角言谷豆豕豸貝赤走足身車辛辰辵邑酉釆里長門阜隶隹雨靑非面革韋韭音頁風飛食首香馬骨高髟鬥鬯鬲鬼魚鳥鹵鹿麥麻黃黍黑黹黽鼎鼓鼠鼻齊齒龍龜龠.〒卄卅ᄁᆪᆬᆭᄄᆰᆱᆲᆳᆴᆵᄚᄈᄡᄊ짜ᅢᅣᅤᅥᅦᅧᅨᅩᅪᅫᅬᅭᅮᅯᅰᅱᅲᅳᅴᅵᄔᄕᇇᇈᇌᇎᇓᇗᇙᄜᇝᇟᄝᄞᄠᄢᄣᄧᄩᄫᄬᄭᄮᄯᄲᄶᅀᅇᅌᇱᇲᅗᅘᅙᆄᆅᆈᆑᆒᆔᆞᆡ上中下甲丙丁天地問幼箏우秘男適優印注項写左右医宗夜テヌモヨヰヱヲꙁꙃꙅꙇꙉꙍꙏꙑꙓꙕꙗꙙꙛꙝꙟꙡꙣꙥꙧꙩꙫꙭꚁꚃꚅꚇꚉꚋꚍꚏꚑꚓꚕꚗꚙꚛꜣꜥꜧꜩꜫꜭꜯꜳꜵꜷꜹꜻꜽꜿꝁꝃꝅꝇꝉꝋꝍꝏꝑꝓꝕꝗꝙꝛꝝꝟꝡꝣꝥꝧꝩꝫꝭꝯꝺꝼᵹꝿꞁꞃꞅꞇꞌꞑꞓꞗꞙꞛꞝꞟꞡꞣꞥꞧꞩɬʞʇꭓꞵꞷꬷꭒᎠᎡᎢᎣᎤᎥᎦᎧᎨᎩᎪᎫᎬᎭᎮᎯᎰᎱᎲᎳᎴᎵᎶᎷᎸᎹᎺᎻᎼᎽᎾᎿᏀᏁᏂᏃᏄᏅᏆᏇᏈᏉᏊᏋᏌᏍᏎᏏᏐᏑᏒᏓᏔᏕᏖᏗᏘᏙᏚᏛᏜᏝᏞᏟᏠᏡᏢᏣᏤᏥᏦᏧᏨᏩᏪᏫᏬᏭᏮᏯ豈更賈滑串句契喇奈懶癩羅蘿螺裸邏樂洛烙珞落酪駱亂卵欄爛蘭鸞嵐濫藍襤拉臘蠟廊朗浪狼郎來冷勞擄櫓爐盧蘆虜路露魯鷺碌祿綠菉錄論壟弄籠聾牢磊賂雷壘屢樓淚漏累縷陋勒肋凜凌稜綾菱陵讀拏諾丹寧怒率異北磻便復不泌數索參塞省葉說殺沈拾若掠略亮兩凉梁糧良諒量勵呂廬旅濾礪閭驪麗黎曆歷轢年憐戀撚漣煉璉秊練聯輦蓮連鍊列劣咽烈裂廉念捻殮簾獵令囹嶺怜玲瑩羚聆鈴零靈領例禮醴隸惡了僚寮尿料燎療蓼遼暈阮劉杻柳流溜琉留硫紐類戮陸倫崙淪輪律慄栗隆利吏履易李梨泥理痢罹裏裡離匿溺吝燐璘藺隣鱗麟林淋臨笠粒狀炙識什茶刺切度拓糖宅洞暴輻降廓兀嗀塚晴凞猪益礼神祥福靖精蘒諸逸都飯飼館鶴郞隷侮僧免勉勤卑喝嘆器塀墨層悔慨憎懲敏既暑梅海渚漢煮爫琢碑祉祈祐祖禍禎穀突節縉繁署者臭艹著褐視謁謹賓贈辶難響頻恵𤋮舘並况全侀充冀勇勺啕喙嗢墳奄奔婢嬨廒廙彩徭惘慎愈慠戴揄搜摒敖望杖滛滋瀞瞧爵犯瑱甆画瘝瘟盛直睊着磌窱类絛缾荒華蝹襁覆調請諭變輸遲醙鉶陼韛頋鬒𢡊𢡄𣏕㮝䀘䀹𥉉𥳐𧻓齃龎עםٱٻپڀٺٿٹڤڦڄڃچڇڍڌڎڈژڑکگڳڱںڻۀہھۓڭۋۅۉ、〖〗—–_{}【】《》「」『』[]#&*-<>\\$%@ءؤة\"'^|~⦅⦆・ゥャ¢£¬¦¥₩│←↑→↓■○𐐨𐐩𐐪𐐫𐐬𐐭𐐮𐐯𐐰𐐱𐐲𐐳𐐴𐐵𐐶𐐷𐐸𐐹𐐺𐐻𐐼𐐽𐐾𐐿𐑀𐑁𐑂𐑃𐑄𐑅𐑆𐑇𐑈𐑉𐑊𐑋𐑌𐑍𐑎𐑏𐓘𐓙𐓚𐓛𐓜𐓝𐓞𐓟𐓠𐓡𐓢𐓣𐓤𐓥𐓦𐓧𐓨𐓩𐓪𐓫𐓬𐓭𐓮𐓯𐓰𐓱𐓲𐓳𐓴𐓵𐓶𐓷𐓸𐓹𐓺𐓻𐳀𐳁𐳂𐳃𐳄𐳅𐳆𐳇𐳈𐳉𐳊𐳋𐳌𐳍𐳎𐳏𐳐𐳑𐳒𐳓𐳔𐳕𐳖𐳗𐳘𐳙𐳚𐳛𐳜𐳝𐳞𐳟𐳠𐳡𐳢𐳣𐳤𐳥𐳦𐳧𐳨𐳩𐳪𐳫𐳬𐳭𐳮𐳯𐳰𐳱𐳲𑣀𑣁𑣂𑣃𑣄𑣅𑣆𑣇𑣈𑣉𑣊𑣋𑣌𑣍𑣎𑣏𑣐𑣑𑣒𑣓𑣔𑣕𑣖𑣗𑣘𑣙𑣚𑣛𑣜𑣝𑣞𑣟ıȷ∇∂𞤢𞤣𞤤𞤥𞤦𞤧𞤨𞤩𞤪𞤫𞤬𞤭𞤮𞤯𞤰𞤱𞤲𞤳𞤴𞤵𞤶𞤷𞤸𞤹𞤺𞤻𞤼𞤽𞤾𞤿𞥀𞥁𞥂𞥃ٮڡٯ字双多解交映無前後再新初終販声吹演投捕遊指禁空合満申割営配得可丽丸乁𠄢你侻倂偺備像㒞𠘺兔兤具𠔜㒹內𠕋冗冤仌冬𩇟刃㓟刻剆剷㔕包匆卉博即卽卿𠨬灰及叟𠭣叫叱吆咞吸呈周咢哶唐啓啣善喫喳嗂圖圗噑噴壮城埴堍型堲報墬𡓤売壷夆夢奢𡚨𡛪姬娛娧姘婦㛮嬈嬾𡧈寃寘寳𡬘寿将㞁屠峀岍𡷤嵃𡷦嵮嵫嵼巡巢㠯巽帨帽幩㡢𢆃㡼庰庳庶𪎒𢌱舁弢㣇𣊸𦇚形彫㣣徚忍志忹悁㤺㤜𢛔惇慈慌慺憲憤憯懞戛扝抱拔捐𢬌挽拼捨掃揤𢯱搢揅掩㨮摩摾撝摷㩬敬𣀊旣書晉㬙㬈㫤冒冕最暜肭䏙朡杞杓𣏃㭉柺枅桒𣑭梎栟椔楂榣槪檨𣚣櫛㰘次𣢧歔㱎歲殟殻𣪍𡴋𣫺汎𣲼沿泍汧洖派浩浸涅𣴞洴港湮㴳滇𣻑淹潮𣽞𣾎濆瀹瀛㶖灊災灷炭𠔥煅𤉣熜爨牐𤘈犀犕𤜵𤠔獺王㺬玥㺸瑇瑜璅瓊㼛甤𤰶甾𤲒𢆟瘐𤾡𤾸𥁄㿼䀈𥃳𥃲𥄙𥄳眞真瞋䁆䂖𥐝硎䃣𥘦𥚚𥛅秫䄯穊穏𥥼𥪧䈂𥮫篆築䈧𥲀糒䊠糨糣紀𥾆絣䌁緇縂繅䌴𦈨𦉇䍙𦋙罺𦌾羕翺𦓚𦔣聠𦖨聰𣍟䏕育脃䐋脾媵𦞧𦞵𣎓𣎜舄辞䑫芑芋芝劳花芳芽苦𦬼茝荣莭茣莽菧荓菊菌菜𦰶𦵫𦳕䔫蓱蓳蔖𧏊蕤𦼬䕝䕡𦾱𧃒䕫虐虧虩蚩蚈蜎蛢蜨蝫螆蟡蠁䗹衠𧙧裗裞䘵裺㒻𧢮𧥦䚾䛇誠𧲨貫賁贛起𧼯𠠄跋趼跰𠣞軔𨗒𨗭邔郱鄑𨜮鄛鈸鋗鋘鉼鏹鐕𨯺開䦕閷𨵷䧦雃嶲霣𩅅𩈚䩮䩶韠𩐊䪲𩒖頩𩖶飢䬳餩馧駂駾䯎𩬰鱀鳽䳎䳭鵧𪃎䳸𪄅𪈎𪊑䵖黾鼅鼏鼖𪘀";

function mapChar(codePoint) {
  if (codePoint >= 0x30000) {
    // High planes are special cased.
    if (codePoint >= 0xE0100 && codePoint <= 0xE01EF)
      return 18874368;
    return 0;
  }
  return blocks[blockIdxes[codePoint >> 4]][codePoint & 15];
}

return {
  mapStr: mappingStr,
  mapChar: mapChar
};
}));

},{}],23:[function(require,module,exports){
/* istanbul ignore next */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['punycode', './idna-map'], function (punycode, idna_map) {
      return factory(punycode, idna_map);
    });
  } else if (typeof exports === 'object') {
    module.exports = factory(require('punycode'), require('./idna-map'));
  } else {
    root.uts46 = factory(root.punycode, root.idna_map);
  }
}(this, function (punycode, idna_map) {

function mapLabel(label, useStd3ASCII, transitional) {
  var mapped = [];
  for (var ch of label) {
    var cp = ch.codePointAt(0);
    var composite = idna_map.mapChar(cp);
    var flags = (composite >> 23);
    var kind = (composite >> 21) & 3;
    var index = (composite >> 5) & 0xffff;
    var length = composite & 0x1f;
    var value = idna_map.mapStr.substr(index, length);
    if (kind == 0 || (useStd3ASCII && (flags & 1))) {
      throw new Error("Illegal char " + ch);
    } else if (kind == 1) {
      mapped.push(value);
    } else if (kind == 2) {
      mapped.push(transitional ? value : ch);
    } else if (kind == 3) {
      mapped.push(ch);
    }
  }

  var newLabel = mapped.join("").normalize("NFC");
  return newLabel;
}

function process(domain, transitional, useStd3ASCII) {
  if (useStd3ASCII === undefined)
      useStd3ASCII = false;
  var mappedIDNA = mapLabel(domain, useStd3ASCII, transitional);

  // Step 3. Break
  var labels = mappedIDNA.split(".");

  // Step 4. Convert/Validate
  labels = labels.map(function (label) {
    if (label.startsWith("xn--")) {
      label = punycode.decode(label.substring(4));
      validateLabel(label, useStd3ASCII, false);
    } else {
      validateLabel(label, useStd3ASCII, transitional);
    }
    return label;
  });

  return labels.join(".");
}

function validateLabel(label, useStd3ASCII, transitional) {
  // 2. The label must not contain a U+002D HYPHEN-MINUS character in both the
  // third position and fourth positions.
  if (label[2] == '-' && label[3] == '-')
    throw new Error("Failed to validate " + label);

  // 3. The label must neither begin nor end with a U+002D HYPHEN-MINUS
  // character.
  if (label.startsWith('-') || label.endsWith('-'))
    throw new Error("Failed to validate " + label);

  // 4. The label must not contain a U+002E ( . ) FULL STOP.
  if (label.includes('.'))
    throw new Error("Failed to validate " + label);

  if (mapLabel(label, useStd3ASCII, transitional) != label)
    throw new Error("Failed to validate " + label);

  // 5. The label must not begin with a combining mark, that is:
  // General_Category=Mark.
  var ch = label.codePointAt(0);
  if (idna_map.mapChar(ch) & (0x2 << 23))
    throw new Error("Label contains illegal character: " + ch);
}

function toAscii(domain, options) {
  if (options === undefined)
    options = { };
  var transitional = 'transitional' in options ? options.transitional : true;
  var useStd3ASCII = 'useStd3ASCII' in options ? options.useStd3ASCII : false;
  var verifyDnsLength = 'verifyDnsLength' in options ? options.verifyDnsLength : false;
  var labels = process(domain, transitional, useStd3ASCII).split('.');
  var asciiLabels = labels.map(punycode.toASCII);
  var asciiString = asciiLabels.join('.');
  if (verifyDnsLength) {
    if (asciiString.length < 1 || asciiString.length > 253) {
      throw new Error("DNS name has wrong length: " + asciiString);
    }
    for (var label of asciiLabels) {
      if (label.length < 1 || label.length > 63)
        throw new Error("DNS label has wrong length: " + label);
    }
  }
  return asciiString;
}

function toUnicode(domain, options) {
  if (options === undefined)
    options = { };
  var useStd3ASCII = 'useStd3ASCII' in options ? options.useStd3ASCII : false;
  return process(domain, false, useStd3ASCII);
}

return {
  toUnicode: toUnicode,
  toAscii: toAscii,
};
}));

},{"./idna-map":22,"punycode":29}],24:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],25:[function(require,module,exports){
/**
 * Returns a `Boolean` on whether or not the a `String` starts with '0x'
 * @param {String} str the string input value
 * @return {Boolean} a boolean if it is or is not hex prefixed
 * @throws if the str input is not a string
 */
module.exports = function isHexPrefixed(str) {
  if (typeof str !== 'string') {
    throw new Error("[is-hex-prefixed] value must be type 'string', is currently type " + (typeof str) + ", while checking isHexPrefixed.");
  }

  return str.slice(0, 2) === '0x';
}

},{}],26:[function(require,module,exports){
(function (process,global){
/**
 * [js-sha3]{@link https://github.com/emn178/js-sha3}
 *
 * @version 0.5.5
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2015-2016
 * @license MIT
 */
(function (root) {
  'use strict';

  var NODE_JS = typeof process == 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = global;
  }
  var COMMON_JS = !root.JS_SHA3_TEST && typeof module == 'object' && module.exports;
  var HEX_CHARS = '0123456789abcdef'.split('');
  var SHAKE_PADDING = [31, 7936, 2031616, 520093696];
  var KECCAK_PADDING = [1, 256, 65536, 16777216];
  var PADDING = [6, 1536, 393216, 100663296];
  var SHIFT = [0, 8, 16, 24];
  var RC = [1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648, 32907, 0, 2147483649,
            0, 2147516545, 2147483648, 32777, 2147483648, 138, 0, 136, 0, 2147516425, 0, 
            2147483658, 0, 2147516555, 0, 139, 2147483648, 32905, 2147483648, 32771, 
            2147483648, 32770, 2147483648, 128, 2147483648, 32778, 0, 2147483658, 2147483648,
            2147516545, 2147483648, 32896, 2147483648, 2147483649, 0, 2147516424, 2147483648];
  var BITS = [224, 256, 384, 512];
  var SHAKE_BITS = [128, 256];
  var OUTPUT_TYPES = ['hex', 'buffer', 'arrayBuffer', 'array'];

  var createOutputMethod = function (bits, padding, outputType) {
    return function (message) {
      return new Keccak(bits, padding, bits).update(message)[outputType]();
    }
  };

  var createShakeOutputMethod = function (bits, padding, outputType) {
    return function (message, outputBits) {
      return new Keccak(bits, padding, outputBits).update(message)[outputType]();
    }
  };

  var createMethod = function (bits, padding) {
    var method = createOutputMethod(bits, padding, 'hex');
    method.create = function () {
      return new Keccak(bits, padding, bits);
    };
    method.update = function (message) {
      return method.create().update(message);
    };
    for (var i = 0;i < OUTPUT_TYPES.length;++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createOutputMethod(bits, padding, type);
    }
    return method;
  };

  var createShakeMethod = function (bits, padding) {
    var method = createShakeOutputMethod(bits, padding, 'hex');
    method.create = function (outputBits) {
      return new Keccak(bits, padding, outputBits);
    };
    method.update = function (message, outputBits) {
      return method.create(outputBits).update(message);
    };
    for (var i = 0;i < OUTPUT_TYPES.length;++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createShakeOutputMethod(bits, padding, type);
    }
    return method;
  };

  var algorithms = [
    {name: 'keccak', padding: KECCAK_PADDING, bits: BITS, createMethod: createMethod},
    {name: 'sha3', padding: PADDING, bits: BITS, createMethod: createMethod},
    {name: 'shake', padding: SHAKE_PADDING, bits: SHAKE_BITS, createMethod: createShakeMethod}
  ];

  var methods = {};

  for (var i = 0;i < algorithms.length;++i) {
    var algorithm = algorithms[i];
    var bits  = algorithm.bits;
    for (var j = 0;j < bits.length;++j) {
      methods[algorithm.name +'_' + bits[j]] = algorithm.createMethod(bits[j], algorithm.padding);
    }
  }

  function Keccak(bits, padding, outputBits) {
    this.blocks = [];
    this.s = [];
    this.padding = padding;
    this.outputBits = outputBits;
    this.reset = true;
    this.block = 0;
    this.start = 0;
    this.blockCount = (1600 - (bits << 1)) >> 5;
    this.byteCount = this.blockCount << 2;
    this.outputBlocks = outputBits >> 5;
    this.extraBytes = (outputBits & 31) >> 3;

    for (var i = 0;i < 50;++i) {
      this.s[i] = 0;
    }
  };

  Keccak.prototype.update = function (message) {
    var notString = typeof message != 'string';
    if (notString && message.constructor == root.ArrayBuffer) {
      message = new Uint8Array(message);
    }
    var length = message.length, blocks = this.blocks, byteCount = this.byteCount, 
        blockCount = this.blockCount, index = 0, s = this.s, i, code;
    
    while (index < length) {
      if (this.reset) {
        this.reset = false;
        blocks[0] = this.block;
        for (i = 1;i < blockCount + 1;++i) {
          blocks[i] = 0;
        }
      }
      if (notString) {
        for (i = this.start;index < length && i < byteCount;++index) {
          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
        }
      } else {
        for (i = this.start;index < length && i < byteCount;++index) {
          code = message.charCodeAt(index);
          if (code < 0x80) {
            blocks[i >> 2] |= code << SHIFT[i++ & 3];
          } else if (code < 0x800) {
            blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else if (code < 0xd800 || code >= 0xe000) {
            blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else {
            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
            blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          }
        }
      }
      this.lastByteIndex = i;
      if (i >= byteCount) {
        this.start = i - byteCount;
        this.block = blocks[blockCount];
        for (i = 0;i < blockCount;++i) {
          s[i] ^= blocks[i];
        }
        f(s);
        this.reset = true;
      } else {
        this.start = i;
      }
    }
    return this;
  };

  Keccak.prototype.finalize = function () {
    var blocks = this.blocks, i = this.lastByteIndex, blockCount = this.blockCount, s = this.s;
    blocks[i >> 2] |= this.padding[i & 3];
    if (this.lastByteIndex == this.byteCount) {
      blocks[0] = blocks[blockCount];
      for (i = 1;i < blockCount + 1;++i) {
        blocks[i] = 0;
      }
    }
    blocks[blockCount - 1] |= 0x80000000;
    for (i = 0;i < blockCount;++i) {
      s[i] ^= blocks[i];
    }
    f(s);
  };

  Keccak.prototype.toString = Keccak.prototype.hex = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks, 
        extraBytes = this.extraBytes, i = 0, j = 0;
    var hex = '', block;
    while (j < outputBlocks) {
      for (i = 0;i < blockCount && j < outputBlocks;++i, ++j) {
        block = s[i];
        hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F] +
               HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F] +
               HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F] +
               HEX_CHARS[(block >> 28) & 0x0F] + HEX_CHARS[(block >> 24) & 0x0F];
      }
      if (j % blockCount == 0) {
        f(s);
        i = 0;
      }
    }
    if (extraBytes) {
      block = s[i];
      if (extraBytes > 0) {
        hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F];
      }
      if (extraBytes > 1) {
        hex += HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F];
      }
      if (extraBytes > 2) {
        hex += HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F];
      }
    }
    return hex;
  };

  Keccak.prototype.arrayBuffer = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks, 
        extraBytes = this.extraBytes, i = 0, j = 0;
    var bytes = this.outputBits >> 3;
    var buffer;
    if (extraBytes) {
      buffer = new ArrayBuffer((outputBlocks + 1) << 2);
    } else {
      buffer = new ArrayBuffer(bytes);
    }
    var array = new Uint32Array(buffer);
    while (j < outputBlocks) {
      for (i = 0;i < blockCount && j < outputBlocks;++i, ++j) {
        array[j] = s[i];
      }
      if (j % blockCount == 0) {
        f(s);
      }
    }
    if (extraBytes) {
      array[i] = s[i];
      buffer = buffer.slice(0, bytes);
    }
    return buffer;
  };

  Keccak.prototype.buffer = Keccak.prototype.arrayBuffer;

  Keccak.prototype.digest = Keccak.prototype.array = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks, 
        extraBytes = this.extraBytes, i = 0, j = 0;
    var array = [], offset, block;
    while (j < outputBlocks) {
      for (i = 0;i < blockCount && j < outputBlocks;++i, ++j) {
        offset = j << 2;
        block = s[i];
        array[offset] = block & 0xFF;
        array[offset + 1] = (block >> 8) & 0xFF;
        array[offset + 2] = (block >> 16) & 0xFF;
        array[offset + 3] = (block >> 24) & 0xFF;
      }
      if (j % blockCount == 0) {
        f(s);
      }
    }
    if (extraBytes) {
      offset = j << 2;
      block = s[i];
      if (extraBytes > 0) {
        array[offset] = block & 0xFF;
      }
      if (extraBytes > 1) {
        array[offset + 1] = (block >> 8) & 0xFF;
      }
      if (extraBytes > 2) {
        array[offset + 2] = (block >> 16) & 0xFF;
      }
    }
    return array;
  };

  var f = function (s) {
    var h, l, n, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, 
        b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17, 
        b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, 
        b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49;
    for (n = 0;n < 48;n += 2) {
      c0 = s[0] ^ s[10] ^ s[20] ^ s[30] ^ s[40];
      c1 = s[1] ^ s[11] ^ s[21] ^ s[31] ^ s[41];
      c2 = s[2] ^ s[12] ^ s[22] ^ s[32] ^ s[42];
      c3 = s[3] ^ s[13] ^ s[23] ^ s[33] ^ s[43];
      c4 = s[4] ^ s[14] ^ s[24] ^ s[34] ^ s[44];
      c5 = s[5] ^ s[15] ^ s[25] ^ s[35] ^ s[45];
      c6 = s[6] ^ s[16] ^ s[26] ^ s[36] ^ s[46];
      c7 = s[7] ^ s[17] ^ s[27] ^ s[37] ^ s[47];
      c8 = s[8] ^ s[18] ^ s[28] ^ s[38] ^ s[48];
      c9 = s[9] ^ s[19] ^ s[29] ^ s[39] ^ s[49];

      h = c8 ^ ((c2 << 1) | (c3 >>> 31));
      l = c9 ^ ((c3 << 1) | (c2 >>> 31));
      s[0] ^= h;
      s[1] ^= l;
      s[10] ^= h;
      s[11] ^= l;
      s[20] ^= h;
      s[21] ^= l;
      s[30] ^= h;
      s[31] ^= l;
      s[40] ^= h;
      s[41] ^= l;
      h = c0 ^ ((c4 << 1) | (c5 >>> 31));
      l = c1 ^ ((c5 << 1) | (c4 >>> 31));
      s[2] ^= h;
      s[3] ^= l;
      s[12] ^= h;
      s[13] ^= l;
      s[22] ^= h;
      s[23] ^= l;
      s[32] ^= h;
      s[33] ^= l;
      s[42] ^= h;
      s[43] ^= l;
      h = c2 ^ ((c6 << 1) | (c7 >>> 31));
      l = c3 ^ ((c7 << 1) | (c6 >>> 31));
      s[4] ^= h;
      s[5] ^= l;
      s[14] ^= h;
      s[15] ^= l;
      s[24] ^= h;
      s[25] ^= l;
      s[34] ^= h;
      s[35] ^= l;
      s[44] ^= h;
      s[45] ^= l;
      h = c4 ^ ((c8 << 1) | (c9 >>> 31));
      l = c5 ^ ((c9 << 1) | (c8 >>> 31));
      s[6] ^= h;
      s[7] ^= l;
      s[16] ^= h;
      s[17] ^= l;
      s[26] ^= h;
      s[27] ^= l;
      s[36] ^= h;
      s[37] ^= l;
      s[46] ^= h;
      s[47] ^= l;
      h = c6 ^ ((c0 << 1) | (c1 >>> 31));
      l = c7 ^ ((c1 << 1) | (c0 >>> 31));
      s[8] ^= h;
      s[9] ^= l;
      s[18] ^= h;
      s[19] ^= l;
      s[28] ^= h;
      s[29] ^= l;
      s[38] ^= h;
      s[39] ^= l;
      s[48] ^= h;
      s[49] ^= l;

      b0 = s[0];
      b1 = s[1];
      b32 = (s[11] << 4) | (s[10] >>> 28);
      b33 = (s[10] << 4) | (s[11] >>> 28);
      b14 = (s[20] << 3) | (s[21] >>> 29);
      b15 = (s[21] << 3) | (s[20] >>> 29);
      b46 = (s[31] << 9) | (s[30] >>> 23);
      b47 = (s[30] << 9) | (s[31] >>> 23);
      b28 = (s[40] << 18) | (s[41] >>> 14);
      b29 = (s[41] << 18) | (s[40] >>> 14);
      b20 = (s[2] << 1) | (s[3] >>> 31);
      b21 = (s[3] << 1) | (s[2] >>> 31);
      b2 = (s[13] << 12) | (s[12] >>> 20);
      b3 = (s[12] << 12) | (s[13] >>> 20);
      b34 = (s[22] << 10) | (s[23] >>> 22);
      b35 = (s[23] << 10) | (s[22] >>> 22);
      b16 = (s[33] << 13) | (s[32] >>> 19);
      b17 = (s[32] << 13) | (s[33] >>> 19);
      b48 = (s[42] << 2) | (s[43] >>> 30);
      b49 = (s[43] << 2) | (s[42] >>> 30);
      b40 = (s[5] << 30) | (s[4] >>> 2);
      b41 = (s[4] << 30) | (s[5] >>> 2);
      b22 = (s[14] << 6) | (s[15] >>> 26);
      b23 = (s[15] << 6) | (s[14] >>> 26);
      b4 = (s[25] << 11) | (s[24] >>> 21);
      b5 = (s[24] << 11) | (s[25] >>> 21);
      b36 = (s[34] << 15) | (s[35] >>> 17);
      b37 = (s[35] << 15) | (s[34] >>> 17);
      b18 = (s[45] << 29) | (s[44] >>> 3);
      b19 = (s[44] << 29) | (s[45] >>> 3);
      b10 = (s[6] << 28) | (s[7] >>> 4);
      b11 = (s[7] << 28) | (s[6] >>> 4);
      b42 = (s[17] << 23) | (s[16] >>> 9);
      b43 = (s[16] << 23) | (s[17] >>> 9);
      b24 = (s[26] << 25) | (s[27] >>> 7);
      b25 = (s[27] << 25) | (s[26] >>> 7);
      b6 = (s[36] << 21) | (s[37] >>> 11);
      b7 = (s[37] << 21) | (s[36] >>> 11);
      b38 = (s[47] << 24) | (s[46] >>> 8);
      b39 = (s[46] << 24) | (s[47] >>> 8);
      b30 = (s[8] << 27) | (s[9] >>> 5);
      b31 = (s[9] << 27) | (s[8] >>> 5);
      b12 = (s[18] << 20) | (s[19] >>> 12);
      b13 = (s[19] << 20) | (s[18] >>> 12);
      b44 = (s[29] << 7) | (s[28] >>> 25);
      b45 = (s[28] << 7) | (s[29] >>> 25);
      b26 = (s[38] << 8) | (s[39] >>> 24);
      b27 = (s[39] << 8) | (s[38] >>> 24);
      b8 = (s[48] << 14) | (s[49] >>> 18);
      b9 = (s[49] << 14) | (s[48] >>> 18);

      s[0] = b0 ^ (~b2 & b4);
      s[1] = b1 ^ (~b3 & b5);
      s[10] = b10 ^ (~b12 & b14);
      s[11] = b11 ^ (~b13 & b15);
      s[20] = b20 ^ (~b22 & b24);
      s[21] = b21 ^ (~b23 & b25);
      s[30] = b30 ^ (~b32 & b34);
      s[31] = b31 ^ (~b33 & b35);
      s[40] = b40 ^ (~b42 & b44);
      s[41] = b41 ^ (~b43 & b45);
      s[2] = b2 ^ (~b4 & b6);
      s[3] = b3 ^ (~b5 & b7);
      s[12] = b12 ^ (~b14 & b16);
      s[13] = b13 ^ (~b15 & b17);
      s[22] = b22 ^ (~b24 & b26);
      s[23] = b23 ^ (~b25 & b27);
      s[32] = b32 ^ (~b34 & b36);
      s[33] = b33 ^ (~b35 & b37);
      s[42] = b42 ^ (~b44 & b46);
      s[43] = b43 ^ (~b45 & b47);
      s[4] = b4 ^ (~b6 & b8);
      s[5] = b5 ^ (~b7 & b9);
      s[14] = b14 ^ (~b16 & b18);
      s[15] = b15 ^ (~b17 & b19);
      s[24] = b24 ^ (~b26 & b28);
      s[25] = b25 ^ (~b27 & b29);
      s[34] = b34 ^ (~b36 & b38);
      s[35] = b35 ^ (~b37 & b39);
      s[44] = b44 ^ (~b46 & b48);
      s[45] = b45 ^ (~b47 & b49);
      s[6] = b6 ^ (~b8 & b0);
      s[7] = b7 ^ (~b9 & b1);
      s[16] = b16 ^ (~b18 & b10);
      s[17] = b17 ^ (~b19 & b11);
      s[26] = b26 ^ (~b28 & b20);
      s[27] = b27 ^ (~b29 & b21);
      s[36] = b36 ^ (~b38 & b30);
      s[37] = b37 ^ (~b39 & b31);
      s[46] = b46 ^ (~b48 & b40);
      s[47] = b47 ^ (~b49 & b41);
      s[8] = b8 ^ (~b0 & b2);
      s[9] = b9 ^ (~b1 & b3);
      s[18] = b18 ^ (~b10 & b12);
      s[19] = b19 ^ (~b11 & b13);
      s[28] = b28 ^ (~b20 & b22);
      s[29] = b29 ^ (~b21 & b23);
      s[38] = b38 ^ (~b30 & b32);
      s[39] = b39 ^ (~b31 & b33);
      s[48] = b48 ^ (~b40 & b42);
      s[49] = b49 ^ (~b41 & b43);

      s[0] ^= RC[n];
      s[1] ^= RC[n + 1];
    }
  }

  if (COMMON_JS) {
    module.exports = methods;
  } else if (root) {
    for (var key in methods) {
      root[key] = methods[key];
    }
  }
}(this));

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":28}],27:[function(require,module,exports){
var BN = require('bn.js');
var stripHexPrefix = require('strip-hex-prefix');

/**
 * Returns a BN object, converts a number value to a BN
 * @param {String|Number|Object} `arg` input a string number, hex string number, number, BigNumber or BN object
 * @return {Object} `output` BN object of the number
 * @throws if the argument is not an array, object that isn't a bignumber, not a string number or number
 */
module.exports = function numberToBN(arg) {
  if (typeof arg === 'string' || typeof arg === 'number') {
    var multiplier = new BN(1); // eslint-disable-line
    var formattedString = String(arg).toLowerCase().trim();
    var isHexPrefixed = formattedString.substr(0, 2) === '0x' || formattedString.substr(0, 3) === '-0x';
    var stringArg = stripHexPrefix(formattedString); // eslint-disable-line
    if (stringArg.substr(0, 1) === '-') {
      stringArg = stripHexPrefix(stringArg.slice(1));
      multiplier = new BN(-1, 10);
    }
    stringArg = stringArg === '' ? '0' : stringArg;

    if ((!stringArg.match(/^-?[0-9]+$/) && stringArg.match(/^[0-9A-Fa-f]+$/))
      || stringArg.match(/^[a-fA-F]+$/)
      || (isHexPrefixed === true && stringArg.match(/^[0-9A-Fa-f]+$/))) {
      return new BN(stringArg, 16).mul(multiplier);
    }

    if ((stringArg.match(/^-?[0-9]+$/) || stringArg === '') && isHexPrefixed === false) {
      return new BN(stringArg, 10).mul(multiplier);
    }
  } else if (typeof arg === 'object' && arg.toString && (!arg.pop && !arg.push)) {
    if (arg.toString(10).match(/^-?[0-9]+$/) && (arg.mul || arg.dividedToIntegerBy)) {
      return new BN(arg.toString(10), 10);
    }
  }

  throw new Error('[number-to-bn] while converting number ' + JSON.stringify(arg) + ' to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported.');
}

},{"bn.js":7,"strip-hex-prefix":30}],28:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],29:[function(require,module,exports){
(function (global){
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],30:[function(require,module,exports){
var isHexPrefixed = require('is-hex-prefixed');

/**
 * Removes '0x' from a given `String` is present
 * @param {String} str the string value
 * @return {String|Optional} a string by pass if necessary
 */
module.exports = function stripHexPrefix(str) {
  if (typeof str !== 'string') {
    return str;
  }

  return isHexPrefixed(str) ? str.slice(2) : str;
}

},{"is-hex-prefixed":25}],31:[function(require,module,exports){
module.exports = XMLHttpRequest;

},{}]},{},[4]);
