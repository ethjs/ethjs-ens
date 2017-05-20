const ENS = require('../')
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
    const provider = new HttpProvider('https://miannet.infura.io')
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
