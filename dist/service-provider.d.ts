import { Providers } from "@arkecosystem/core-kernel";
export declare class ServiceProvider extends Providers.ServiceProvider {
    private readonly logger;
    register(): Promise<void>;
    bootWhen(serviceProvider?: string): Promise<boolean>;
}
