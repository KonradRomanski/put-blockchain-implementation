import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
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
    return this.blocksRepository.find({ order: { id: 'ASC' } }).then((blocks) =>
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
    // Fetch the latest block from the database
    const lastBlockEntity = await this.blocksRepository
      .createQueryBuilder('block')
      .orderBy('block.id', 'DESC')
      .getOne();

    if (!lastBlockEntity) {
      const newBlock = new Block('', [t]);
      newBlock.mineBlock(this.blockchain.difficulty);
      const newBlockEntity = this.blockToEntityBlock(newBlock);
      await this.blocksRepository.save(newBlockEntity);
      return;
    }

    // Convert the EntityBlock to a Block
    const lastBlock = this.entityBlockToBlock(lastBlockEntity);

    // console.log('lasBlockEntity', lastBlockEntity);
    // console.log('lastBlock', lastBlock);

    if (lastBlock.transactions.length < 3) {
      // console.log('The last block still good');
      // Add the new transaction
      lastBlock.transactions.push(t);
      // Recalculate the hash
      lastBlock.mineBlock(this.blockchain.difficulty);
      // Convert the Block back to an EntityBlock
      const updatedBlockEntity = this.blockToEntityBlock(lastBlock);

      // console.log('updatedBlockEntity', updatedBlockEntity);
      // Update the block in the database
      await this.blocksRepository.update(
        lastBlockEntity.id,
        updatedBlockEntity,
      );
    } else {
      console.log('Adding the new block');
      // // The last block is full, mine it
      // lastBlock.mineBlock(this.blockchain.difficulty);
      // // Save the mined block
      // const minedBlockEntity = this.blockToEntityBlock(lastBlock);
      // await this.blocksRepository.save(minedBlockEntity);

      // Create a new block and add the new transaction to it
      const newBlock = new Block(lastBlock.hash, [t]);
      // Mine the new block
      newBlock.mineBlock(this.blockchain.difficulty);
      // Convert the Block back to an EntityBlock
      const newBlockEntity = this.blockToEntityBlock(newBlock);
      // Save the new block
      await this.blocksRepository.save(newBlockEntity);
    }
  }

  private blockToEntityBlock(block: Block): EntityBlock {
    const blockEntity = new EntityBlock();
    blockEntity.nonce = block.nonce;
    blockEntity.previousHash = block.prevHash;
    blockEntity.transactions = JSON.stringify(block.transactions);
    blockEntity.timestamp = block.ts;
    blockEntity.hash = block.hash;

    return blockEntity;
  }

  private entityBlockToBlock(blockEntity: EntityBlock): Block {
    const transactions = JSON.parse(blockEntity.transactions).map(
      (t) => new Transaction(t.amount, t.sender, t.receiver),
    );

    const block = new Block(
      blockEntity.previousHash,
      transactions,
      new Date(blockEntity.timestamp),
    );
    block.nonce = blockEntity.nonce;
    block.hash = blockEntity.hash;

    return block;
  }

  validateChain() {
    return this.blockchain.validateChain();
  }
}
