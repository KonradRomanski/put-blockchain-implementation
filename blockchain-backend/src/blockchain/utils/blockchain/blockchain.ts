import { Block } from '../block/block';
import { Transaction } from '../transaction/transaction';

export class Blockchain {
  public chain: Block[];
  public difficulty: number;

  constructor() {
    this.chain = [this.createGenesisBlock()]; // Create genesis block
    this.difficulty = 4; // Change this to set difficulty
  }

  createGenesisBlock() {
    return new Block('', [], new Date());
  }

  addTransaction(t: Transaction) {
    const lastBlock = this.getLastBlock();

    lastBlock.transactions.push(t);
    lastBlock.hash = lastBlock.calculateHash(); // Recalculate the hash
    lastBlock.mineBlock(this.difficulty);

    if (lastBlock.transactions.length >= 3) {
      const newBlock = new Block(lastBlock.hash, []);
      this.chain.push(newBlock);
    }
  }

  getLastBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  validateChain() {
    const result = { isValid: true, errors: [] };

    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.calculateHash() !== currentBlock.hash) {
        result.isValid = false;
        result.errors.push(`Block ${i} hash is not valid`);
      }

      if (currentBlock.prevHash !== previousBlock.hash) {
        result.isValid = false;
        result.errors.push(`Block ${i} previous hash is not valid`);
      }
    }

    return result;
  }
}
