const test = require('tape')
const HttpProvider = require('ethjs-provider-http')
const provider = new HttpProvider('https://mainnet.infura.io')

const ENS = require('../')
const ens = new ENS({ provider, network: '1' })
test('not providing a network throws', function (t) {
  t.plan(1)
  t.throws(function() {
    const sample = new ENS({ provider })
  })
})

test('not providing a provider throws', function (t) {
  t.plan(1)
  t.throws(function() {
    const sample = new ENS({ network: '1' })
  })
})

test('lookup apt-get.eth', function (t) {
  t.plan(1)

  ens.lookup('apt-get.eth')
  .then((address) => {
    const expected = '0xd1ccfbf0a0dc2a9ed8a496b07e81dd8ecd7cb00e'
    t.equal(address, expected)
    t.end()
  })
  .catch((reason) => {
    t.ok(false)
  })
})

test('getOwner for nobodywantsthisdomain.eth', function (t) {
  t.plan(1)

  ens.getOwner('nobodywantsthisdomain.eth')
  .then((owner) => {
    console.log('it is owned ', owner)
    t.ok(owner)
    t.end()
  })
  .catch((reason) => {
    t.equal(reason.message, 'ENS name not found.')
  })
})

test('getOwner empty name', function (t) {
  t.plan(1)

  ens.getOwner('')
  .catch((reason) => {
    t.equal(reason.message, 'ENS name not found.')
  })
})

test('getResolver empty name', function (t) {
  t.plan(1)

  ens.getOwner('')
  .catch((reason) => {
    t.equal(reason.message, 'ENS name not found.')
  })
})

test('reverse vitalik.eth address should return address', function (t) {
  t.plan(1)

  const address = '0xd1ccfbf0a0dc2a9ed8a496b07e81dd8ecd7cb00e'
  ens.reverse(address)
  .then((name) => {
    const expected = 'vitalik.eth'
    t.equal(name, expected)
  })
  .catch((reason) => {
    t.ok(false, reason)
  })
})

test('lookup nobodywantsthisdomain.eth address', function (t) {
  t.plan(1)

  ens.lookup('nobodywantsthisdomain.eth')
  .catch((reason) => {
    t.equal(reason.message, 'ENS name not found.')
  })
})

test('lookup bar.eth address', function (t) {
  t.plan(1)

  ens.lookup('bar.eth')
  .then((address) => {
    t.equal(address, '0xd0b85aad460f5835c2349fbdd065b2389c921ce1')
  })
  .catch((reason) => {
    t.equal(reason.message, 'ENS name not found.')
  })
})

test('lookup empty address', function (t) {
  t.plan(1)

  ens.lookup('')
  .catch((reason) => {
    t.equal(reason.message, 'ENS name not found.')
  })
})

