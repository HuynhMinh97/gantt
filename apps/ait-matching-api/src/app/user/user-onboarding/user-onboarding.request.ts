import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { SaveUserOnboardingInfoDto, UserOnboardingInfoDto } from './user-onboarding.dto';

@InputType()
export class UserOnboardingInfoRequest extends BaseRequest {
  @Field(() => UserOnboardingInfoDto, { nullable: true })
  condition: UserOnboardingInfoDto;

  @Field(() => [SaveUserOnboardingInfoDto], { nullable: true })
  data: SaveUserOnboardingInfoDto;
}