import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto {
  @ApiProperty({ description: 'The sender of the transaction' })
  readonly sender: string;

  @ApiProperty({ description: 'The recipient of the transaction' })
  readonly recipient: string;

  @ApiProperty({ description: 'The amount of the transaction' })
  readonly amount: number;
}
