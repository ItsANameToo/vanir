"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_kernel_1 = require("@arkecosystem/core-kernel");
const crypto_1 = require("@arkecosystem/crypto");
let BroadcastService = class BroadcastService {
    boot() {
        if (this.broadcaster) {
            this.broadcaster.broadcastTransactions = async function (transactions) {
                if (transactions.length === 0) {
                    this.logger.warning("Broadcasting 0 transactions");
                    return;
                }
                const originalLength = transactions.length;
                const publicKeys = []; // this.configuration.get("publicKeys"); // TODO: fetch from config
                // Filter transactions, based on the public keys in the config
                transactions = transactions.filter(transaction => { var _a; return !publicKeys.includes((_a = transaction.data.senderPublicKey) !== null && _a !== void 0 ? _a : ''); });
                const lengthDiff = originalLength - transactions.length;
                if (lengthDiff) {
                    const transactionsStr = core_kernel_1.Utils.pluralize('transaction', lengthDiff, true);
                    this.logger.debug(`[VANIR] Filtered ${transactionsStr} to self-forge`);
                }
                // Abort if no transactions remain
                if (!transactions.length) {
                    return;
                }
                // Regular broadcast function, corresponds to original TransactionBroadcaster.broadcastTransactions method
                const maxPeersBroadcast = this.configuration.getRequired("maxPeersBroadcast");
                const peers = core_kernel_1.Utils.take(core_kernel_1.Utils.shuffle(this.repository.getPeers()), maxPeersBroadcast);
                const transactionsStr = core_kernel_1.Utils.pluralize("transaction", transactions.length, true);
                const peersStr = core_kernel_1.Utils.pluralize("peer", peers.length, true);
                this.logger.debug(`[Vanir] Broadcasting ${transactionsStr} to ${peersStr}`);
                const transactionsBroadcast = transactions.map((t) => crypto_1.Transactions.Serializer.serialize(t));
                const promises = peers.map((p) => this.communicator.postTransactions(p, transactionsBroadcast));
                await Promise.all(promises);
            };
        }
    }
};
__decorate([
    core_kernel_1.Container.inject(core_kernel_1.Container.Identifiers.PeerTransactionBroadcaster),
    __metadata("design:type", Object)
], BroadcastService.prototype, "broadcaster", void 0);
BroadcastService = __decorate([
    core_kernel_1.Container.injectable()
], BroadcastService);
exports.default = BroadcastService;
//# sourceMappingURL=broadcast-service.js.map