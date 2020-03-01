'use strict'

const { Identities } = require('@arkecosystem/crypto')

const shuffle = require('lodash/shuffle')
const take = require('lodash/take')
const pluralize = require('pluralize')

exports.plugin = {
    pkg: require('../package.json'),
    defaults: {
        enabled: false,
        overrideNotForging: false,
        publicKeys: [],
    },
    async register (container, options) {
        if (!options.enabled) {
            return
        }

        const delegates = (container.getConfig().get('delegates.secrets') || []).map(passphrase => {
            return Identities.PublicKey.fromPassphrase(passphrase)
        })

        if (!delegates.length) {
            logger.info('[VANIR] No delegates configured on this node')
            return
        }

        const logger = container.resolvePlugin('logger')
        logger.info('[VANIR] Overwriting transaction broadcast function with Vanir')

        const p2p = container.resolvePlugin('p2p')

        const database = container.resolvePlugin('database')
        const activeDelegates = (await database.getActiveDelegates()).map(delegate => delegate.publicKey)

        container.resolvePlugin('p2p').getMonitor().broadcastTransactions = async transactions => {
            // Check if any of the configured delegates is currently forging
            if (options.overrideNotForging || delegates.some(delegate => activeDelegates.includes(delegate))) {
                const originalLength = transactions.length

                // Filter transactions, based on the public keys in the config
                transactions = transactions.filter(transaction => !options.publicKeys.includes(transaction.data.senderPublicKey))

                const lengthDiff = originalLength - transactions.length
                if (lengthDiff) {
                    logger.debug(`[VANIR] Filtered ${pluralize(
                        'transaction',
                        lengthDiff,
                        true,
                    )} to self-forge`)
                }

                if (!transactions.length) {
                    return
                }
            }

            // Regular broadcast function, corresponds to original p2p.broadcastTransactions
            const peers = take(shuffle(p2p.storage.getPeers()), p2p.maxPeersBroadcast)

            logger.debug(
                `[VANIR] Broadcasting ${pluralize(
                    'transaction',
                    transactions.length,
                    true,
                )} to ${pluralize('peer', peers.length, true)}`,
            )

            return Promise.all(peers.map(peer => p2p.communicator.postTransactions(transactions.map(tx => tx.toJson()))))
        }
    }
}
