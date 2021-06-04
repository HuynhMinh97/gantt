import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BaseRequest } from '../request/base.request';
import { BaseDto } from './base.dto';

@InputType()
export class AuthPasswordChangeData {
  @Field(() => String)
  user_id: string;
  @Field(() => String)
  old_password!: string;

  @Field(() => String)
  new_password!: string;
}

@InputType()
export class AuthPasswordChanged extends BaseRequest {
  @Field(() => [AuthPasswordChangeData], { nullable: true })
  data: [AuthPasswordChangeData];
}

@ObjectType()
export class AuthUserObject {
  @Field(() => String, { nullable: true })
  _key?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  username?: string;
}

@ObjectType()
export class AuthPasswordChangedOutput {
  @Field(() => Number, { nullable: true })
  status?: number;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => AuthUserObject, { nullable: true })
  data?: AuthUserObject;

  @Field(() => String, { nullable: true })
  error_code?: string;
}

@ObjectType()
export class AuthCheckPassword {
  @Field(() => Boolean)
  isMatched: boolean;
}

@InputType()
export class AuthCheckPasswordCondition {
  @Field(() => String)
  password: string;
}

@InputType()
export class AuthCheckPasswordInput extends BaseDto {
  @Field(() => AuthCheckPasswordCondition, { nullable: true })
  condition: AuthCheckPasswordCondition;
}
