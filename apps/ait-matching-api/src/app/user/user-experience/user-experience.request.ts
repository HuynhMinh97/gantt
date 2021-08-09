import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { UserExperienceInfoDto } from './user-experience.dto';

@InputType()
export class UserExperienceInfoRequest extends BaseRequest {
  @Field(() => UserExperienceInfoDto, { nullable: true })
  condition: UserExperienceInfoDto;

  @Field(() => [UserExperienceInfoDto], { nullable: true })
  data: UserExperienceInfoDto;
}