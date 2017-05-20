const ENS = require('../')
const HttpProvider = require('ethjs-provider-http')
let ens

// For MetaMask or Mist compatibility:
window.addEventListener('load', function() {
  if (typeof window.web3 !== 'undefined') {
    console.log('web3 browser detected, using.')
    ens = new ENS({ provider: web3.currentProvider, network: '3' })
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
