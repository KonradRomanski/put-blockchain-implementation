import { BlockchainService } from './blockchain.service';
import { TransactionDto } from './dto/transaction/transaction';
export declare class BlockchainController {
    private readonly blockchainService;
    constructor(blockchainService: BlockchainService);
    create(transactionDto: TransactionDto): void;
    findAll(): import("./interface/block/block.interface").Block[];
    findOne(id: string): import("./interface/block/block.interface").Block;
    update(id: string, transactionDto: TransactionDto): import("./interface/block/block.interface").Block;
    remove(id: string): import("./interface/block/block.interface").Block;
}
