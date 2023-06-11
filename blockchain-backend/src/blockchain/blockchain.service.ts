import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';

class Transaction {
  constructor(
    public amount: number,
    public sender: string, // public key
    public receiver: string, // public key
  ) {}
}

class Block {
  public nonce = Math.round(Math.random() * 999999999);

  constructor(
    public prevHash: string,
    public transaction: Transaction,
    public ts = Date.now(),
  ) {}

  get hash() {
    const str = JSON.stringify(this);
    const hash = CryptoJS.SHA256(str).toString();
    return hash;
  }
}

class Blockchain {
  public chain = [new Block('', new Transaction(100, 'genesis', 'satoshi'))];

  addBlock(t: Transaction) {
    const newBlock = new Block(this.chain[this.chain.length - 1].hash, t);
    this.chain.push(newBlock);
  }

  validateChain() {
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

@Injectable()
export class BlockchainService {
  blockchain = new Blockchain();

  getBlocks() {
    return this.blockchain.chain;
  }

  addBlock(t: Transaction) {
    this.blockchain.addBlock(t);
  }

  validateChain() {
    return this.blockchain.validateChain();
  }
}

