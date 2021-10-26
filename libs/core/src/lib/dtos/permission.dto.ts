import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class PermissionInputDto {
  @Field(() => String, { nullable: true })
  page_key: string;

  @Field(() => String, { nullable: true,})
  module_key: string;

  @Field(() => String, { nullable: true,})
  user_key: string;
}


@ObjectType()
export class PermissionOutput {
  @Field(() => String, { nullable: true })
  page: string;

  @Field(() => String, { nullable: true })
  module: string;

  @Field(() => [String], { nullable: true,})
  permission: string[];

  @Field(() => String, { nullable: true,})
  user_id: string;
}
