import { Container, Contracts, Providers } from "@arkecosystem/core-kernel";

import { SelfForgeExtension } from "./self-forge-extension";

export class ServiceProvider extends Providers.ServiceProvider {
    @Container.inject(Container.Identifiers.LogService)
    private readonly logger!: Contracts.Kernel.Logger;

    public async register(): Promise<void> {
        this.logger.info("[VANIR] Registering plugin");
        this.app.rebind(Container.Identifiers.TransactionPoolProcessorExtension).to(SelfForgeExtension);
    }

    public async bootWhen(serviceProvider?: string): Promise<boolean> {
        return !!this.config().get("enabled");
    }
}
