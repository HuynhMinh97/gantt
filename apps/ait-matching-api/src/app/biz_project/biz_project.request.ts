import { BaseRequest } from '@ait/core';
import { Field, InputType } from '@nestjs/graphql';
import { BizProjectDto, GetProjectInfoDto } from './biz_project.dto';

@InputType()
export class BizProjectRequest extends BaseRequest {
  @Field(() => BizProjectDto, { nullable: true })
  condition: BizProjectDto;
  @Field(() => [BizProjectDto], { nullable: true })
  data: BizProjectDto;
}

@InputType()
export class GetBizProjectInfoRequest extends BaseRequest {
  @Field(() => GetProjectInfoDto, { nullable: true })
  condition: GetProjectInfoDto;
  @Field(() => [BizProjectDto], { nullable: true })
  data: BizProjectDto;
}

