import { BaseRequest } from '@ait/core';
import { Field, InputType } from '@nestjs/graphql';
import { MyQueriesDto, SearchMyQueriesDto } from './my-queries.dto';

@InputType()
export class MyQueriesRequest extends BaseRequest {
  @Field(() => MyQueriesDto, { nullable: true })
  condition: MyQueriesDto;
  @Field(() => [MyQueriesDto], { nullable: true })
  data: MyQueriesDto;
}

@InputType()
export class MyQueriesSearchRequest extends BaseRequest{
    @Field(() => SearchMyQueriesDto, { nullable: true })
    condition: SearchMyQueriesDto;
}
