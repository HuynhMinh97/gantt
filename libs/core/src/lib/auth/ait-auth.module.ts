import { SECRET_KEY } from '@ait/shared';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from '../resolver/auth.resolver';
import { AuthService } from '../services/ait-auth.service';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { AitJwtStrategy } from './ait-jwt.strategy';
import { AitDatabaseModule } from '../services/arangodb/ait-database.module';
import { AitBaseService } from '../services/ait-base.service';

@Module({
  imports: [
    AitDatabaseModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      path: 'api/v1',
    }),
    JwtModule.register({
      secret: SECRET_KEY,
      signOptions: { expiresIn: '3600000s' }
    }),
  ],
  providers: [AuthResolver, AuthService, AitJwtStrategy, GqlAuthGuard, AitBaseService],
  exports: [AitDatabaseModule, GraphQLModule, JwtModule],
})
export class AitAuthModule {}
