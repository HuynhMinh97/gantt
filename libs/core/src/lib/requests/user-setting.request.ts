import { InputType, Field } from '@nestjs/graphql';
import { UserSettingDto } from '../dtos/user-setting.dto';
import { BaseRequest } from './base.request';

@InputType()
export class UserSettingRequest extends BaseRequest {
  @Field(() => UserSettingDto, { nullable: true })
  condition: UserSettingDto;

  @Field(() => [UserSettingDto], { nullable: true })
  data: UserSettingDto[];
}
