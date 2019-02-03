'use strict'

class Vanir {

    async setUp (container, options) {
        const logger = container.resolvePlugin('logger')
        logger.info('Overwriting broadcast function with Vanir')
        
        const p2p = container.resolvePlugin('p2p')
        const oldBroadcast = p2p.broadcastTransactions

        container.resolvePlugin('p2p').broadcastTransactions = async (transactions) => {
            
            // Filter transactions
            transactions = transactions.filter(transaction => ![
                'PUBKEY',
            ].includes(transaction.senderPublicKey))

            // Call existing function to handle broadcasting
            return oldBroadcast(transactions)
        }
    }
}

module.exports = new Vanir()