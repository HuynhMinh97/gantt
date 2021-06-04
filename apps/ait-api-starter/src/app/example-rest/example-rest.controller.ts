/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, Controller, Post } from '@nestjs/common';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AitBaseController, AitBaseService } from '@ait/core';
import { RequestCoreModel, RequestModel, ResponseModel, RESULT_STATUS } from '@ait/shared';
import { ExampleRestDto } from './example-rest.dto';
import { COLLECTIONS } from '../commons/enums';

@Controller('example')
export class ExampleRestController extends AitBaseController {
    constructor(baseService: AitBaseService) {
        super(baseService);
      }

    /**
   * Get system-skill data by conditions
   * @param {RequestModel<ExampleRestDto>}body
   * @returns {Promise<any>}
   *  @memberof MasterDataController
   */
  @Post('get')
  async getMasterData(@Body() body: RequestModel<ExampleRestDto>): Promise<any> {
    try {
      // print request data
      this.logger.log(JSON.stringify(body));

      // clear error messages
      this.check.clearError();

      // initialize common paramter from body data
      this.initialize(body);

      // return to client if have error
      if (this.check.hasError()) {
        return new ResponseModel(RESULT_STATUS.ERROR, this.check.errors);
      }

      //call request core get method
      const result = await this.getData(body.condition);
      // print response data
      this.logger.log(JSON.stringify(result));
      return result;
    } catch (error) {
      // print error
      return new ResponseModel(RESULT_STATUS.ERROR, error);
    }
  }

  private async getData(reqConditon: any): Promise<any> {
    try {
      if (!reqConditon) {
        reqConditon = {};
      }
      // initialize request core
      const req = new RequestCoreModel(COLLECTIONS.EXAMPLE);
      req.condition = reqConditon;

      const res = await this.find(req);

      if (res.length > 0) {
        return new ResponseModel(RESULT_STATUS.OK, res);
      } else {
        return new ResponseModel(RESULT_STATUS.ERROR, RESULT_STATUS.ERROR);
      }
    } catch (error) {
      this.logger.debug(error);
      return new ResponseModel(RESULT_STATUS.ERROR, error);
    }
  }
}
