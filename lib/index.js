'use strict'

const shuffle = require('lodash/shuffle')
const take = require('lodash/take')
const pluralize = require('pluralize')

exports.plugin = {
    pkg: require('../package.json'),
    defaults: {
        enabled: false,
        publicKeys: [],
        delegates: [],
    },
    async register (container, options) {
        if (!options.enabled) {
            return
        }

        const logger = container.resolvePlugin('logger')
        logger.info('[VANIR] Overwriting transaction broadcast function with Vanir')

        const p2p = container.resolvePlugin('p2p')

        container.resolvePlugin('p2p').getMonitor().broadcastTransactions = async transactions => {
            // Filter transactions, based on the public keys in the config
            transactions = transactions.reduce((transactions, transaction) => {
                if (options.publicKeys.includes(transaction.data.senderPublicKey)) {
                    transactions.filtered.push(transaction)
                } else {
                    transaction.unfiltered.push(transaction)
                }
                return transactions
            }, {
                filtered: [],
                unfiltered: [],
            })

            if (transactions.filtered.length) {
                let delegates = options.delegates || []

                if (!Array.isArray(delegates)) {
                    delegates = [delegates]
                }

                let hasActiveDelegates = !delegates.length

                if (delegates.length) {
                    const database = container.resolvePlugin('database')
                    const activeDelegates = (await database.getActiveDelegates()).map(delegate => {
                        return delegate.username || delegate.attributes.delegate.username
                    })

                    hasActiveDelegates = delegates.some(delegate => activeDelegates.includes(delegate))
                }

                // Check if any of the configured delegates is currently forging
                if (hasActiveDelegates) {
                    logger.debug(`[VANIR] Filtered ${pluralize(
                        'transaction',
                        transactions.filtered.length,
                        true,
                    )} to self-forge`)

                    if (!transactions.unfiltered.length) {
                        return
                    }
                } else {
                    logger.info('[VANIR] No configured delegate is currently forging')
                    transactions.unfiltered.push(...transactions.filtered)
                }
            }

            // Regular broadcast function, corresponds to original p2p.broadcastTransactions
            const peers = take(shuffle(p2p.storage.getPeers()), container.resolveOptions('p2p').maxPeersBroadcast)

            logger.debug(
                `[VANIR] Broadcasting ${pluralize(
                    'transaction',
                    transactions.unfiltered.length,
                    true,
                )} to ${pluralize('peer', peers.length, true)}`,
            )

            return Promise.all(peers.map(peer => p2p.communicator.postTransactions(transactions.unfiltered.map(tx => tx.toJson()))))
        }
    }
}
