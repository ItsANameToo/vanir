'use strict'

const shuffle = require('lodash/shuffle')
const take = require('lodash/take')
const pluralize = require('pluralize')

exports.plugin = {
    pkg: require('../package.json'),
    defaults: {
        enabled: false,
        publicKeys: []
    },
    async register (container, options) {
        if (!options.enabled) {
            return
        }

        const logger = container.resolvePlugin('logger')
        logger.info('[VANIR] Overwriting transaction broadcast function with Vanir')

        const p2p = container.resolvePlugin('p2p')

        container.resolvePlugin('p2p').broadcastTransactions = async transactions => {
            // Filter transactions, based on the public keys in the config
            transactions = transactions.filter(transaction => !options.publicKeys.includes(transaction.senderPublicKey))

            if (!transactions.length) {
                return;
            }

            // Regular broadcast function, corresponds to original p2p.broadcastTransactions
            const peers = take(shuffle(p2p.getPeers()), p2p.maxPeersBroadcast)

            logger.debug(
                `[VANIR] Broadcasting ${pluralize(
                    'transaction',
                    transactions.length,
                    true,
                )} to ${pluralize('peer', peers.length, true)}`,
            )

            return Promise.all(peers.map(peer => peer.postTransactions(transactions.map(tx => tx.toJson()))))
        }
    }
}
