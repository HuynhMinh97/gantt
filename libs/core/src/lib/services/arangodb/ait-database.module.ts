import { Module } from '@nestjs/common';
import { databaseProviders } from './ait-database.providers';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class AitDatabaseModule {}
