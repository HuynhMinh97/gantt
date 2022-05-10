import { Field, Int, InputType } from '@nestjs/graphql';

@InputType()
export class AuthRegisterInput {
  @Field(() => String, { nullable: true })
  _key?: string;

  @Field(() => String)
  email?: string;

  @Field(() => String)
  password?: string;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  company?: string;

  @Field(() => Int, { nullable: true })
  type?: number;

  @Field(() => Boolean, { nullable: true })
  del_flag?: boolean;

  @Field(() => Boolean, { nullable: true })
  active_flag?: boolean;
}
