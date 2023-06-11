import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlockchainService } from './blockchain.service';
import { TransactionDto } from './dto/transaction.dto/transaction.dto';

@ApiTags('blockchain')
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('blocks')
  @ApiOperation({ summary: 'Get all blocks' })
  @ApiResponse({ status: 200, description: 'The list of blocks.' })
  getBlocks() {
    return this.blockchainService.getBlocks();
  }

  // @Post('mine')
  // @ApiOperation({ summary: 'Mine a new block' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'The block has been successfully mined.',
  // })
  // mineBlock(@Body() transactionDto: TransactionDto) {
  //   this.blockchainService.addBlock(transactionDto);
  //   return { message: 'Block added' };
  // }

  @Post('transaction')
  @ApiOperation({ summary: 'Add a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been successfully added.',
  })
  addTransaction(@Body() transactionDto: TransactionDto) {
    this.blockchainService.addTransaction(transactionDto);
    return { message: 'Transaction added' };
  }

  @Get('validate')
  @ApiOperation({ summary: 'Validate the blockchain' })
  @ApiResponse({
    status: 200,
    description: 'The validation status of the blockchain.',
  })
  validateChain() {
    const isValid = this.blockchainService.validateChain();
    if (isValid) {
      return { message: 'Blockchain is valid' };
    } else {
      return { message: 'Blockchain is not valid' };
    }
  }
}
