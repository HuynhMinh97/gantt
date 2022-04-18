import { AitBaseController, AitBaseService } from '@ait/core';
import { RequestCoreModel } from '@ait/shared';
import { HttpService } from '@nestjs/common';
import { environment } from '../../environments/environment';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { LOG_TEMPLATE } from '../commons/consts';
import { CommonUtils } from '../utils/utils';

export class BaseController extends AitBaseController {
  protected company: string;
  protected lang: string;
  protected module: string;
  protected page: string;
  protected user_id: string;
  protected username: string;
  protected apiUrl: string;

  constructor(baseService: AitBaseService, public httpService: HttpService) {
    super(baseService);
    this.apiUrl = CommonUtils.join(
      environment.API_CORE.HOST + environment.API_CORE.MATCHING_ENGINE_PATH
    );
  }

  /**
   *
   *
   * @param {RequestCoreModel} req
   * @returns {Promise<any>}
   * @memberof BaseController
   */
  async get(req: RequestCoreModel): Promise<any> {
    this.logger.log(LOG_TEMPLATE.CORE_URL);
    this.logger.log(CommonUtils.join(this.apiUrl, environment.API_CORE.GET));
    return await this.httpService
      .post<any>(CommonUtils.join(this.apiUrl, environment.API_CORE.GET), req)
      .toPromise();
  }

  /**
   *
   *
   * @param {RequestCoreModel} req
   * @returns {Promise<any>}
   * @memberof BaseController
   */
  async search(req: RequestCoreModel): Promise<any> {
    this.logger.log(LOG_TEMPLATE.CORE_URL);
    this.logger.log(CommonUtils.join(this.apiUrl, environment.API_CORE.SEARCH));
    return await this.httpService
      .post<any>(
        CommonUtils.join(this.apiUrl, environment.API_CORE.SEARCH),
        req
      )
      .toPromise();
  }
}
