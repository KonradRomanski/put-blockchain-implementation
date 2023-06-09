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

  @Post('transaction')
  @ApiOperation({ summary: 'Add a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been successfully added.',
  })
  async addTransaction(@Body() transactionDto: TransactionDto) {
    const msg = await this.blockchainService.addTransaction(transactionDto);
    return { msg };
  }

  @Get('validate')
  @ApiOperation({ summary: 'Validate the blockchain' })
  @ApiResponse({
    status: 200,
    description: 'The validation status of the blockchain.',
  })
  validateChain() {
    const validationResult = this.blockchainService.validateChain();
    if (validationResult.isValid) {
      return { message: 'Blockchain is valid' };
    } else {
      return {
        message: 'Blockchain is not valid',
        errors: validationResult.errors,
      };
    }
  }

  @Get('key')
  @ApiOperation({ summary: 'Get the pair of cryptographic keys' })
  returnKey() {
    return this.blockchainService.generateKeyPair();
  }
}
