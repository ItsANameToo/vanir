import { Providers } from "@arkecosystem/core-kernel";
export declare class ServiceProvider extends Providers.ServiceProvider {
    private readonly logger;
    private service;
    register(): Promise<void>;
    boot(): Promise<void>;
    bootWhen(serviceProvider?: string): Promise<boolean>;
}
