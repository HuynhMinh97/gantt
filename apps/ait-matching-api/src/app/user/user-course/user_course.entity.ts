import { BaseEntity, KeyValueEntity } from '@ait/core';
import { ObjectType, Int, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class CourseEntity extends BaseEntity {
  @Field(() => KeyValueEntity, { nullable: true })
  course_name?: KeyValueEntity;

  @Field(() => Boolean, { nullable: true })
  is_online?: boolean;

  @Field(() => KeyValueEntity, { nullable: true })
  training_center?: KeyValueEntity;

  @Field(() => String, { nullable: true })
  course_number?: string;

  @Field(() => Float, { nullable: true })
  start_date_from?: number;

  @Field(() =>Float, { nullable: true })
  start_date_to?: number;

  @Field(() => String, { nullable: true })
  description?: string;
  
  @Field(() => [String], { nullable: true })
  file?: string[];

}
