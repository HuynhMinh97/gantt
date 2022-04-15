import { BaseRequest } from '@ait/core';
import { Field, InputType } from '@nestjs/graphql';
import { SearchSkillListDto, SkillListDto } from './skill_list.dto';

@InputType()
export class SkillListRequest extends BaseRequest {
  @Field(() => SkillListDto, { nullable: true })
  condition: SkillListDto;
  @Field(() => [SkillListDto], { nullable: true })
  data: SkillListDto;
}

@InputType()
export class SkillListSearchRequest extends BaseRequest{
    @Field(() => SearchSkillListDto, { nullable: true })
    condition: SearchSkillListDto;
}
