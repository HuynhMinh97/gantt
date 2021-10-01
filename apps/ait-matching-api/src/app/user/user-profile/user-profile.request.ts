import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { SaveUserProfileDto, UserProfileDto } from './user-profile.dto';


@InputType()
export class UserProfileRequest extends BaseRequest {
  @Field(() => UserProfileDto, { nullable: true })
  condition: UserProfileDto;

  @Field(() => [SaveUserProfileDto], { nullable: true })
  data: SaveUserProfileDto[];
}
