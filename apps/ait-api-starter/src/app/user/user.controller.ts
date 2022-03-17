/* eslint-disable @typescript-eslint/no-explicit-any */
import { AitBaseService } from '@ait/core';
import {
  RequestModel,
  ResponseModel,
  RESULT_STATUS,
  RequestCoreModel,
  KEYS,
  isArrayFull,
  KeyValueDto,
  isEqual,
  SYSTEM_COMPANY,
} from '@ait/shared';
import { Body, Controller, HttpService } from '@nestjs/common';
import { LOG_TEMPLATE } from '../commons/consts';
import { COLLECTIONS, OPERATOR } from '../commons/enums';
import { CommonUtils } from '../utils/utils';
import { BaseController } from './base.controllers';

@Controller('user')
export class UserController extends BaseController {
  constructor(aitBaseService: AitBaseService, httpSerivce: HttpService) {
    super(aitBaseService, httpSerivce);
  }

  /**
   *
   *
   * @private
   * @param {string} company
   * @param {*} reqConditon
   * @returns {Promise<any>}
   * @memberof MasterController
   * @author phuclq
   */
  private async getCodeNameMasterData(
    company: string,
    reqConditon: any
  ): Promise<any> {
    // initialize request core
    const req = new RequestCoreModel(COLLECTIONS.MASTER_DATA);
    const condition = {};
    condition[KEYS.COMPANY] = company;
    // get one or some projects with _key array
    if (reqConditon[KEYS.CLASS]) {
      if (isArrayFull(reqConditon[KEYS.CLASS])) {
        condition[KEYS.CLASS] = {
          value: reqConditon[KEYS.CLASS],
          operator: OPERATOR.IN,
        };
      } else {
        condition[KEYS.CLASS] = reqConditon[KEYS.CLASS];
      }
    }
    // set condition parent_code
    if (reqConditon['parent_code']) {
      if (isArrayFull(reqConditon['parent_code'])) {
        condition['parent_code'] = {
          value: reqConditon['parent_code'],
          operator: OPERATOR.IN,
        };
      } else {
        condition['parent_code'] = reqConditon['parent_code'];
      }
    }
    // set condition code
    if (reqConditon['code']) {
      if (isArrayFull(reqConditon['code'])) {
        condition['code'] = {
          value: reqConditon['code'],
          operator: OPERATOR.IN,
        };
      } else {
        condition['code'] = reqConditon['code'];
      }
    }
    // sort data
    req.sort = {
      class: KEYS.ASC,
      sort_no: KEYS.ASC,
      parent_code: KEYS.ASC,
      code: KEYS.ASC,
    };

    req.condition = condition;
    // call api
    // print request core api
    this.logger.log(LOG_TEMPLATE.REQUEST_CORE_MODEL);
    this.logger.log(JSON.stringify(req));

    const res = await this.get(req);
    if (res.status === RESULT_STATUS.OK) {
      // print response core api
      this.logger.log(LOG_TEMPLATE.RESPONSE_CORE_MODEL);
      this.logger.log(JSON.stringify(res.data));
      const ret = [];
      if (isArrayFull(res.data.data)) {
        res.data.data.forEach((item) => {
          let kv = {} as KeyValueDto;
          kv = CommonUtils.getKeyValue(item, this.lang);
          // set key
          kv._key = item[KEYS.CODE];
          kv.code = item[KEYS.CODE];
          kv.class = item[KEYS.CLASS];
          kv.parent_code = item['parent_code'];
          ret.push(kv);
        });
      }
      // print response data
      this.logger.log(LOG_TEMPLATE.RESPONSE_MODEL);
      this.logger.log(JSON.stringify(ret));
      return new ResponseModel(RESULT_STATUS.OK, ret);
    }
  }

  async getMasterDataByClass(@Body() body: RequestModel<any>): Promise<any> {
    try {
      // print request data
      this.logger.log(LOG_TEMPLATE.REQUEST_MODEL);
      this.logger.log(JSON.stringify(body));

      this.initialize(body);
      this.check.clearError();
      this.check.addError(
        await this.check.checkRequired(this.company, KEYS.COMPANY)
      );
      this.check.addError(await this.check.checkRequired(this.lang, KEYS.LANG));
      this.check.addError(
        await this.check.checkRequired(body.condition[KEYS.CLASS], KEYS.CLASS)
      );
      if (this.check.hasError()) {
        return new ResponseModel(RESULT_STATUS.ERROR, this.check.errors);
      }

      // call common function
      let result = await this.getCodeNameMasterData(
        this.company,
        body.condition
      );
      if (isEqual(result.numData, 0)) {
        result = await this.getCodeNameMasterData(
          SYSTEM_COMPANY,
          body.condition
        );
      }

      // print response data
      this.logger.log(LOG_TEMPLATE.RESPONSE_MODEL);
      this.logger.log(JSON.stringify(result));
      return result;
    } catch (error) {
      // print error
      this.logger.error(LOG_TEMPLATE.EXCEPTION, error);
      return new ResponseModel(RESULT_STATUS.ERROR, error);
    }
  }
}
