import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class KeyValueEntity {
  @Field(() => String, { nullable: true })
  _key: string;

  @Field(() => String, { nullable: true })
  value: string;
}
