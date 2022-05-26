import { BaseDto, ConditionDto, CreateByDto } from "@ait/core";
import { Field, ID, InputType, Int } from "@nestjs/graphql";


@InputType()
export class MasterListDto extends BaseDto  {
  
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  collection?: string;

  @Field(() => String, { nullable: true })
  status?: string;

 
}

@InputType()
export class SearchMasterListDto extends BaseDto  {
  
  @Field(() => ConditionDto, { nullable: true })
  name?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  _id?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  collection?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  status?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  create_at_from?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  create_at_to?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  change_at_from?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  change_at_to?: ConditionDto;

}