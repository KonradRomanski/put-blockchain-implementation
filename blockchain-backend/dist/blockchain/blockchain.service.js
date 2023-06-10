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
const blockchain_utils_1 = require("./blockchain-utils/blockchain-utils");
let BlockchainService = exports.BlockchainService = class BlockchainService {
    constructor() {
        this.blockchain = [];
        this.pendingTransactions = [];
    }
    create(transactionDto) {
        const { sender, recipient, amount } = transactionDto;
        const transaction = { sender, recipient, amount };
        this.pendingTransactions.push(transaction);
        const lastBlock = blockchain_utils_1.BlockchainUtils.getLastBlock(this.blockchain);
        const previousHash = lastBlock ? lastBlock.hash : '';
        const nonce = blockchain_utils_1.BlockchainUtils.proofOfWork(previousHash, this.pendingTransactions);
        const hash = blockchain_utils_1.BlockchainUtils.calculateHash(nonce, previousHash, Date.now(), this.pendingTransactions);
        const newBlock = blockchain_utils_1.BlockchainUtils.createNewBlock(this.blockchain, this.pendingTransactions, previousHash, nonce, hash);
        this.blockchain.push(newBlock);
    }
    findAll() {
        return this.blockchain;
    }
    findOne(id) {
        return this.blockchain.find((block) => block.index === id);
    }
    update(id, transactionDto) {
        const blockIndex = this.blockchain.findIndex((block) => block.index === id);
        if (blockIndex === -1) {
            return null;
        }
        const { sender, recipient, amount } = transactionDto;
        this.blockchain[blockIndex].transactions = [{ sender, recipient, amount }];
        return this.blockchain[blockIndex];
    }
    remove(id) {
        const blockIndex = this.blockchain.findIndex((block) => block.index === id);
        if (blockIndex === -1) {
            return null;
        }
        const removedBlock = this.blockchain.splice(blockIndex, 1)[0];
        return removedBlock;
    }
};
exports.BlockchainService = BlockchainService = __decorate([
    (0, common_1.Injectable)()
], BlockchainService);
//# sourceMappingURL=blockchain.service.js.map