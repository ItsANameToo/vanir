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
const vanirError_1 = require("./vanirError");
let SelfForgeExtension = class SelfForgeExtension extends core_kernel_1.Contracts.TransactionPool.ProcessorExtension {
    async throwIfCannotBroadcast(transaction) {
        var _a, _b;
        const publicKeys = (_a = this.vanirConfiguration.get("publicKeys")) !== null && _a !== void 0 ? _a : [];
        if (publicKeys.includes((_b = transaction.data.senderPublicKey) !== null && _b !== void 0 ? _b : '')) {
            this.logger.debug(`[VANIR] Keeping transaction ${transaction.data.id} to self forge`);
            throw new vanirError_1.VanirError(`[VANIR] Keeping transaction ${transaction.data.id} to self forge`);
        }
    }
};
__decorate([
    core_kernel_1.Container.inject(core_kernel_1.Container.Identifiers.LogService),
    __metadata("design:type", Object)
], SelfForgeExtension.prototype, "logger", void 0);
__decorate([
    core_kernel_1.Container.inject(core_kernel_1.Container.Identifiers.PluginConfiguration),
    core_kernel_1.Container.tagged("plugin", "@itsanametoo/vanir"),
    __metadata("design:type", core_kernel_1.Providers.PluginConfiguration)
], SelfForgeExtension.prototype, "vanirConfiguration", void 0);
SelfForgeExtension = __decorate([
    core_kernel_1.Container.injectable()
], SelfForgeExtension);
exports.SelfForgeExtension = SelfForgeExtension;
//# sourceMappingURL=self-forge-extension.js.map