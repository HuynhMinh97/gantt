import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { UserSkillDto } from './user-skill.dto';

@InputType()
export class UserSkillRequest extends BaseRequest {
  @Field(() => UserSkillDto, { nullable: true })
  condition: UserSkillDto;

  @Field(() => [UserSkillDto], { nullable: true })
  data: UserSkillDto[];
}
