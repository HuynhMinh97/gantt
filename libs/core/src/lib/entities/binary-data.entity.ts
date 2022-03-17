import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from './base.entity';

@ObjectType()
export class BinaryDataEntity extends BaseEntity {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  file_type?: string;

  @Field(() => Int, { nullable: true })
  size?: number;

  @Field(() => String, { nullable: true })
  data_base64?: string;

  @Field(() => String, { nullable: true })
  base64?: string;
}
