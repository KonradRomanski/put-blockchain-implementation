import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Block as EntityBlock } from './entities/block.entity/block.entity';
import { Blockchain } from './utils/blockchain/blockchain';
import { Block } from './utils/block/block';
import { Transaction } from './utils/transaction/transaction';

@Injectable()
export class BlockchainService {
  private blockchain = new Blockchain();

  constructor(
    @InjectRepository(EntityBlock)
    private blocksRepository: Repository<EntityBlock>,
  ) {
    // Genesis block
    this.init();
  }

  async init() {
    const blocks = await this.blocksRepository.find();
    if (blocks.length > 0) {
      this.blockchain.chain = blocks.map(
        (block) =>
          new Block(
            block.previousHash,
            block.transaction as Transaction,
            block.timestamp,
          ),
      );
    } else {
      // If no blocks are found, create the genesis block
      const genesisBlock = new Block(
        '',
        new Transaction(100, 'genesis', 'satoshi'),
      );
      this.blockchain.chain = [genesisBlock];
    }
  }

  getBlocks() {
    return this.blocksRepository.find();
  }

  async addBlock(t: Transaction) {
    this.blockchain.addBlock(t);
    const newBlock = this.blockchain.getLastBlock();
    const blockEntity = new EntityBlock();
    blockEntity.nonce = newBlock.nonce.toString();
    blockEntity.previousHash = newBlock.prevHash;
    blockEntity.transaction = newBlock.transaction;
    blockEntity.timestamp = newBlock.ts;
    blockEntity.hash = newBlock.hash;
    console.log('POST', blockEntity);
    await this.blocksRepository.save(blockEntity);
  }

  validateChain() {
    return this.blockchain.validateChain();
  }
}
