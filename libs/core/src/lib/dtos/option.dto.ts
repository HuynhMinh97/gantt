import { KEYS, ORDER_BY } from "@ait/shared";
import { InputType, Field, Int } from "@nestjs/graphql";

@InputType()
export class SortOptionDto {
  @Field(() => String, { nullable: true, defaultValue: KEYS.CREATE_AT })
  value: string;

  @Field(() => String, { nullable: true, defaultValue: ORDER_BY.ASC })
  order_by: string;
}

@InputType()
export class OptionDto {
  @Field(() => Int, { nullable: true })
  limit: number;

  @Field(() => SortOptionDto, { nullable: true })
  sort_by: SortOptionDto;
}
