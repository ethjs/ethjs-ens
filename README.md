# EthJS ENS [![CircleCI](https://circleci.com/gh/flyswatter/ethjs-ens.svg?style=svg)](https://circleci.com/gh/flyswatter/ethjs-ens)

A convenience interface for using the Ethereum Name Service, based on the [EthJS contract abstraction](https://github.com/ethjs/ethjs-contract).

[Live Demo](https://flyswatter.github.io/ethjs-ens)

## Installation

Install from npm:

`npm install ethjs-ens --save`

## Usage

```javascript
const ENS = require('../')
const HttpProvider = require('ethjs-provider-http')

// For MetaMask or Mist compatibility:
if (typeof window.web3 !== 'undefined') {
  setupEns(web3.currentProvider)
} else {
  const provider = new HttpProvider('https://ropsten.infura.io')
  setupEns(provider)
}

function setupEns (provider) {

  // Currently requires both provider and network params:
  const ens = new ENS({ provider, network: '3' })

  ens.lookup('vitalik.eth')
  .then((address) => {
    const expected = '0x5f8f68a0d1cbc75f6ef764a44619277092c32df0'

    if (address === expected) {
      alert("That's how you do it!")
    }
  })
  .catch((reason) => {
    // There was an issue!
    // Maybe the name wasn't registered!
    console.error(reason)
  })
}
```

## Available APIs

### ens.lookup( name )

Takes a valid [ENS](https://ens.readthedocs.io/en/latest/introduction.html) name, like `vitalik.eth`, or `some.specialname.eth`.

Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolves to a hex-prefixed hexadecimal string for the resolved address.

If a matching name can not be found, will throw:

```javascript
new Error('ENS name not found.')
```

### ens.registry

An [ethjs contract](https://github.com/flyswatter/ethjs-ens) instance initialized for the specified network's address.

Implements the registry interface specified in [EIP 137](https://github.com/ethereum/EIPs/issues/137):

```
function owner(bytes32 node) constant returns (address);
Returns the owner (registrar) of the specified node.

function resolver(bytes32 node) constant returns (address);
Returns the resolver for the specified node.

function ttl(bytes32 node) constant returns (uint64);
```

## Current Supported Networks

Network support is added by adding a registry for that network to the [network map](./lib/network-map.json).

- Ropsten (id 3)
