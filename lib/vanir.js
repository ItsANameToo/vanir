'use strict'
const shuffle = require('lodash/shuffle')
const take = require('lodash/take')
const pluralize = require('pluralize')

class Vanir {

    async setUp (container, options) {
        const logger = container.resolvePlugin('logger')
        logger.info('Overwriting broadcast function with Vanir')
        
        const p2p = container.resolvePlugin('p2p')

        container.resolvePlugin('p2p').broadcastTransactions = async (transactions) => {

            // Filter transactions
            transactions = transactions.filter(transaction => ![
                'PUBKEY', // TODO: move to config
            ].includes(transaction.senderPublicKey))

            // Regular broadcast function, corresponds to original p2p.broadcastTransactions
            const maxPeersBroadcast = container.resolveOptions('p2p').maxPeersBroadcast
            const peers = take(shuffle(p2p.getPeers()), maxPeersBroadcast)

            logger.debug(
                `Broadcasting ${pluralize(
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