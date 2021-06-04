// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AitCoreModule, AitAuthModule } from '@ait/core';
import { Module } from '@nestjs/common';
import { ExampleResolver } from './example-graphql/example.resolver';
import { ExampleRestController } from './example-rest/example-rest.controller';

const RESOLVERS = [ExampleResolver];
@Module({
  imports: [
    AitCoreModule,
    AitAuthModule
  ],
  controllers: [ExampleRestController],
  providers: [...RESOLVERS],
})
export class AppModule {}
