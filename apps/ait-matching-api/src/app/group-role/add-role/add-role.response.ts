import { RESULT_STATUS, Utils } from "@ait/shared";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { EmployeeEntity, RoleUserInfoEntity } from "./add-role.entity";

@ObjectType()
export class EmployeeResponse {
    @Field(() => [EmployeeEntity], { nullable: true })
    data?: EmployeeEntity[];
    
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

    constructor(status: number, result: EmployeeEntity[], message: string) {
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
export class RoleUserInfoResponse {
    @Field(() => [RoleUserInfoEntity], { nullable: true })
    data?: RoleUserInfoEntity[];
    
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

    constructor(status: number, result: RoleUserInfoEntity[], message: string) {
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