import { Field, InputType } from '@nestjs/graphql';
import { OptionDto } from '../dtos/option.dto';

@InputType()
export class BaseRequest {
  @Field(() => String)
  company: string;

  @Field(() => String)
  lang: string;

  @Field(() => String, { nullable: true })
  collection: string;

  @Field(() => String, { nullable: true })
  user_id: string;

  @Field(() => String, { nullable: true })
  module: string;

  @Field(() => String, { nullable: true })
  page: string;

  @Field(() => OptionDto, { nullable: true })
  options: OptionDto;
}
