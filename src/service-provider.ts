import { Container, Contracts, Providers } from "@arkecosystem/core-kernel";

import BroadcastService from "./broadcast-service";

export class ServiceProvider extends Providers.ServiceProvider {
    @Container.inject(Container.Identifiers.LogService)
    private readonly logger!: Contracts.Kernel.Logger;

    private service = Symbol.for("Vanir<Service>");

    public async register(): Promise<void> {
        this.logger.info("[VANIR] Registering plugin");
        this.app.bind(this.service).to(BroadcastService).inSingletonScope();
    }

    public async boot(): Promise<void> {
        this.logger.info("[VANIR] Overwriting transaction broadcast function with Vanir");
        this.app.get<BroadcastService>(this.service).boot();
    }

    public async bootWhen(serviceProvider?: string): Promise<boolean> {
        return !!this.config().get("enabled");
    }
}
