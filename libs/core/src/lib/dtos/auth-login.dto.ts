import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AuthLoginInput {
  @Field(() => String, { nullable: true })
  _key?: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
