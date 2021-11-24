import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class CodeValueEntity {
  @Field(() => String, { nullable: true })
  code: string;

  @Field(() => String, { nullable: true })
  value: string;
}
