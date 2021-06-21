import { BaseDto } from './base.dto';
import { InputType, Field, Int, OmitType } from '@nestjs/graphql';
import { ConditionDto } from './condition.dto';

@InputType()
export class BinaryDataDto extends OmitType(BaseDto, ['_key'] as const) {

  @Field(() => ConditionDto, { nullable: true })
  _key?: ConditionDto;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  file_type?: string;

  @Field(() => Int, { nullable: true })
  size?: number;

  @Field(() => String, { nullable: true })
  data_base64?: string;
}


@InputType()
export class BinaryRemoveDataDto extends BaseDto {


  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  file_type?: string;

  @Field(() => Int, { nullable: true })
  size?: number;

  @Field(() => String, { nullable: true })
  data_base64?: string;
}
