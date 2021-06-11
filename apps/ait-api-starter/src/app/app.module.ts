import { AitCoreModule, AitAuthModule } from '@ait/core';
import { Module } from '@nestjs/common';
import { environment } from '../environments/environment';
import { ExampleResolver } from './example-graphql/example.resolver';
import { ExampleRestController } from './example-rest/example-rest.controller';

const RESOLVERS = [ExampleResolver];
@Module({
  imports: [
    AitCoreModule.forRoot(environment),
    AitAuthModule.forRoot(environment)
  ],
  controllers: [ExampleRestController],
  providers: [...RESOLVERS],
})
export class AppModule {}
