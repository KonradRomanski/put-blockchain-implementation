import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlockchainModule } from './blockchain/blockchain.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ormconfig = require('../ormconfig.json');

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), BlockchainModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
