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

test('getOwner for vitalik.eth', function (t) {
  t.plan(1)

  ens.getOwner('vitalik.eth')
  .then((address) => {
    const expected = '0x5f8f68a0d1cbc75f6ef764a44619277092c32df0'
    t.equal(address, expected)
  })
})

test('getOwner for nobodywantsthisdomain.eth', function (t) {
  t.plan(1)

  ens.getOwner('nobodywantsthisdomain.eth')
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

test('lookup resolver for node', function (t) {
  t.plan(1)

  ens.getResolverForNode('b14f00d09893a6ac3c1afa508fb7cd5ccfb7be4482df12738a0e93f95811c99c')
  .then((address) => {
    const expected = '0x71e122fc87aa184b966dfaaa81f9f37f45da9bae'
    t.equal(address, expected)
  })
})

test('#resolveAddressForNode on ropsten', function (t) {
  t.plan(1)

  const node = '0xb14f00d09893a6ac3c1afa508fb7cd5ccfb7be4482df12738a0e93f95811c99c'
  const expected = '0x7cb57b5a97eabe94205c07890be4c1ad31e486a8'

  ens.resolveAddressForNode(node)
  .then((address) => {
    t.equal(address, expected)
  })
})

test('lookup eth owner', function (t) {
  t.plan(1)

  ens.getOwner('eth')
  .then((address) => {
    const expected = '0xc68de5b43c3d980b0c110a77a5f78d3c4c4d63b4'
    t.equal(address, expected)
  })
})

test('lookup vitalik.eth address', function (t) {
  t.plan(1)

  ens.lookup('vitalik.eth')
  .then((address) => {
    const expected = '0x5f8f68a0d1cbc75f6ef764a44619277092c32df0'
    t.equal(address, expected)
  })
})

test('lookup nobodywantsthisdomain.eth address', function (t) {
  t.plan(1)

  ens.lookup('nobodywantsthisdomain.eth')
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

/*
test('reverse lookup vitalik.eth', function (t) {
  t.plan(1)

  ens.reverse('0x5f8f68a0d1cbc75f6ef764a44619277092c32df0')
  .then((address) => {
    const expected = 'vitalik.eth'
    t.equal(address, expected)
  })
  .catch((reason) => {
  })
})
*/
