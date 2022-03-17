import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class AuthValidatedInput {
  @Field(() => String)
  refresh_token?: string;
}

@ObjectType()
export class ValidatedToken {
  @Field(() => Boolean)
  token_valid: boolean;

  @Field(() => Number)
  timeLog: number;
}
