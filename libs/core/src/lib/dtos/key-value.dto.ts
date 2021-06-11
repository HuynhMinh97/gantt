import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class KeyValueDto {
  @Field(() => String, { nullable: true })
  _key: string;

  @Field(() => String, { nullable: true })
  value: string;
}
