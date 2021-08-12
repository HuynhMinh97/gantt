import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { SaveUserExperienceInfoDto, UserExperienceInfoDto } from './user-experience.dto';

@InputType()
export class UserExperienceInfoRequest extends BaseRequest {
  @Field(() => SaveUserExperienceInfoDto, { nullable: true })
  condition: SaveUserExperienceInfoDto;

  @Field(() => [SaveUserExperienceInfoDto], { nullable: true })
  data: SaveUserExperienceInfoDto;
}