import { BaseDto, ConditionDto } from '@ait/core';
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class ReorderSkillDto extends BaseDto {

  @Field(() => String, { nullable: true })
  _from?: string;

  @Field(() => String, { nullable: true })
  _to?: string;

  @Field(() => String, { nullable: true })
  relationship?: string;

  @Field(() => Float, { nullable: true })
  sort_no?: number;

  @Field(() => ConditionDto, { nullable: true })
  skills?: ConditionDto;

  @Field(() => String, { nullable: true })
  name?: string;
  
  @Field(() => String, { nullable: true })
  category?: string;
  
  @Field(() => ConditionDto, { nullable: true })
  top_skills?: ConditionDto; 

}
@InputType()
export class SaveReorderSkillDto extends BaseDto {
  @Field(() => String, { nullable: true })
  _from?: string;

  @Field(() => String, { nullable: true })
  _to?: string;

  @Field(() => String, { nullable: true })
  relationship?: string;

  @Field(() => Float, { nullable: true })
  sort_no?: number;

  @Field(() => ConditionDto, { nullable: true })
  skills?: ConditionDto;

  @Field(() => String, { nullable: true })
  name?: string;
  
  @Field(() => String, { nullable: true })
  category?: string;
  
  @Field(() =>[String], { nullable: true })
  top_skills?: string[]; 
}
