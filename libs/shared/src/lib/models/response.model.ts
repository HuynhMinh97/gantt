/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { STRING_EMPTY } from '../commons/consts';
import { RESULT_STATUS } from '../commons/enums';
import { Utils } from '../utils/utils';
import { MessageModel } from './message.model';

export class ResponseModel {
  status: RESULT_STATUS = RESULT_STATUS.OK;
  message = STRING_EMPTY;
  errors: MessageModel[] = [];
  data: any;
  numError = 0;
  numData = 0;

  constructor(status: RESULT_STATUS, result: any) {
    this.status = status;
    switch (status) {
      case RESULT_STATUS.OK:
        this.data = result;
        this.numData = Utils.len(result);
        break;
      case RESULT_STATUS.ERROR:
        this.errors = result;
        this.numError = Utils.len(result);
        break;
      case RESULT_STATUS.INFO:
      case RESULT_STATUS.EXCEPTION:
        this.message = result;
        break;
      default:
        break;
    }
  }
}
