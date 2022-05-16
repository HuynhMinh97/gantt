import { BaseRequest } from "@ait/core";
import { Field, InputType } from "@nestjs/graphql";
import { SkillRegisterDto, SkillRegisterSaveDto } from "./add-skill.dto";

@InputType()
export class SkillRegisterRequest extends BaseRequest {
  @Field(() => SkillRegisterDto, { nullable: true })
  condition: SkillRegisterDto;

  @Field(() => [SkillRegisterSaveDto], { nullable: true })
  data: SkillRegisterSaveDto;
}

@InputType()
export class SkillRegisterSaveRequest extends BaseRequest{
    @Field(() => SkillRegisterSaveDto, { nullable: true })
    condition: SkillRegisterSaveDto;

    @Field(() => [SkillRegisterSaveDto], { nullable: true })
  data: SkillRegisterSaveDto;
}