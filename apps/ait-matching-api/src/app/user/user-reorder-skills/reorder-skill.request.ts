import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { ReorderSkillDto, SaveReorderSkillDto } from './reorder-skill.dto';


@InputType()
export class ReorderSkillRequest extends BaseRequest {
  @Field(() => ReorderSkillDto, { nullable: true })
  condition: ReorderSkillDto;

  @Field(() => [SaveReorderSkillDto], { nullable: true })
  data: SaveReorderSkillDto[];
}
