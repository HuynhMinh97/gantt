import { BaseEntity } from './../../../../../../libs/core/src/lib/entities/base.entity';
import { Field, Float, ObjectType } from '@nestjs/graphql';
import { KeyValueEntity } from '@ait/core';

@ObjectType()
export class UserSkillEntity extends BaseEntity {

    @Field(() => String, { nullable: true })
  relationship?: string;

  @Field(() => Float, { nullable: true })
  sort_no?: number;
}