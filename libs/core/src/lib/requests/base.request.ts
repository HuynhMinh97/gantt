import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class BaseRequest {
  @Field(() => String)
  company: string;

  @Field(() => String)
  lang: string;

  @Field(() => String, { nullable: true })
  collection: string;

  @Field(() => String, { nullable: true })
  user_id: string;
}
