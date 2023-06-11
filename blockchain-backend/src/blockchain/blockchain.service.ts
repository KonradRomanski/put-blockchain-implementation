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
    this.init();
  }

  async init() {
    const blocks = await this.blocksRepository.find();
    if (blocks.length > 0) {
      this.blockchain.chain = blocks.map(
        (block) =>
          new Block(
            block.previousHash,
            JSON.parse(block.transactions).map(
              (t) => new Transaction(t.amount, t.sender, t.receiver),
            ),
            block.timestamp,
          ),
      );
    } else {
      // If no blocks are found, create the genesis block
      const genesisBlock = new Block('', [
        new Transaction(100, 'genesis', 'satoshi'),
      ]);
      this.blockchain.chain = [genesisBlock];
    }
  }

  getBlocks() {
    return this.blocksRepository.find().then((blocks) =>
      blocks.map((block) => {
        return {
          id: block.id,
          timestamp: block.timestamp,
          nonce: block.nonce,
          previousHash: block.previousHash,
          transactions: JSON.parse(block.transactions).map(
            (t) => new Transaction(t.amount, t.sender, t.receiver),
          ),
          hash: block.hash,
        };
      }),
    );
  }

  async addTransaction(t: Transaction) {
    const lastBlock = this.blockchain.getLastBlock();

    if (lastBlock.transactions.length < 3) {
      this.blockchain.addTransaction(t);

      const blockEntity = new EntityBlock();
      blockEntity.nonce = lastBlock.nonce.toString();
      blockEntity.previousHash = lastBlock.prevHash;
      blockEntity.transactions = JSON.stringify(lastBlock.transactions);
      blockEntity.timestamp = lastBlock.ts;
      blockEntity.hash = lastBlock.hash;

      const oldBlock = await this.blocksRepository.findOne({
        where: { hash: lastBlock.hash },
      });

      if (oldBlock != null) {
        // update the old block
        oldBlock.transactions = blockEntity.transactions;
        console.log('UPDATE', oldBlock);
        await this.blocksRepository.save(oldBlock);
      } else {
        // save a new block
        console.log('POST', blockEntity);
        await this.blocksRepository.save(blockEntity);
      }
    } else {
      const newBlock = new Block(lastBlock.hash, [t]);
      this.blockchain.chain.push(newBlock);

      const blockEntity = new EntityBlock();
      blockEntity.nonce = newBlock.nonce.toString();
      blockEntity.previousHash = newBlock.prevHash;
      blockEntity.transactions = JSON.stringify(newBlock.transactions);
      blockEntity.timestamp = newBlock.ts;
      blockEntity.hash = newBlock.hash;

      console.log('POST', blockEntity);
      await this.blocksRepository.save(blockEntity);
    }
  }


  // async addBlock(t: Transaction) {
  //   this.blockchain.addBlock(t);
  //   const newBlock = this.blockchain.getLastBlock();
  //   const blockEntity = new EntityBlock();
  //   blockEntity.nonce = newBlock.nonce.toString();
  //   blockEntity.previousHash = newBlock.prevHash;
  //   blockEntity.transactions = newBlock.transactions;
  //   blockEntity.timestamp = newBlock.ts;
  //   blockEntity.hash = newBlock.hash;
  //   console.log('POST', blockEntity);
  //   await this.blocksRepository.save(blockEntity);
  // }

  validateChain() {
    return this.blockchain.validateChain();
  }
}
