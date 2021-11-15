import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class LangDto {
  @Field(() => String, { nullable: true })
  en_US: string;

  @Field(() => String, { nullable: true })
  ja_JP: string;

  @Field(() => String, { nullable: true })
  vi_VN: string;
}
