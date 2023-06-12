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
      const genesisBlock = new Block('', []);
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
    const difficulty = this.blockchain.difficulty;

    if (lastBlock.transactions.length < 3) {
      this.blockchain.addTransaction(t);

      const blockEntity = new EntityBlock();
      blockEntity.nonce = lastBlock.nonce.toString();
      blockEntity.previousHash = lastBlock.prevHash;
      blockEntity.transactions = JSON.stringify(lastBlock.transactions);
      blockEntity.timestamp = lastBlock.ts;
      blockEntity.hash = lastBlock.hash;

      // query the database for the last block
      const oldBlock = await this.blocksRepository
        .createQueryBuilder('block')
        .getOne();

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
      // If the last block is full, mine it
      lastBlock.mineBlock(difficulty);
      this.blockchain.chain.push(lastBlock);

      // Save the mined block
      const minedBlockEntity = new EntityBlock();
      minedBlockEntity.nonce = lastBlock.nonce.toString();
      minedBlockEntity.previousHash = lastBlock.prevHash;
      minedBlockEntity.transactions = JSON.stringify(lastBlock.transactions);
      minedBlockEntity.timestamp = lastBlock.ts;
      minedBlockEntity.hash = lastBlock.hash;

      console.log('POST', minedBlockEntity);
      await this.blocksRepository.save(minedBlockEntity);

      // Then, create a new block and add the new transaction to it
      const newBlock = new Block(lastBlock.hash, []);
      this.blockchain.chain.push(newBlock);

      // Add the transaction to the new block and save it
      this.blockchain.addTransaction(t);
      const newBlockEntity = new EntityBlock();
      newBlockEntity.nonce = newBlock.nonce.toString();
      newBlockEntity.previousHash = newBlock.prevHash;
      newBlockEntity.transactions = JSON.stringify(newBlock.transactions);
      newBlockEntity.timestamp = newBlock.ts;
      newBlockEntity.hash = newBlock.hash;

      console.log('POST', newBlockEntity);
      await this.blocksRepository.save(newBlockEntity);
    }
  }


  validateChain() {
    return this.blockchain.validateChain();
  }
}
