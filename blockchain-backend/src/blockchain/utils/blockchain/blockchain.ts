import { Block } from '../block/block';
import { Transaction } from '../transaction/transaction';

export class Blockchain {
  public chain: Block[];

  constructor() {
    this.chain = [new Block('', new Transaction(100, 'genesis', 'satoshi'))];
  }

  addBlock(t: Transaction) {
    const newBlock = new Block(this.getLastBlock().hash, t);
    this.chain.push(newBlock);
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
