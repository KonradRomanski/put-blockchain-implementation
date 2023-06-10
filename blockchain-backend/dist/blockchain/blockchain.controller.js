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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainController = void 0;
const common_1 = require("@nestjs/common");
const blockchain_service_1 = require("./blockchain.service");
const transaction_1 = require("./dto/transaction/transaction");
const swagger_1 = require("@nestjs/swagger");
let BlockchainController = exports.BlockchainController = class BlockchainController {
    constructor(blockchainService) {
        this.blockchainService = blockchainService;
    }
    create(transactionDto) {
        return this.blockchainService.create(transactionDto);
    }
    findAll() {
        return this.blockchainService.findAll();
    }
    findOne(id) {
        return this.blockchainService.findOne(+id);
    }
    update(id, transactionDto) {
        return this.blockchainService.update(+id, transactionDto);
    }
    remove(id) {
        return this.blockchainService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new transaction' }),
    (0, swagger_1.ApiBody)({
        type: transaction_1.TransactionDto,
        description: 'Transaction data',
        examples: {
            example1: {
                value: {
                    sender: 'John',
                    recipient: 'Alice',
                    amount: 10,
                },
                summary: 'Example of a valid transaction',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The transaction has been successfully created.',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transaction_1.TransactionDto]),
    __metadata("design:returntype", void 0)
], BlockchainController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all transactions' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns an array of transactions.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BlockchainController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a transaction by ID' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'The ID of the transaction',
        example: '1',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the details of the transaction.',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Transaction not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlockchainController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a transaction by ID' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'The ID of the transaction',
        example: '1',
    }),
    (0, swagger_1.ApiBody)({
        type: transaction_1.TransactionDto,
        description: 'Updated transaction data',
        examples: {
            example1: {
                value: {
                    sender: 'John',
                    recipient: 'Alice',
                    amount: 20,
                },
                summary: 'Example of an updated transaction',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The transaction has been successfully updated.',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Transaction not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, transaction_1.TransactionDto]),
    __metadata("design:returntype", void 0)
], BlockchainController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a transaction by ID' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'The ID of the transaction',
        example: '1',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The transaction has been successfully deleted.',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Transaction not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlockchainController.prototype, "remove", null);
exports.BlockchainController = BlockchainController = __decorate([
    (0, swagger_1.ApiTags)('Blockchain'),
    (0, common_1.Controller)('blockchain'),
    __metadata("design:paramtypes", [blockchain_service_1.BlockchainService])
], BlockchainController);
//# sourceMappingURL=blockchain.controller.js.map