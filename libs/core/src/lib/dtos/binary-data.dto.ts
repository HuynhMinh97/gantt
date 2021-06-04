import { BaseDto } from './base.dto';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class BinaryDataDto extends BaseDto {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  file_type?: string;

  @Field(() => Int, { nullable: true })
  size?: number;

  @Field(() => String, { nullable: true })
  data_base64?: string;

  @Field(() => String, { nullable: true })
  base64?: string;
}
