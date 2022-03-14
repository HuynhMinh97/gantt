import { BaseEntity, KeyValueEntity } from "@ait/core";
import { Field, Float, InputType, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class EducationListEntity extends BaseEntity  {

  @Field(() => String, { nullable: true })
  user_id: string;

  @Field(() => String, { nullable: true })
  degree: string;

  @Field(() => String, { nullable: true })
  field_of_study: string;

  @Field(() => String, { nullable: true })
  grade: string;

  @Field(() => KeyValueEntity, { nullable: true })
  school: KeyValueEntity;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => Float, { nullable: true })
  start_date_from: number;

  @Field(() => String, { nullable: true })
  first_name?: string;

  @Field(() => String, { nullable: true })
  last_name?: string;
}