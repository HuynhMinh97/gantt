import { BaseRequest } from '@ait/core';
import { Field, InputType } from '@nestjs/graphql';
import {
  BizProjectDto,
  BizProjectSaveDto,
  BizProjectDetailDto,
} from './biz_project.dto';

@InputType()
export class BizProjectRequest extends BaseRequest {
  @Field(() => BizProjectDto, { nullable: true })
  condition: BizProjectDto;
  @Field(() => [BizProjectSaveDto], { nullable: true })
  data: BizProjectSaveDto;
}

@InputType()
export class BizProjectDetailRequest extends BaseRequest {
  @Field(() => BizProjectDetailDto, { nullable: true })
  condition: BizProjectDetailDto;
  @Field(() => [BizProjectDetailDto], { nullable: true })
  data: BizProjectDetailDto;
}
