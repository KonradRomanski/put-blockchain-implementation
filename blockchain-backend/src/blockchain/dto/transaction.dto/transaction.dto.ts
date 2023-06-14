import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto {
  @ApiProperty()
  readonly amount: number;

  @ApiProperty()
  readonly sender: string;

  @ApiProperty()
  readonly receiver: string;

  @ApiProperty()
  readonly private_key: string;

  readonly hash: string;
}
