import { BaseRequest } from '@ait/core';
import { Field, InputType } from '@nestjs/graphql';
import {
  BizProjectDto,
  BizProjectSaveDto,
  BizProjectDetailDto,
  GetProjectInfoDto,
  BizProjectDetailSaveDto,
  BizProjectSkillDto,
} from './biz_project.dto';

@InputType()
export class BizProjectRequest extends BaseRequest {
  @Field(() => BizProjectDto, { nullable: true })
  condition: BizProjectDto;
  @Field(() => [BizProjectSaveDto], { nullable: true })
  data: BizProjectSaveDto[];
}

@InputType()
export class BizProjectDetailRequest extends BaseRequest {
  @Field(() => BizProjectDetailDto, { nullable: true })
  condition: BizProjectDetailDto;
  @Field(() => [BizProjectDetailDto], { nullable: true })
  data: BizProjectDetailDto[];
}

@InputType()
export class BizProjectDetailSaveRequest extends BaseRequest {
  @Field(() => BizProjectDetailSaveDto, { nullable: true })
  condition: BizProjectDetailSaveDto;
  @Field(() => [BizProjectDetailSaveDto], { nullable: true })
  data: BizProjectDetailSaveDto[];
}

@InputType()
export class GetBizProjectInfoRequest extends BaseRequest {
  @Field(() => GetProjectInfoDto, { nullable: true })
  condition: GetProjectInfoDto;
  @Field(() => [BizProjectDto], { nullable: true })
  data: BizProjectDto[];
}

@InputType()
export class BizProjectSkillRequest extends BaseRequest {
  @Field(() => BizProjectSkillDto, { nullable: true })
  condition: BizProjectSkillDto;

  @Field(() => [BizProjectSkillDto], { nullable: true })
  data: BizProjectSkillDto[];
}
