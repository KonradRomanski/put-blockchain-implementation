import { Transaction } from '../transaction/transaction';
import * as CryptoJS from 'crypto-js';

export class Block {
  public nonce = Math.round(Math.random() * 9999999).toString();

  constructor(
    public prevHash: string,
    public transaction: Transaction,
    public ts: Date = new Date(),
  ) {}

  get hash() {
    const str = JSON.stringify(this);
    const hash = CryptoJS.SHA256(str).toString();
    return hash;
  }
}
