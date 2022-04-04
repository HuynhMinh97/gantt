import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { SearchConditionDto, SaveSearchConditionDto } from './search-condition.dto';

@InputType()
export class SearchConditionRequest extends BaseRequest {
  @Field(() => SearchConditionDto, { nullable: true })
  condition: SearchConditionDto;

  @Field(() => [SaveSearchConditionDto], { nullable: true })
  data: SaveSearchConditionDto[];
}
