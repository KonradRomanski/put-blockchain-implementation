import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Block as EntityBlock } from './entities/block.entity/block.entity';
import { Blockchain } from './utils/blockchain/blockchain';
import { Block } from './utils/block/block';
import { Transaction } from './utils/transaction/transaction';
import * as elliptic from 'elliptic';
import { TransactionDto } from './dto/transaction.dto/transaction.dto';

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

  async addTransaction(tr: TransactionDto) {
    const t = new Transaction(tr.amount, tr.sender, tr.receiver);
    // const keys = this.generateKeyPair();
    const keys = { privateKey: tr.private_key, publicKey: tr.sender };
    console.log('hash', t.hash);
    console.log('privateKey', keys.privateKey);
    console.log('publicKey', keys.publicKey);

    //Signing the transaction
    const ec = new elliptic.ec('secp256k1');
    const key = ec.keyFromPrivate(keys.privateKey, 'hex');
    const signature = key.sign(t.hash, 'hex', { canonical: true });
    const signatureString = signature.toDER('hex');
    console.log('Signature String: ', signatureString);

    //Verifying the transaction
    const keyFromPublic = ec.keyFromPublic(keys.publicKey, 'hex');
    const isValid = keyFromPublic.verify(t.hash, signatureString);
    console.log('isValid', isValid);

    if (isValid) {
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
      const lastBlock = this.entityBlockToBlock(lastBlockEntity);

      if (lastBlock.transactions.length < 3) {
        lastBlock.addTransaction(t);
        lastBlock.calculateHash();
        lastBlock.mineBlock(this.blockchain.difficulty);
        const updatedBlockEntity = this.blockToEntityBlock(lastBlock);
        await this.blocksRepository.update(
          lastBlockEntity.id,
          updatedBlockEntity,
        );
      } else {
        const newBlock = new Block(lastBlock.hash, [t]);
        newBlock.mineBlock(this.blockchain.difficulty);
        const newBlockEntity = this.blockToEntityBlock(newBlock);
        await this.blocksRepository.save(newBlockEntity);
      }
      return { message: 'Transaction added' };
    } else return { message: 'Invalid transaction' };
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

  public generateKeyPair(): { privateKey: string; publicKey: string } {
    const ec = new elliptic.ec('secp256k1');
    const keyPair = ec.genKeyPair();
    const privateKey = keyPair.getPrivate('hex');
    const publicKey = keyPair.getPublic('hex');
    return { privateKey, publicKey };
  }

  validateChain() {
    console.log(this.blockchain);
    return this.blockchain.validateChain();
  }
}
