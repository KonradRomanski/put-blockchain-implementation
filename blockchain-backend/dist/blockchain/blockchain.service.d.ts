import { Block } from './interface/block/block.interface';
import { TransactionDto } from './dto/transaction/transaction';
export declare class BlockchainService {
    private blockchain;
    private pendingTransactions;
    create(transactionDto: TransactionDto): void;
    findAll(): Block[];
    findOne(id: number): Block;
    update(id: number, transactionDto: TransactionDto): Block;
    remove(id: number): Block;
}
