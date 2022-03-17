import {
  InputType,
  Field,
} from '@nestjs/graphql';
import { BaseDto } from './base.dto';

@InputType()
export class SaveTempDto extends BaseDto {
  @Field(() => String, { nullable: true })
  module?: string;
  
  @Field(() => String, { nullable: true })
  page?: string;

  @Field(() => String, { nullable: true })
  mode?: string;

  @Field(() => String, { nullable: true })
  edit_id?: string;

  @Field(() => String, { nullable: true })
  data?: string;
}
