import { DynamicModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AitDatabaseModule } from './services/arangodb/ait-database.module';
import { AitBaseService } from './services/ait-base.service';
import { AitLogger } from './utils/ait-logger.util';
import { BinaryResolver } from './resolvers/binary.resolver';
import { SystemResolver } from './resolvers/system.resolver';
import { UserSettingResolver } from './resolvers/user-setting.resolver';
import { SaveTempResolver } from './resolvers/save-temp.resolver';
import { PermissionResolver } from './resolvers/permission.resolver';
import { PageRenderResolver } from './resolvers/page-render.resolver';

const RESOLVERS = [
  SystemResolver,
  BinaryResolver,
  SaveTempResolver,
  UserSettingResolver,
  PermissionResolver,
  PageRenderResolver
]
@Module({
  imports: [
    AitLogger
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
export class AitCoreModule {

  static forRoot(environment): DynamicModule {
    return {
      module: AitCoreModule,
      imports: [
        AitDatabaseModule.forRoot(environment),
        GraphQLModule.forRoot({
          autoSchemaFile: 'schema.gql',
          path: environment.APP.GRAPHQL_PREFIX
        }),],

      providers: [
        {
          provide: 'ENVIRONMENT',
          useValue: environment
        }
      ],
    };
  }
}
