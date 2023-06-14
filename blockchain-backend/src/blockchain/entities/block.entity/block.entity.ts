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
  transactions: string;

  @Column()
  hash: string;
}
