import { BaseRequest } from '@ait/core';
import { Field, InputType } from '@nestjs/graphql';
import { BizProjectDto } from './biz_project.dto';

@InputType()
export class BizProjectRequest extends BaseRequest {
  @Field(() => BizProjectDto, { nullable: true })
  condition: BizProjectDto;
  @Field(() => [BizProjectDto], { nullable: true })
  data: BizProjectDto;
}
