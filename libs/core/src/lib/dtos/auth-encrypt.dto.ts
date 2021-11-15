import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AuthPasswordEncrypt {
  @Field(() => String)
  hashedPasswod?: string;
}
