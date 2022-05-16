import { BaseRequest } from "@ait/core";
import { Field, InputType } from "@nestjs/graphql";
import { CaptionRegisterDto, CaptionRegisterSaveDto } from "./add-caption.dto";

@InputType()
export class CaptionRegisterRequest extends BaseRequest {
  @Field(() => CaptionRegisterDto, { nullable: true })
  condition: CaptionRegisterDto;

  @Field(() => [CaptionRegisterSaveDto], { nullable: true })
  data: CaptionRegisterSaveDto;
}

@InputType()
export class CaptionRegisterSaveRequest extends BaseRequest{
    @Field(() => CaptionRegisterSaveDto, { nullable: true })
    condition: CaptionRegisterSaveDto;

    @Field(() => [CaptionRegisterSaveDto], { nullable: true })
  data: CaptionRegisterSaveDto;
}