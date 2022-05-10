import { BaseEntity } from "@ait/core";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserListEntity extends BaseEntity  {
  @Field(() => String, { nullable: true })
  username: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  password: string;
}