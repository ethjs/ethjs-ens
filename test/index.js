const test = require('tape')
const HttpProvider = require('ethjs-provider-http')
const provider = new HttpProvider('https://ropsten.infura.io')

const ENS = require('../')
const ens = new ENS({ provider, network: '3' })

test('lookup vitalik.eth resolver', function (t) {
  t.plan(1)

  ens.lookup('vitalik.eth')
  .then((address) => {
    const expected = '0x5f8f68a0d1cbc75f6ef764a44619277092c32df0'
    t.equal(address, expected)
  })
})

test('lookup nobodywantsthisdomain.eth resolver', function (t) {
  t.plan(1)

  ens.lookup('nobodywantsthisdomain.eth')
  .catch((reason) => {
    t.equal(reason.message, 'ENS name not found.')
  })
})

test('lookup empty resolver', function (t) {
  t.plan(1)

  ens.lookup('')
  .catch((reason) => {
    t.equal(reason.message, 'ENS name not found.')
  })
})

