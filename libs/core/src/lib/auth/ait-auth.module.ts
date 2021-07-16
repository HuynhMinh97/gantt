import { SECRET_KEY } from '@ait/shared';
import { DynamicModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from '../resolvers/auth.resolver';
import { AuthService } from '../services/ait-auth.service';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { AitJwtStrategy } from './ait-jwt.strategy';
import { AitDatabaseModule } from '../services/arangodb/ait-database.module';
import { AitBaseService } from '../services/ait-base.service';

@Module({
  imports: [
    JwtModule.register({
      secret: SECRET_KEY,
      signOptions: { expiresIn: '3600000s' }
    }),
  ],
  providers: [AuthResolver, AuthService, AitJwtStrategy, GqlAuthGuard, AitBaseService],
  exports: [ GraphQLModule, JwtModule],
})
export class AitAuthModule {
  static forRoot(environment): DynamicModule {
    return {
      module: AitAuthModule,
      imports: [
        AitDatabaseModule.forRoot(environment),
        GraphQLModule.forRoot({
          autoSchemaFile: 'schema.gql',
          path: environment.APP.GRAPHQL_PREFIX,
        }),
      ],
      providers: [
        {
          provide: 'ENVIRONMENT',
          useValue: environment
        }
      ],
    }
  }
}
