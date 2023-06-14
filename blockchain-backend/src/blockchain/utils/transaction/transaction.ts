import * as CryptoJS from 'crypto-js';

export class Transaction {
  public hash: string;

  constructor(
    public amount: number,
    public sender: string, // public key
    public receiver: string, // public key
  ) {
    this.hash = CryptoJS.SHA256(
      JSON.stringify({
        amount: this.amount,
        sender: this.sender,
        receiver: this.receiver,
      }),
    ).toString();
  }
}
