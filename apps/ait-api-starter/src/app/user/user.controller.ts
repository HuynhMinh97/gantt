import { AitBaseService } from '@ait/core';
import { RequestModel, ResponseModel, RESULT_STATUS, RequestCoreModel, KEYS, BaseDto, isArrayFull, KeyValueDto, isEqual, SYSTEM_COMPANY } from '@ait/shared';
import { Body, Controller, HttpService, Post } from '@nestjs/common';
import { LOG_TEMPLATE } from '../commons/consts';
import { CLASS, COLLECTIONS, OPERATOR } from '../commons/enums';
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
          operator: OPERATOR.IN
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
          operator: OPERATOR.IN
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
          operator: OPERATOR.IN
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
      code: KEYS.ASC
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

  @Post('get-setting')
  async getUserSetting(
    @Body() body: RequestModel<BaseDto>
  ): Promise<ResponseModel> {
    try {
      // print request data
      this.logger.log(LOG_TEMPLATE.REQUEST_MODEL);
      this.logger.log(JSON.stringify(body));

      // init common data
      this.initialize(body);

      // check validate
      this.check.clearError();

      this.check.addError(
        await this.check.checkRequired(body.condition?.user_id, KEYS.USER_ID)
      );

      if (this.check.hasError()) {
        return new ResponseModel(RESULT_STATUS.ERROR, this.check.errors);
      }

      // request condition
      const reqConditon = body.condition ? body.condition : {};

      // get master data
      const reqMaster = new RequestModel<any>();
      // reqMaster[KEYS.COMPANY] = this.company;
      reqMaster[KEYS.LANG] = this.lang;
      reqMaster.condition = {
        class: [
          CLASS.LANGUAGE,
          CLASS.SYSTEM_SETTING,
          CLASS.USER_SETTING,
          CLASS.TIMEZONE,
        ],
      };
      const resMaster = await this.getMasterDataByClass(
        reqMaster
      );

      const masterData = resMaster.data;

      // initialize request core
      const req = new RequestCoreModel(COLLECTIONS.USER_SETTING);
      req.condition = reqConditon;

      // get data with _key array
      if (reqConditon[KEYS.USER_ID]) {
        req.condition[KEYS.USER_ID] = reqConditon[KEYS.USER_ID];
      }

      // selected field
      const select_field = [];
      select_field.push('user_id');
      select_field.push('timezone');
      select_field.push('site_language');
      select_field.push('date_format_display');
      select_field.push('date_format_input');
      select_field.push('number_format');
      req.select_field = select_field;

      // call core api
      this.logger.log(LOG_TEMPLATE.REQUEST_CORE_MODEL);
      this.logger.log(JSON.stringify(req));
      const res = await this.get(req);
      // check core response
      if (res.status === RESULT_STATUS.OK) {
        this.logger.log(LOG_TEMPLATE.RESPONSE_CORE_MODEL);
        this.logger.log(JSON.stringify(res.data));

        const ret = [];
        if (isArrayFull(res.data.data)) {
          res.data.data.forEach((data) => {
            data.timezone = masterData.find(
              (item) =>
                data.timezone === item.code && item.class === CLASS.TIMEZONE
            );
            data.site_language = masterData.find(
              (item) =>
                data.site_language === item.code &&
                item.class === CLASS.LANGUAGE
            );
            data.date_format_display = masterData.find(
              (item) =>
                data.date_format_display === item.code &&
                item.class === CLASS.USER_SETTING
            );
            data.date_format_input = masterData.find(
              (item) =>
                data.date_format_input === item.code &&
                item.class === CLASS.USER_SETTING
            );
            data.number_format = masterData.find(
              (item) =>
                data.number_format === item.code &&
                item.class === CLASS.USER_SETTING
            );
            ret.push(data);
          });
        }
        else {
          req.condition[KEYS.USER_ID] = Array(36).fill(0).join('');
          const ress = await this.get(req);
          if (isArrayFull(ress.data.data)) {
            ress.data.data.forEach((data) => {
              data.timezone = masterData.find(
                (item) =>
                  data.timezone === item.code && item.class === CLASS.TIMEZONE
              );
              data.site_language = masterData.find(
                (item) =>
                  data.site_language === item.code &&
                  item.class === CLASS.LANGUAGE
              );
              data.date_format_display = masterData.find(
                (item) =>
                  data.date_format_display === item.code &&
                  item.class === CLASS.USER_SETTING
              );
              data.date_format_input = masterData.find(
                (item) =>
                  data.date_format_input === item.code &&
                  item.class === CLASS.USER_SETTING
              );
              data.number_format = masterData.find(
                (item) =>
                  data.number_format === item.code &&
                  item.class === CLASS.USER_SETTING
              );
              ret.push(data);
            });
          }
        }

        const results = ret.map(m => ({
          ...m,
          date_format_display: {
            value: m?.date_format_display?.value,
            code: m?.date_format_display?.code
          },
          date_format_input: {
            value: m?.date_format_input?.value,
            code: m?.date_format_input?.code
          },
          number_format: {
            value: m?.number_format?.value,
            code: m?.number_format?.code
          },
          site_language: m?.site_language?.code,
          timezone: m?.timezone?.code,

        }))

        // return response
        const result = new ResponseModel(RESULT_STATUS.OK, results);
        this.logger.log(LOG_TEMPLATE.RESPONSE_MODEL);
        this.logger.log(JSON.stringify(result));
        return result;
      }
    } catch (error) {
      this.logger.error(LOG_TEMPLATE.EXCEPTION, error);
      return new ResponseModel(RESULT_STATUS.EXCEPTION, error);
    }
  }



}
