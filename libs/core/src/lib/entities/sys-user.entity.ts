import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { BaseRequest } from '../requests/base.request';

@ObjectType()
export class SysUser {
  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  company?: string;

  @Field(() => String, { nullable: true })
  _key?: string;

  @Field(() => Int, { nullable: true })
  type?: number;
}

@InputType()
export class SysUserInput {
  @Field(() => String)
  _key?: string;
}

@InputType()
export class AitSysUserRequest extends BaseRequest {
  @Field(() => SysUserInput, { nullable: true })
  condition: SysUserInput;
}
