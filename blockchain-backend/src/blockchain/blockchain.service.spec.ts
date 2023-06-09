import { Test, TestingModule } from '@nestjs/testing';
import { BlockchainService } from './blockchain.service';
import { TransactionDto } from './dto/transaction/transaction';
import { Block } from './interface/block/block.interface';

describe('BlockchainService', () => {
  let service: BlockchainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockchainService],
    }).compile();

    service = module.get<BlockchainService>(BlockchainService);
  });

  describe('create', () => {
    it('should add a new transaction to the pending transactions', () => {
      const transactionDto: TransactionDto = {
        sender: 'sender-address',
        recipient: 'recipient-address',
        amount: 10,
      };

      service.create(transactionDto);

      expect(service['pendingTransactions']).toHaveLength(1);
      expect(service['pendingTransactions'][0]).toEqual(transactionDto);
    });

    it('should create a new block and add it to the blockchain', () => {
      const transactionDto: TransactionDto = {
        sender: 'sender-address',
        recipient: 'recipient-address',
        amount: 10,
      };

      service.create(transactionDto);

      const blockchain: Block[] = service['blockchain'];

      expect(blockchain).toHaveLength(1);
      expect(blockchain[0].transactions).toHaveLength(1);
      expect(blockchain[0].transactions[0]).toEqual(transactionDto);
    });
  });

  describe('findAll', () => {
    it('should return the entire blockchain', () => {
      const blockchain: Block[] = [
        {
          index: 1,
          timestamp: Date.now(),
          transactions: [],
          nonce: 0,
          hash: 'hash-1',
          previousHash: '',
        },
        {
          index: 2,
          timestamp: Date.now(),
          transactions: [],
          nonce: 0,
          hash: 'hash-2',
          previousHash: 'hash-1',
        },
      ];

      service['blockchain'] = blockchain;

      const result = service.findAll();

      expect(result).toEqual(blockchain);
    });
  });

  describe('findOne', () => {
    it('should return a specific block from the blockchain', () => {
      const blockchain: Block[] = [
        {
          index: 1,
          timestamp: Date.now(),
          transactions: [],
          nonce: 0,
          hash: 'hash-1',
          previousHash: '',
        },
        {
          index: 2,
          timestamp: Date.now(),
          transactions: [],
          nonce: 0,
          hash: 'hash-2',
          previousHash: 'hash-1',
        },
      ];

      service['blockchain'] = blockchain;

      const result = service.findOne(2);

      expect(result).toEqual('This action returns a #2 blockchain');
    });
  });

  describe('update', () => {
    it('should update a specific block in the blockchain', () => {
      const result = service.update(2, {
        sender: 'new-sender',
        recipient: 'new-recipient',
        amount: 20,
      });

      expect(result).toEqual('This action updates a #2 blockchain');
    });
  });

  describe('remove', () => {
    it('should remove a specific block from the blockchain', () => {
      const result = service.remove(2);

      expect(result).toEqual('This action removes a #2 blockchain');
    });
  });
});
