import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LangEntity {
  @Field(() => String, { nullable: true })
  en_US: string;

  @Field(() => String, { nullable: true })
  ja_JP: string;

  @Field(() => String, { nullable: true })
  vi_VN: string;
}
