import { COLLECTIONS, KEYS, OPERATOR } from '@ait/shared';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RefCondition {
  @Field(() => String, { nullable: true })
  company: string;

  @Field(() => String, { nullable: true })
  class: string;

  @Field(() => String, { nullable: true })
  code: string;

  @Field(() => String, { nullable: true })
  parent_code: string;

  @Field(() => Boolean, { nullable: true })
  active_flag: boolean;
}
@InputType()
export class ConditionDto {
  // Các toán tử cho phép ở trong enum OPERATOR
  @Field(() => String, { nullable: true, defaultValue: OPERATOR.IN })
  operator: string;
  // giá trị tìm kiếm, input mảng
  @Field(() => [String], { nullable: true, defaultValue: [] })
  value: string[];
  // Trường liên kết ở collection gốc
  @Field(() => String, { nullable: true })
  attribute: string;
  // Collection liên kết
  @Field(() => String, {
    nullable: true,
    defaultValue: COLLECTIONS.MASTER_DATA,
  })
  ref_collection: string;
  // Attribute trỏ tới
  @Field(() => String, { nullable: true })
  ref_attribute: string;
  // Điều kiện liên kết
  @Field(() => RefCondition, { nullable: true })
  ref_condition: RefCondition;
  // Giá trị trả về
  @Field(() => String, { nullable: true })
  return_field: string;
  // Định nghĩa _key ở cặp key-value trả về, mặc định là code
  @Field(() => String, { nullable: true, defaultValue: KEYS.CODE })
  get_by: string;
}
