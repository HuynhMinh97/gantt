import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { ExampleDto } from './example.dto';

@InputType()
export class ExampleRequest extends BaseRequest {
  @Field(() => ExampleDto, { nullable: true })
  condition: ExampleDto;

  @Field(() => [ExampleDto], { nullable: true })
  data: ExampleDto[];
}


client => {
  
}