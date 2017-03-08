// External Deps
const Eth = require('ethjs-query')
const EthContract = require('ethjs-contract')
const namehash = require('eth-ens-namehash')
const EventEmitter = require('events').EventEmitter

// ABIs
const registryAbi = require('./abis/registry.json')
const resolverAbi = require('./abis/resolver.json')

// Map network to known ENS registries
const networkMap = require('./lib/network-map.json')

class Ens extends EventEmitter {

  constructor (opts = {}) {
    super()
    let { provider, network } = opts

    // Validations
    if (!provider) {
      throw new Error('The EthJsENS Constructor requires a provider.')
    }
    if (!network) {
      throw new Error('The EthJsENS Constructor requires a network.')
    }

    this.provider = provider
    this.eth = new Eth(this.provider)
    this.contract = new EthContract(this.eth)

    this.network = String(network)
    if (!(this.network in networkMap)) {
      return this.emit('error', new Error('No registry for current network.'))
    }

    // Link to Registry
    this.Registry = this.contract(registryAbi)
    const registryAddress = networkMap[this.network].registry
    this.registry = this.Registry.at(registryAddress)

    // Link to Resolver
    this.Resolver = this.contract(resolverAbi)
    const resolverAddress = networkMap[this.network].resolver
    this.resolver = this.Resolver.at(resolverAddress)
  }

  lookup (name = '') {
    const node = namehash(name)
    return this.registry.owner(node)
    .then((ownerAddress) => {
      return ownerAddress[0]
    })
  }

}

module.exports = Ens
