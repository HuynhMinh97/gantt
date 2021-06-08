/* eslint-disable @typescript-eslint/no-explicit-any */
import { RESULT_STATUS, STRING_EMPTY, Utils } from '@ait/shared';

export class BaseResponse {
  status: RESULT_STATUS = RESULT_STATUS.OK;
  message = STRING_EMPTY;
  errors: string;
  data: any;
  numData?: number = 0;
  numError?: number = 0;

  constructor(status: number, result: any[], message: string) {
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
