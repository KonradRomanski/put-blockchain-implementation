import { Injectable } from '@nestjs/common';
import { Transaction } from './interface/transaction/transaction.interface';
import { Block } from './interface/block/block.interface';
import { TransactionDto } from './dto/transaction/transaction';

@Injectable()
export class BlockchainService {
  private blockchain: Block[] = [];
  private pendingTransactions: Transaction[] = [];

  create(transactionDto: TransactionDto) {
    const { sender, recipient, amount } = transactionDto;
    const transaction: Transaction = { sender, recipient, amount };
    this.pendingTransactions.push(transaction);
  }

  findAll(): Block[] {
    return this.blockchain;
  }

  findOne(id: number) {
    return `This action returns a #${id} blockchain`;
  }

  update(id: number, transactionDto: TransactionDto) {
    return `This action updates a #${id} blockchain`;
  }

  remove(id: number) {
    return `This action removes a #${id} blockchain`;
  }
}
