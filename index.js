// External Deps
const Eth = require('ethjs-query')
const EthContract = require('ethjs-contract')
const namehash = require('eth-ens-namehash')

// ABIs
const registryAbi = require('./abis/registry.json')
const resolverAbi = require('./abis/resolver.json')

// Map network to known ENS registries
const networkMap = require('./lib/network-map.json')
const emptyHash = '0x0000000000000000000000000000000000000000000000000000000000000000'
const emptyAddr = '0x0000000000000000000000000000000000000000'

const NotFoundError = new Error('ENS name not found.')
const ResolverNotFound = new Error('ENS resolver not found.')

class Ens {

  constructor (opts = {}) {
    const { provider, network } = opts
    let { registryAddress } = opts

    // Validations
    if (!provider) {
      throw new Error('The EthJsENS Constructor requires a provider.')
    }

    // Requires EITHER a network or a registryAddress
    if (!network && !registryAddress) {
      throw new Error('The EthJsENS Constructor requires a network or registry address.')
    }

    this.provider = provider
    this.eth = new Eth(this.provider)
    this.contract = new EthContract(this.eth)
    this.namehash = namehash

    this.network = String(network)
    if (!(this.network in networkMap)) {
      throw new Error('No registry for current network.')
    }

    // Link to Registry
    this.Registry = this.contract(registryAbi)
    if (!registryAddress && network) {
      registryAddress = networkMap[this.network].registry
    }
    this.registry = this.Registry.at(registryAddress)

    // Create Resolver class
    this.Resolver = this.contract(resolverAbi)
  }

  lookup (name = '') {
    const node = namehash(name)
    if (node === emptyHash) {
      return Promise.reject(NotFoundError)
    }

    return this.resolveAddressForNode(node)
    .catch((reason) => {
      if (reason === ResolverNotFound) {
        return this.getOwnerForNode(node)
      }
      throw reason
    })
  }

  getOwner (name = '') {
    const node = namehash(name)
    return this.getOwnerForNode(node)
  }

  getOwnerForNode (node) {
    if (node === emptyHash) {
      return Promise.reject(NotFoundError)
    }
    return this.registry.owner(node)
    .then((result) => {
      const ownerAddress = result[0]
      if (ownerAddress === emptyAddr) {
        throw NotFoundError
      }

      return ownerAddress
    })
  }

  getResolver (name = '') {
    const node = namehash(name)
    if (node === emptyHash) {
      return Promise.reject(NotFoundError)
    }

    return this.getResolverForNode(node)
  }

  getResolverForNode (node) {
    if (!node.startsWith('0x')) {
      node = `0x${node}`
    }

    return this.registry.resolver(node)
    .then((result) => {
      const resolverAddress = result[0]
      if (resolverAddress === emptyAddr) {
        throw ResolverNotFound
      }

      return resolverAddress
    })
  }

  resolveAddressForNode (node) {
    return this.getResolverForNode(node)
    .then((resolverAddress) => {
      const resolver = this.Resolver.at(resolverAddress)
      return resolver.addr(node)
    })
    .then(result => result[0])
    .catch((reason) => {
      if (reason === ResolverNotFound) {
        return this.getOwnerForNode(node)
      }
      throw reason
    })
  }

  reverse (address) {
    if (!address) {
      throw new Error('Must supply an address to reverse lookup.')
    }

    if (address.startsWith('0x')) {
      address = address.slice(2)
    }

    const name = `${address.toLowerCase()}.addr.reverse`
    return this.lookup(name)
  }

}

module.exports = Ens
