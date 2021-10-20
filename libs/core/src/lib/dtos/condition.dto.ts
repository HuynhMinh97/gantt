import { COLLECTIONS, KEYS, OPERATOR } from '@ait/shared';
import { InputType, Field, Float } from '@nestjs/graphql';

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
  //mannq update
  // Các toán tử cho phép ở trong enum OPERATOR
  @Field(() => String, { nullable: true, defaultValue: OPERATOR.IN })
  operator: string;
  // giá trị tìm kiếm, input mảng
  @Field(() => [String], { nullable: true, defaultValue: [] })
  value: string[];
  // Trỏ đến attribute liên kết nếu thuộc tính obj không trùng với tên cột
  @Field(() => String, { nullable: true })
  target: string;
  // giá trị tìm kiếm, input string
  @Field(() => String, { nullable: true, defaultValue: '' })
  valueAsString: string;
  // giá trị tìm kiếm, input number
  @Field(() => Float, { nullable: true })
  valueAsNumber: number;
}

@InputType()
export class FilterDto {
  // Các toán tử cho phép ở trong enum OPERATOR
  @Field(() => String, { nullable: true, defaultValue: OPERATOR.IN })
  operator: string;
  // Attribute trỏ tới ở cột join
  @Field(() => String, { nullable: true })
  attribute: string;
  // giá trị tìm kiếm, input mảng
  @Field(() => [String], { nullable: true, defaultValue: [] })
  value: string[];
  // giá trị tìm kiếm, input string
  @Field(() => String, { nullable: true, defaultValue: '' })
  valueAsString: string;
  // giá trị tìm kiếm, input number
  @Field(() => Float, { nullable: true })
  valueAsNumber: number;
}
@InputType()
export class ConditionDto {
  // Các toán tử cho phép ở trong enum OPERATOR
  @Field(() => String, { nullable: true, defaultValue: OPERATOR.IN })
  operator: string;
  // giá trị tìm kiếm, input mảng
  @Field(() => [String], { nullable: true, defaultValue: [] })
  value: string[];
  // Trỏ đến attribute liên kết nếu thuộc tính obj không trùng với tên cột
  @Field(() => String, { nullable: true })
  target: string;
  // Như trên nhưng trỏ đến nhiều cột, hỗ trợ biểu thức || -> hien tai chua support
  @Field(() => [String], { nullable: true })
  targets: string[];
  // giá trị tìm kiếm, input string
  @Field(() => String, { nullable: true, defaultValue: '' })
  valueAsString: string;
  // giá trị tìm kiếm, input number
  @Field(() => Float, { nullable: true })
  valueAsNumber: number;
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
  // return_field trả về có phải là đa ngôn ngữ hay k
  @Field(() => Boolean, { nullable: true })
  is_multi_language: boolean;
  // Định nghĩa _key ở cặp key-value trả về, mặc định là code
  @Field(() => String, { nullable: true, defaultValue: KEYS.CODE })
  get_by: string;
  // Tên cột sau khi join bảng
  @Field(() => String, { nullable: true })
  join_field: string;
  // Join bảng
  @Field(() => String, { nullable: true })
  join_collection: string;
  // Giá trị so sánh khi join bảng
  @Field(() => String, { nullable: true })
  join_target: string;
  // Giá trị so sánh khi join bảng
  @Field(() => String, { nullable: true })
  join_attribute: string;
  // Filter object cuối cùng trả về
  @Field(() => FilterDto, { nullable: true })
  filter_custom: FilterDto;
}
