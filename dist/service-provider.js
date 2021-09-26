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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_kernel_1 = require("@arkecosystem/core-kernel");
const broadcast_service_1 = __importDefault(require("./broadcast-service"));
class ServiceProvider extends core_kernel_1.Providers.ServiceProvider {
    constructor() {
        super(...arguments);
        this.service = Symbol.for("Vanir<Service>");
    }
    async register() {
        this.logger.info("[VANIR] Registering plugin");
        this.app.bind(this.service).to(broadcast_service_1.default).inSingletonScope();
    }
    async boot() {
        this.logger.info("[VANIR] Overwriting transaction broadcast function with Vanir");
        this.app.get(this.service).boot();
    }
    async bootWhen(serviceProvider) {
        return !!this.config().get("enabled");
    }
}
__decorate([
    core_kernel_1.Container.inject(core_kernel_1.Container.Identifiers.LogService),
    __metadata("design:type", Object)
], ServiceProvider.prototype, "logger", void 0);
exports.ServiceProvider = ServiceProvider;
//# sourceMappingURL=service-provider.js.map