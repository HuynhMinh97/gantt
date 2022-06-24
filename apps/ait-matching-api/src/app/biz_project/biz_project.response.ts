import { RESULT_STATUS, Utils } from '@ait/shared';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BizProjectEntity,
  GetProjectInforEntity,
  BizProjectDetailEntity,
  BizProjectSkillEntity,
  PlanEntity,
  BizProjectUserEntity,
} from './biz_project.entity';

@ObjectType()
export class BizProjectResponse {
  @Field(() => [BizProjectEntity], { nullable: true })
  data?: BizProjectEntity[];

  @Field(() => String, { nullable: true })
  errors?: string;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => Int, { nullable: true })
  status?: number = RESULT_STATUS.OK;

  @Field(() => Int, { nullable: true })
  numData?: number = 0;

  @Field(() => Int, { nullable: true })
  numError?: number = 0;

  constructor(status: number, result: BizProjectEntity[], message: string) {
    this.status = status;
    switch (status) {
      case RESULT_STATUS.OK:
        this.data = result;
        this.numData = Utils.len(result);
        break;
      case RESULT_STATUS.ERROR:
        this.errors = message;
        this.numError = Utils.len(result);
        break;
      case RESULT_STATUS.INFO:
      case RESULT_STATUS.EXCEPTION:
        this.message = message;
        break;
      default:
        break;
    }
  }
}

@ObjectType()
export class BizProjectDetailResponse {
  @Field(() => [BizProjectDetailEntity], { nullable: true })
  data?: BizProjectDetailEntity[];

  @Field(() => String, { nullable: true })
  errors?: string;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => Int, { nullable: true })
  status?: number = RESULT_STATUS.OK;

  @Field(() => Int, { nullable: true })
  numData?: number = 0;

  @Field(() => Int, { nullable: true })
  numError?: number = 0;

  constructor(
    status: number,
    result: GetProjectInforEntity[],
    message: string
  ) {
    this.status = status;
    switch (status) {
      case RESULT_STATUS.OK:
        this.data = result;
        this.numData = Utils.len(result);
        break;
      case RESULT_STATUS.ERROR:
        this.errors = message;
        this.numError = Utils.len(result);
        break;
      case RESULT_STATUS.INFO:
      case RESULT_STATUS.EXCEPTION:
        this.message = message;
        break;
      default:
        break;
    }
  }
}
@ObjectType()
export class GetBizProjectInforResponse {
  @Field(() => [GetProjectInforEntity], { nullable: true })
  data?: GetProjectInforEntity[];

  @Field(() => String, { nullable: true })
  errors?: string;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => Int, { nullable: true })
  status?: number = RESULT_STATUS.OK;

  @Field(() => Int, { nullable: true })
  numData?: number = 0;

  @Field(() => Int, { nullable: true })
  numError?: number = 0;

  constructor(
    status: number,
    result: BizProjectDetailEntity[],
    message: string
  ) {
    this.status = status;
    switch (status) {
      case RESULT_STATUS.OK:
        this.data = result;
        this.numData = Utils.len(result);
        break;
      case RESULT_STATUS.ERROR:
        this.errors = message;
        this.numError = Utils.len(result);
        break;
      case RESULT_STATUS.INFO:
      case RESULT_STATUS.EXCEPTION:
        this.message = message;
        break;
      default:
        break;
    }
  }
}

@ObjectType()
export class BizProjectSkillResponse {
  @Field(() => [BizProjectSkillEntity], { nullable: true })
  data?: BizProjectSkillEntity[];

  @Field(() => String, { nullable: true })
  errors?: string;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => Int, { nullable: true })
  status?: number = RESULT_STATUS.OK;

  @Field(() => Int, { nullable: true })
  numData?: number = 0;

  @Field(() => Int, { nullable: true })
  numError?: number = 0;

  constructor(
    status: number,
    result: BizProjectSkillEntity[],
    message: string
  ) {
    this.status = status;
    switch (status) {
      case RESULT_STATUS.OK:
        this.data = result;
        this.numData = Utils.len(result);
        break;
      case RESULT_STATUS.ERROR:
        this.errors = message;
        this.numError = Utils.len(result);
        break;
      case RESULT_STATUS.INFO:
      case RESULT_STATUS.EXCEPTION:
        this.message = message;
        break;
      default:
        break;
    }
  }
}

@ObjectType()
export class PlanResponse {
  @Field(() => [PlanEntity], { nullable: true })
  data?: PlanEntity[];

  @Field(() => String, { nullable: true })
  errors?: string;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => Int, { nullable: true })
  status?: number = RESULT_STATUS.OK;

  @Field(() => Int, { nullable: true })
  numData?: number = 0;

  @Field(() => Int, { nullable: true })
  numError?: number = 0;

  constructor(status: number, result: PlanEntity[], message: string) {
    this.status = status;
    switch (status) {
      case RESULT_STATUS.OK:
        this.data = result;
        this.numData = Utils.len(result);
        break;
      case RESULT_STATUS.ERROR:
        this.errors = message;
        this.numError = Utils.len(result);
        break;
      case RESULT_STATUS.INFO:
      case RESULT_STATUS.EXCEPTION:
        this.message = message;
        break;
      default:
        break;
    }
  }
}

@ObjectType()
export class BizProjectUserResponse {
  @Field(() => [BizProjectUserEntity], { nullable: true })
  data?: BizProjectUserEntity[];

  @Field(() => String, { nullable: true })
  errors?: string;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => Int, { nullable: true })
  status?: number = RESULT_STATUS.OK;

  @Field(() => Int, { nullable: true })
  numData?: number = 0;

  @Field(() => Int, { nullable: true })
  numError?: number = 0;

  constructor(status: number, result: BizProjectUserEntity[], message: string) {
    this.status = status;
    switch (status) {
      case RESULT_STATUS.OK:
        this.data = result;
        this.numData = Utils.len(result);
        break;
      case RESULT_STATUS.ERROR:
        this.errors = message;
        this.numError = Utils.len(result);
        break;
      case RESULT_STATUS.INFO:
      case RESULT_STATUS.EXCEPTION:
        this.message = message;
        break;
      default:
        break;
    }
  }
}
