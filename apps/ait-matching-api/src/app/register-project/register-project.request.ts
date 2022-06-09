import { BaseRequest } from '@ait/core';
import { Field, InputType } from '@nestjs/graphql';
import {
  CandidateDto,
  RegisterProjectDto,
  RegisterProjectSaveDto,
} from './register-project.dto';

@InputType()
export class RegisterProjectRequest extends BaseRequest {
  @Field(() => RegisterProjectDto, { nullable: true })
  condition: RegisterProjectDto;

  @Field(() => [RegisterProjectSaveDto], { nullable: true })
  data: RegisterProjectSaveDto;
}

@InputType()
export class CandidateRequest extends BaseRequest {
  @Field(() => CandidateDto, { nullable: true })
  condition: CandidateDto;

  @Field(() => [CandidateDto], { nullable: true })
  data: CandidateDto;
}
