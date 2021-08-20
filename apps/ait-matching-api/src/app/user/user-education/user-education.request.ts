import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { SaveUserEducationInfoDto, UserEducationInfoDto } from './user-education.dto';

@InputType()
export class UserEducationInfoRequest extends BaseRequest {
  @Field(() => UserEducationInfoDto, { nullable: true })
  condition: UserEducationInfoDto;

  @Field(() => [SaveUserEducationInfoDto], { nullable: true })
  data: SaveUserEducationInfoDto;
}