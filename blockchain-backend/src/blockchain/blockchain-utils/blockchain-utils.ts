import * as CryptoJS from 'crypto-js';
import { Transaction } from '../interface/transaction/transaction.interface';
import { Block } from '../interface/block/block.interface';

export class BlockchainUtils {
  static calculateHash(
    index: number,
    previousHash: string,
    timestamp: number,
    transactions: Transaction[],
  ): string {
    const data =
      index + previousHash + timestamp + JSON.stringify(transactions);
    return CryptoJS.SHA256(data).toString();
  }

  static proofOfWork(
    previousHash: string,
    currentBlockData: Transaction[],
  ): number {
    let nonce = 0;
    let hash = BlockchainUtils.calculateHash(
      0,
      previousHash,
      Date.now(),
      currentBlockData,
    );

    while (hash.substring(0, 4) !== '0000') {
      nonce++;
      hash = BlockchainUtils.calculateHash(
        nonce,
        previousHash,
        Date.now(),
        currentBlockData,
      );
    }

    return nonce;
  }

  static createNewBlock(
    blockchain: Block[],
    pendingTransactions: Transaction[],
    previousHash: string,
    nonce: number,
    hash: string,
  ): Block {
    const newBlock: Block = {
      index: blockchain.length + 1,
      timestamp: Date.now(),
      transactions: pendingTransactions,
      nonce: nonce,
      hash: hash,
      previousHash: previousHash,
    };

    return newBlock;
  }

  static getLastBlock(blockchain: Block[]): Block {
    return blockchain[blockchain.length - 1];
  }

  static validateBlock(block: Block, previousBlock: Block): boolean {
    const { index, timestamp, transactions, nonce, hash } = block;

    // Check if the block's index is one higher than the previous block's index
    if (index !== previousBlock.index + 1) {
      return false;
    }

    // Check if the previous block's hash matches the hash value stored in the current block
    if (previousBlock.hash !== block.previousHash) {
      return false;
    }

    // Check if the hash value of the block is valid by recalculating the hash using the block's data
    const calculatedHash = BlockchainUtils.calculateHash(
      index,
      block.previousHash,
      timestamp,
      transactions,
    );
    if (hash !== calculatedHash) {
      return false;
    }

    // Check if the proof-of-work requirement is satisfied
    const validProofOfWork =
      BlockchainUtils.proofOfWork(block.previousHash, transactions) === nonce;
    if (!validProofOfWork) {
      return false;
    }

    return true;
  }

  static consensus(blockchain: Block[], blocks: Block[]): Block[] {
    const longestChain = blocks;
    let currentLength = blockchain.length;

    // Iterate over all the blocks in the provided chain
    for (const block of blocks) {
      // Check if the block is valid and its length is longer than the current blockchain's length
      if (
        BlockchainUtils.validateBlock(
          block,
          longestChain[longestChain.length - 1],
        ) &&
        block.index > currentLength
      ) {
        currentLength = block.index;
        longestChain.push(block);
      }
    }

    // Replace the current blockchain with the longest valid chain found
    blockchain = longestChain;

    // Return the updated blockchain
    return blockchain;
  }
}
