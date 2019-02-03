'use strict'
const shuffle = require('lodash/shuffle')
const take = require('lodash/take')
const pluralize = require('pluralize')

class Vanir {

    async setUp (container, options) {
        const logger = container.resolvePlugin('logger')
        logger.info('[VANIR] Overwriting transaction broadcast function with Vanir')
        
        const p2p = container.resolvePlugin('p2p')

        container.resolvePlugin('p2p').broadcastTransactions = async (transactions) => {

            // Filter transactions, based on the public keys in the config
            transactions = transactions.filter(transaction => !options.pubkeys.includes(transaction.senderPublicKey))

            // Regular broadcast function, corresponds to original p2p.broadcastTransactions
            const maxPeersBroadcast = container.resolveOptions('p2p').maxPeersBroadcast
            const peers = take(shuffle(p2p.getPeers()), maxPeersBroadcast)

            logger.debug(
                `[VANIR] Broadcasting ${pluralize(
                    'transaction',
                    transactions.length,
                    true,
                )} to ${pluralize('peer', peers.length, true)}`,
            )

            transactions = transactions.map(tx => tx.toJson())
            return Promise.all(peers.map(peer => peer.postTransactions(transactions)))
        }
    }
}

module.exports = new Vanir()