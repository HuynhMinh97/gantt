import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AitDatabaseModule } from './services/arangodb/ait-database.module';
import { AitBaseService } from './services/ait-base.service';
import { AitLogger } from './utils/ait-logger.util';
import { BinaryResolver } from './resolvers/binary.resolver';
import { SystemResolver } from './resolvers/system.resolver';
import { UserSettingResolver } from './resolvers/user-setting.resolver';

const RESOLVERS = [
  SystemResolver,
  BinaryResolver,
  UserSettingResolver
]
@Module({
  imports: [
    AitLogger,
    AitDatabaseModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      path:'api/v1'
    }),
  ],
  controllers: [],
  providers: [
    ...RESOLVERS,
    AitBaseService,
  ],
  exports: [
    AitBaseService,
    AitLogger,
    AitDatabaseModule,
    GraphQLModule
  ]
})
export class AitCoreModule {}
