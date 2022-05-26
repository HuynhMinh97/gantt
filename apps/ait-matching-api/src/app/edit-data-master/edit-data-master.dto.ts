import { BaseDto, ConditionDto, CreateByDto } from "@ait/core";
import { Field, ID, InputType, Int } from "@nestjs/graphql";


@InputType()
export class nameObj {
  @Field(() => String, { nullable: true })
  en_US: string;

  @Field(() => String, { nullable: true })
  ja_JP: string;

  @Field(() => String, { nullable: true })
  vi_VN: string;
}

@InputType()
export class DataMasterDto extends BaseDto {
  @Field(() => nameObj, { nullable: true })
  name?: nameObj;

  @Field(() => String, { nullable: true })
  collection?: string;

  @Field(() => Boolean, { nullable: true })
  active_flag?: boolean;
}

@InputType()
export class DataMasterSaveDto extends BaseDto {
  @Field(() => nameObj, { nullable: true })
  name?:nameObj;

   @Field(() => String, { nullable: true })
  collection?: string;

  @Field(() => Boolean, { nullable: true })
  active_flag?: boolean;
 
}
