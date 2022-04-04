import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { SaveRecommendUserDto, SkillForUserDto } from './save-recommend-user.dto';

@InputType()
export class SaveRecommendUserRequest extends BaseRequest {
  @Field(() => SaveRecommendUserDto, { nullable: true })
  condition: SaveRecommendUserDto;

  @Field(() => [SaveRecommendUserDto], { nullable: true })
  data: SaveRecommendUserDto[];
}

@InputType()
export class SkillForUserRequest extends BaseRequest {
  @Field(() => SkillForUserDto, { nullable: true })
  condition: SkillForUserDto;
}