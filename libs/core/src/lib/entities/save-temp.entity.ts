import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from './base.entity';

@ObjectType()
export class SaveTempEntity extends BaseEntity {
  @Field(() => String, { nullable: true })
  module?: string;

  @Field(() => String, { nullable: true })
  page?: string;

  @Field(() => String, { nullable: true })
  mode?: string;

  @Field(() => String, { nullable: true })
  edit_id?: string;

  @Field(() => String, { nullable: true })
  data?: string;
}
