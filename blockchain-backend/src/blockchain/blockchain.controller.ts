import { Body, Controller, Get, Post } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { TransactionDto } from './dto/transaction.dto/transaction.dto';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('blocks')
  getBlocks() {
    return this.blockchainService.getBlocks();
  }

  @Post('mine')
  mineBlock(@Body() transactionDto: TransactionDto) {
    this.blockchainService.addBlock(transactionDto);
    return { message: 'Block added' };
  }

  @Get('validate')
  validateChain() {
    const isValid = this.blockchainService.validateChain();
    if (isValid) {
      return { message: 'Blockchain is valid' };
    } else {
      return { message: 'Blockchain is not valid' };
    }
  }
}
