import { InputType, ID, Float, Field } from '@nestjs/graphql';
import { ChangeByDto } from './change-by.dto';
import { CreateByDto } from './create-by.dto';

@InputType()
export class BaseDto {
  @Field(() => ID, { nullable: true })
  _key: string;

  @Field(() => String, { nullable: true })
  company: string;

  @Field(() => String, { nullable: true })
  user_id: string;

  @Field(() => Float, { nullable: true })
  create_at: number;

  @Field(() => CreateByDto, { nullable: true })
  create_by: CreateByDto;

  @Field(() => Float, { nullable: true })
  change_at: number;

  @Field(() => ChangeByDto, { nullable: true })
  change_by: ChangeByDto;

  @Field(() => Boolean, { nullable: true })
  del_flag: boolean;

  @Field(() => Boolean, { nullable: true })
  active_flag?: boolean;
}
