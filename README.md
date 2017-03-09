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

