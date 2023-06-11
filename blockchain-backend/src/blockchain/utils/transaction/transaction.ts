export class Transaction {
  constructor(
    public amount: number,
    public sender: string, // public key
    public receiver: string, // public key
  ) {}
}
