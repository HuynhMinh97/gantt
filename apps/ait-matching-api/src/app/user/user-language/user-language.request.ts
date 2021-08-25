import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { SaveUserLanguageInfoDto, UserLanguageInfoDto } from './user-Language.dto';

@InputType()
export class UserLanguageInfoRequest extends BaseRequest {
  @Field(() => UserLanguageInfoDto, { nullable: true })
  condition: UserLanguageInfoDto;

  @Field(() => [SaveUserLanguageInfoDto], { nullable: true })
  data: SaveUserLanguageInfoDto;
}