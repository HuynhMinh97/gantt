import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { SaveUserJobAlertDto, UserJobAlertDto } from './user_job_alert.dto';

@InputType()
export class UserJobAlertRequest extends BaseRequest {
  @Field(() => UserJobAlertDto, { nullable: true })
  condition: UserJobAlertDto;

  @Field(() => [SaveUserJobAlertDto], { nullable: true })
  data: SaveUserJobAlertDto;
}