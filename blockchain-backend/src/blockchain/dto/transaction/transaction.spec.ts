import { TransactionDto } from './transaction';

describe('Transaction', () => {
  it('should be defined', () => {
    expect(new TransactionDto()).toBeDefined();
  });
});
