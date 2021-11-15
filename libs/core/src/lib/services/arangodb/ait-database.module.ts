import { DynamicModule, Module } from '@nestjs/common';
import { databaseProviders } from './ait-database.providers';

@Module({

})
export class AitDatabaseModule {
  static forRoot(environment): DynamicModule {
    const databaseProvider = databaseProviders(environment);
    return {
      module: AitDatabaseModule,
      providers: [
        ...databaseProvider
      ],
      exports: [
        ...databaseProvider
      ],
    }
  }
}
