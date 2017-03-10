const test = require('tape')

const Eth = require('ethjs-query')
const EthContract = require('ethjs-contract')
const Web3 = require('web3')
const fs = require('fs');
const solc = require('solc');
const TestRPC = require('ethereumjs-testrpc');
const ENS = require('../')

const emptyAddress = '0x0000000000000000000000000000000000000000'

const provider = TestRPC.provider()
const eth = new Eth(provider)
const web3 = new Web3(provider)
const contract = new EthContract(eth)

const registryAbi = require('../abis/registry.json')
const resolverAbi = require('../abis/resolver.json')
const source = fs.readFileSync(__dirname + '/ens.sol').toString();
const compiled = solc.compile(source, 1)
const deployer = compiled.contracts[':DeployENS']
let deploy, ensRoot, ens, accounts, deployRoot

test('setup', { timeout: 5000 }, function (t) {

  eth.accounts()
  .then((result) => {
    accounts = result
    console.log(`primary account: ${accounts[0]}`)

    const interface = JSON.parse(deployer.interface)
    var deployensContract = web3.eth.contract(JSON.parse(deployer.interface));

    // Deploy the contract
    const deployens = deployensContract.new({
      from: accounts[0],
      data: deployer.bytecode,
      gas: 4700000,
    }, function(err, cont) {
      t.notOk(err, 'deploying contract should not throw error')

      // We don't need the second callback.
      if (cont.address) return

      const txHash = cont.transactionHash
      pollForTransaction(txHash)
      .then((tx) => {
        deployRoot = tx.contractAddress

        const EthjsDeploy = contract(interface)
        const ethjsDeploy = EthjsDeploy.at(deployRoot)

        return ethjsDeploy.ens()
      })
      .then((addr) => {
        ensRoot = addr[0]
        console.log('virtual ens live at ' + ensRoot)
        ens = new ENS({ provider, registryAddress: ensRoot })
        t.ok(true)
        t.end()
      })
    })
  })
})

test('#getResolver() with invalid name should throw', function (t) {
  ens.getResolver('havasupai.eth')
  .catch((result) => {
    t.equal(result.message, 'ENS resolver not found.')
    t.end()
  })
})

test('#getResolver() should get resolver addresses', function (t) {
  ens.getResolver('foo.eth')
  .then((result) => {
    t.notEqual(result, emptyAddress)
    t.end()
  })
})

test('#lookup() should get resolver addresses', function (t) {
  ens.lookup('foo.eth')
  .then((result) => {
    t.notEqual(result, emptyAddress)
    t.end()
  })
})

test('#lookup() with bad name should throw', function (t) {
  ens.lookup('cardassian.eth')
  .catch((reason) => {
    t.equal(reason.message, 'ENS name not found.')
    t.end()
  })
})

test('#reverse() on deployRoot', function (t) {
  ens.lookup('deployer.eth')
  .then(address => ens.reverse(address))
  .then((result) => {
    t.equal(result, 'deployer.eth')
    t.end()
  })
  .catch((reason) => {
    console.log('reverse on deployroot failed', reason)
  })
})

test('#reverse() looks up name for an address', function (t) {
  ens.getResolverAddress('foo.eth')
  .then((address) => {
    console.log('foo.eth resolver is ' + address)
    console.dir(address)
    return ens.reverse(address)
  })
  .then((reverse) => {
    console.log('reverse is ' + reverse)
    console.dir(reverse)
    t.equal(reverse, 'deployer.eth')
    t.end()
  })
  .catch((reason) => {
    console.log('failed baceause ', reason)
  })
})

function pollForTransaction(txHash) {
  let tx
  return eth.getTransactionReceipt(txHash)
  .then((result) => {
    if (!result) {
      return pollForTransaction(txHash)
    }
    return result
  })
}

/*
test('not providing a network throws', function (t) {
  console.log(accounts)
  t.plan(1)
  t.throws(function() {
    const sample = new ENS({ provider })
  })
})

/*
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

test('getResolver resistance.eth', function (t) {
  t.plan(1)

  const node = ens.namehash('resistance.eth')
  ens.getResolverForNode(node)
  .then((address) => {
    const expected = '0x4c641fb9bad9b60ef180c31f56051ce826d21a9a'
    t.equal(address, expected)
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

test('lookup resistance.eth address', function (t) {
  t.plan(1)

  ens.lookup('vitalik.eth')
  .then((address) => {
    const expected = '0x5f8f68a0d1cbc75f6ef764a44619277092c32df0'
    t.equal(address, expected)
  })
})

test('lookup vitalik.eth address should fail to owner', function (t) {
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

test('lookup bar.eth address', function (t) {
  t.plan(1)

  ens.lookup('bar.eth')
  .then((address) => {
    console.log('BAR ETH: ' + address)
    t.equal(address, '0xd0b85aad460f5835c2349fbdd065b2389c921ce1')
  })
  .catch((reason) => {
    console.log('VACATION RENTALS FAIL')
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

