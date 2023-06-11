import { Block } from '../block/block';
import { Transaction } from '../transaction/transaction';

export class Blockchain {
  public chain: Block[];

  constructor() {
    this.chain = [this.createGenesisBlock()]; // Create genesis block
  }

  createGenesisBlock() {
    return new Block('', [], new Date());
  }

  addTransaction(t: Transaction) {
    const lastBlock = this.getLastBlock();

    if (lastBlock.transactions.length < 3) {
      lastBlock.transactions.push(t);
    } else {
      const newBlock = new Block(lastBlock.hash, [t]);
      this.chain.push(newBlock);
    }
  }

  getLastBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  validateChain(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.hash) {
        return false;
      }

      if (currentBlock.prevHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}
