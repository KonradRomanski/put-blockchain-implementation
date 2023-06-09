"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainService = void 0;
const common_1 = require("@nestjs/common");
let BlockchainService = exports.BlockchainService = class BlockchainService {
    constructor() {
        this.blockchain = [];
        this.pendingTransactions = [];
    }
    create(transactionDto) {
        const { sender, recipient, amount } = transactionDto;
        const transaction = { sender, recipient, amount };
        this.pendingTransactions.push(transaction);
    }
    findAll() {
        return this.blockchain;
    }
    findOne(id) {
        return `This action returns a #${id} blockchain`;
    }
    update(id, transactionDto) {
        return `This action updates a #${id} blockchain`;
    }
    remove(id) {
        return `This action removes a #${id} blockchain`;
    }
};
exports.BlockchainService = BlockchainService = __decorate([
    (0, common_1.Injectable)()
], BlockchainService);
//# sourceMappingURL=blockchain.service.js.map