import { Injectable } from '@nestjs/common';
import { Transaction } from './interface/transaction/transaction.interface';
import { Block } from './interface/block/block.interface';
import { TransactionDto } from './dto/transaction/transaction';
import { BlockchainUtils } from './blockchain-utils/blockchain-utils';

@Injectable()
export class BlockchainService {
  private blockchain: Block[] = [];
  private pendingTransactions: Transaction[] = [];

  create(transactionDto: TransactionDto) {
    const { sender, recipient, amount } = transactionDto;
    const transaction: Transaction = { sender, recipient, amount };
    this.pendingTransactions.push(transaction);

    const lastBlock = BlockchainUtils.getLastBlock(this.blockchain);
    const previousHash = lastBlock ? lastBlock.hash : '';
    const nonce = BlockchainUtils.proofOfWork(
      previousHash,
      this.pendingTransactions,
    );
    const hash = BlockchainUtils.calculateHash(
      nonce,
      previousHash,
      Date.now(),
      this.pendingTransactions,
    );
    const newBlock = BlockchainUtils.createNewBlock(
      this.blockchain,
      this.pendingTransactions,
      previousHash,
      nonce,
      hash,
    );
    this.blockchain.push(newBlock);
  }

  findAll(): Block[] {
    return this.blockchain;
  }

  findOne(id: number): Block {
    return this.blockchain.find((block) => block.index === id);
  }

  update(id: number, transactionDto: TransactionDto): Block {
    const blockIndex = this.blockchain.findIndex((block) => block.index === id);
    if (blockIndex === -1) {
      return null; // Block not found
    }

    // Update the transaction details
    const { sender, recipient, amount } = transactionDto;
    this.blockchain[blockIndex].transactions = [{ sender, recipient, amount }];

    return this.blockchain[blockIndex];
  }

  remove(id: number): Block {
    const blockIndex = this.blockchain.findIndex((block) => block.index === id);
    if (blockIndex === -1) {
      return null; // Block not found
    }

    // Remove the block from the blockchain
    const removedBlock = this.blockchain.splice(blockIndex, 1)[0];

    return removedBlock;
  }
}
