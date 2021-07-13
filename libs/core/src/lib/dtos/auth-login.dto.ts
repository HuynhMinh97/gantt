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


@InputType()
export class RefreshToken {
  @Field(() => String, { nullable: true })
  refresh_token?: string;

}
