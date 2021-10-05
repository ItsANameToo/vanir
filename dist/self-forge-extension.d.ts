import { Contracts } from "@arkecosystem/core-kernel";
import { Interfaces } from "@arkecosystem/crypto";
export declare class SelfForgeExtension extends Contracts.TransactionPool.ProcessorExtension {
    private readonly logger;
    private readonly vanirConfiguration;
    throwIfCannotBroadcast(transaction: Interfaces.ITransaction): Promise<void>;
}