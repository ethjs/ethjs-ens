const test = require('tape')
const HttpProvider = require('ethjs-provider-http')
const provider = new HttpProvider('https://ropsten.infura.io')

const ENS = require('../')
const ens = new ENS({ provider, network: '3' })

test('not providing a network throws', function (t) {
  t.plan(1)
  t.throws(function() {
    const sample = new ENS({ provider })
  })
})

test('not providing a provider throws', function (t) {
  t.plan(1)
  t.throws(function() {
    const sample = new ENS({ network: '3' })
  })
})

test('getOwner vitalik.eth resolver', function (t) {
  t.plan(1)

  ens.getOwner('vitalik.eth')
  .then((address) => {
    const expected = '0x5f8f68a0d1cbc75f6ef764a44619277092c32df0'
    t.equal(address, expected)
  })
})

test('getOwner nobodywantsthisdomain.eth resolver', function (t) {
  t.plan(1)

  ens.getOwner('nobodywantsthisdomain.eth')
  .catch((reason) => {
    t.equal(reason.message, 'ENS name not found.')
  })
})

test('getOwner empty resolver', function (t) {
  t.plan(1)

  ens.getOwner('')
  .catch((reason) => {
    t.equal(reason.message, 'ENS name not found.')
  })
})

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

/*
test('reverse lookup vitalik.eth', function (t) {
  t.plan(1)

  ens.reverse('0x5f8f68a0d1cbc75f6ef764a44619277092c32df0')
  .then((address) => {
    const expected = 'vitalik.eth'
    console.log('returned ' + address)
    t.equal(address, expected)
  })
  .catch((reason) => {
    console.log('failed bc ', reason)
  })
})
*/
