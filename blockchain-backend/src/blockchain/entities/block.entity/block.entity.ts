import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Block {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timestamp: Date;

  @Column()
  nonce: string;

  @Column()
  previousHash: string;

  @Column('json')
  transaction: object;

  @Column()
  hash: string;
}
