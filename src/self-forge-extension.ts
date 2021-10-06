import { Container, Contracts, Providers } from "@arkecosystem/core-kernel";
import { Interfaces } from "@arkecosystem/crypto";
import { VanirError } from "./vanirError";

@Container.injectable()
export class SelfForgeExtension extends Contracts.TransactionPool.ProcessorExtension {
    @Container.inject(Container.Identifiers.LogService)
    private readonly logger!: Contracts.Kernel.Logger;

    @Container.inject(Container.Identifiers.PluginConfiguration)
    @Container.tagged("plugin", "@itsanametoo/vanir")
    private readonly vanirConfiguration!: Providers.PluginConfiguration;

    public async throwIfCannotBroadcast(transaction: Interfaces.ITransaction): Promise<void> {
        const publicKeys: string[] = this.vanirConfiguration.get("publicKeys") ?? [];

        if (publicKeys.includes(transaction.data.senderPublicKey ?? '')) {
            this.logger.debug(`[VANIR] Keeping transaction ${transaction.data.id} to self forge`);
            throw new VanirError(`[VANIR] Keeping transaction ${transaction.data.id} to self forge`);
        }
    }
}