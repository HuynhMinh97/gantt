import { RESULT_STATUS, Utils } from "@ait/shared";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { LanguageListEntity } from "./language-list.entity";

@ObjectType()
export class LanguageListResponse {
    @Field(() => [LanguageListEntity], { nullable: true })
    data?: LanguageListEntity[];
    
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

    constructor(status: number, result: LanguageListEntity[], message: string) {
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