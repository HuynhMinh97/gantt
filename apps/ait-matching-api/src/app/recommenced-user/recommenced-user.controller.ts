import { AitBaseService } from '@ait/core';
import {
  DB_CONNECTION_TOKEN,
  RequestModel,
  ResponseModel,
  RESULT_STATUS,
} from '@ait/shared';
import {
  Body,
  Controller,
  Get,
  HttpService,
  Inject,
  Post,
} from '@nestjs/common';
import { Database } from 'arangojs';
import { environment } from '../../environments/environment';
import { BaseController } from '../base/base.controller';
import { MATCHING_FUNCTION_KEY } from '../commons/consts';
import { CommonUtils } from '../utils/utils';

@Controller('recommenced-user')
export class RecommencedUserController extends BaseController {
  constructor(
    aitBaseService: AitBaseService,
    httpSerivce: HttpService,
    @Inject(DB_CONNECTION_TOKEN) private readonly db: Database
  ) {
    super(aitBaseService, httpSerivce);
  }

  @Post('matching')
  async searchCompany(@Body() body: RequestModel<any>): Promise<any> {
    try {
      // print request data
      this.logger.debug('@Post(matching)');
      this.logger.debug(JSON.stringify(body));

      // clear error messages
      this.check.clearError();

      // initialize common paramter from body data
      this.initialize(body);

      const req = {
        keyword: body.condition?.keyword,
        matching_function_key: MATCHING_FUNCTION_KEY,
        separated_input_data: [],
        required_matching_items: [],
      };
      let ret = [];

      const result = await this.matching(req);
      if (result?.status === RESULT_STATUS.OK) {
        const data = result?.data?.data;
        if (data) {
          ret = data.map((d) => ({
            _key: d?._key,
            value: d?.name ? d?.name[body.lang] : null,
          }));
        }
      }
      return new ResponseModel(RESULT_STATUS.OK, ret);
    } catch (error) {
      return new ResponseModel(RESULT_STATUS.ERROR, error);
    }
  }

  async matching(req: any): Promise<any> {
    return await this.httpService
      .post<any>(
        CommonUtils.join(this.apiUrl, environment.API_CORE.MATCHING),
        req
      )
      .toPromise();
  }
}
