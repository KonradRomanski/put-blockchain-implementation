import { Transaction } from '../transaction/transaction';
import * as CryptoJS from 'crypto-js';

export class Block {
  public nonce = Math.round(Math.random() * 9999999).toString();
  public transactionHashes: string[] = []; // keep the transaction hashes in array

  constructor(
    public prevHash: string,
    public transactions: Transaction[],
    public ts: Date = new Date(),
  ) {
    this.transactionHashes = transactions.map(
      (transaction) => transaction.hash,
    );
  }

  get hash() {
    const str =
      JSON.stringify(this.transactionHashes) +
      this.prevHash +
      this.ts +
      this.nonce;
    const hash = CryptoJS.SHA256(str).toString();
    return hash;
  }
}
