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
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Blockchain')
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Creates a new transaction' })
  create(@Body() transactionDto: TransactionDto) {
    return this.blockchainService.create(transactionDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Retrieves the blockchain' })
  findAll() {
    return this.blockchainService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blockchainService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() transactionDto: TransactionDto) {
    return this.blockchainService.update(+id, transactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blockchainService.remove(+id);
  }
}
