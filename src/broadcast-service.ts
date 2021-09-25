import { Container, Contracts, Providers, Utils } from "@arkecosystem/core-kernel";
import { Interfaces, Transactions } from "@arkecosystem/crypto";

@Container.injectable()
export default class BroadcastService {
    @Container.inject(Container.Identifiers.PeerTransactionBroadcaster)
    private readonly broadcaster!: Contracts.P2P.TransactionBroadcaster;

    public boot(): void {
        if (this.broadcaster) {
            (this.broadcaster as any).broadcastTransactions = async function(transactions: Interfaces.ITransaction[]): Promise<void> {
                if (transactions.length === 0) {
                    this.logger.warning("Broadcasting 0 transactions");
                    return;
                }

                const originalLength = transactions.length
                const publicKeys: string[] = []; // this.configuration.get("publicKeys"); // TODO: fetch from config

                // Filter transactions, based on the public keys in the config
                transactions = transactions.filter(transaction => !publicKeys.includes(transaction.data.senderPublicKey ?? ''))

                const lengthDiff = originalLength - transactions.length
                if (lengthDiff) {
                    const transactionsStr = Utils.pluralize('transaction', lengthDiff, true);
                    this.logger.debug(`[VANIR] Filtered ${transactionsStr} to self-forge`)
                }

                // Abort if no transactions remain
                if (!transactions.length) {
                    return;
                }

                // Regular broadcast function, corresponds to original TransactionBroadcaster.broadcastTransactions method
                const maxPeersBroadcast: number = (this.configuration as Providers.PluginConfiguration).getRequired<number>("maxPeersBroadcast");
                const peers: Contracts.P2P.Peer[] = Utils.take(Utils.shuffle(this.repository.getPeers()), maxPeersBroadcast);

                const transactionsStr = Utils.pluralize("transaction", transactions.length, true);
                const peersStr = Utils.pluralize("peer", peers.length, true);
                this.logger.debug(`[Vanir] Broadcasting ${transactionsStr} to ${peersStr}`);

                const transactionsBroadcast: Buffer[] = transactions.map((t) => Transactions.Serializer.serialize(t));
                const promises = peers.map((p) => this.communicator.postTransactions(p, transactionsBroadcast));

                await Promise.all(promises);
            }
        }
    }
}