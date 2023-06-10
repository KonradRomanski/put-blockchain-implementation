import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { TransactionDto } from './dto/transaction/transaction';
import {
  ApiResponse,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Blockchain')
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiBody({
    type: TransactionDto,
    description: 'Transaction data',
    examples: {
      example1: {
        value: {
          sender: 'John',
          recipient: 'Alice',
          amount: 10,
        },
        summary: 'Example of a valid transaction',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() transactionDto: TransactionDto) {
    return this.blockchainService.create(transactionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of transactions.',
  })
  findAll() {
    return this.blockchainService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a transaction by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the transaction',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the details of the transaction.',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  findOne(@Param('id') id: string) {
    return this.blockchainService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a transaction by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the transaction',
    example: '1',
  })
  @ApiBody({
    type: TransactionDto,
    description: 'Updated transaction data',
    examples: {
      example1: {
        value: {
          sender: 'John',
          recipient: 'Alice',
          amount: 20,
        },
        summary: 'Example of an updated transaction',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The transaction has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  update(@Param('id') id: string, @Body() transactionDto: TransactionDto) {
    return this.blockchainService.update(+id, transactionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the transaction',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'The transaction has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  remove(@Param('id') id: string) {
    return this.blockchainService.remove(+id);
  }
}
