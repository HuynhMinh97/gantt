import { BaseRequest } from "@ait/core";
import { Field, InputType } from "@nestjs/graphql";
import {  RegisterProjectDto, RegisterProjectSaveDto } from "./register-project.dto";

@InputType()
export class RegisterProjectRequest extends BaseRequest {
  @Field(() => RegisterProjectDto, { nullable: true })
  condition: RegisterProjectDto;

  @Field(() => [RegisterProjectSaveDto], { nullable: true })
  data: RegisterProjectSaveDto;
}

// @InputType()
// export class CaptionRegisterSaveRequest extends BaseRequest{
//     @Field(() => CaptionRegisterSaveDto, { nullable: true })
//     condition: CaptionRegisterSaveDto;

//     @Field(() => [CaptionRegisterSaveDto], { nullable: true })
//   data: CaptionRegisterSaveDto;
// }