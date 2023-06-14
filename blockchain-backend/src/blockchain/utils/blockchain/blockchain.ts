import { Block } from '../block/block';

export class Blockchain {
  public chain: Block[];
  public difficulty: number;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  createGenesisBlock() {
    return new Block('', [], new Date());
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
