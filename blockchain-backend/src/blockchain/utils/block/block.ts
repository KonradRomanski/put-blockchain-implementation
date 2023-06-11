import { Transaction } from '../transaction/transaction';
import * as CryptoJS from 'crypto-js';

export class Block {
  public nonce = Math.round(Math.random() * 9999999).toString();
  public hash: string;
  public transactionHashes: string[] = []; // keep the transaction hashes in array

  constructor(
    public prevHash: string,
    public transactions: Transaction[],
    public ts: Date = new Date(),
  ) {
    this.transactionHashes = transactions.map(
      (transaction) => transaction.hash,
    );
    this.hash = this.calculateHash();
  }

  mineBlock(difficulty: number) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
      this.nonce = (parseInt(this.nonce, 10) + 1).toString();
      this.hash = this.calculateHash();
    }

    console.log('BLOCK MINED: ' + this.hash);
  }

  calculateHash() {
    return CryptoJS.SHA256(
      this.prevHash +
        this.ts.getTime().toString() +
        JSON.stringify(this.transactions) +
        this.nonce.toString(),
    ).toString();
  }
}
