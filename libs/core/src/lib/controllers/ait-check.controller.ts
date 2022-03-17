import {
  isArrayFull,
  isEqual,
  isNil,
  isNumber,
  isNumeric,
  isValue,
  MessageModel,
  SYSTEM_COMPANY,
  Utils
} from '@ait/shared';
import { Guid } from 'guid-typescript';
import { AitLogger } from './../utils/ait-logger.util';

/**
 *
 *
 * @export
 * @class BaseController
 */
export class AitCheckController {
  protected readonly logger = new AitLogger(this.constructor.name);
  protected apiUrl: string;
  errors: MessageModel[] = [];
  company: string;
  lang: string;

  /**
   *
   *
   * @param {MessageModel} message
   * @memberof BaseController
   */
  public addError(message: MessageModel): void {
    if (!isNil(message)) {
      this.errors.push(message);
    }
  }

  /**
   *
   *
   * @memberof BaseController
   */
  public clearError(): void {
    this.errors = [];
  }

  /**
   *
   *
   * @returns {boolean}
   * @memberof BaseController
   */
  public hasError(): boolean {
    return this.errors.length > 0;
  }

  /**
   *
   *
   * @static
   * @param {string} company
   * @returns {boolean}
   * @memberof CheckCommon
   */
  public isCommonCompany(company: string): boolean {
    if (isValue(company) && isEqual(company, SYSTEM_COMPANY)) {
      return true;
    }
    return false;
  }

  /**
   * Generate GUID
   *
   * @readonly
   * @type {string}
   * @memberof BaseService
   */
  get guid(): string {
    return Guid.create().toString();
  }

  /**
   *
   *
   * @param {*} value
   * @param {*} params
   *  0: item name
   * @returns
   * @memberof BaseController
   */
  public async checkRequired(value, ...params): Promise<any> {
    if (!(isValue(value) || isArrayFull(value))) {
      const msg = await this.getMessage('E0001', ...params);
      if (!isNil(msg)) {
        this.errors.push(msg);
      }
    }
    return undefined;
  }

  /**
   *
   *
   * @param {*} value
   * @param {*} params
   *  0: item name
   *  1: target check
   * @returns
   * @memberof BaseController
   */
  public async checkMaxLength(value, ...params): Promise<any> {
    if (
      isValue(value) &&
      isArrayFull(params) &&
      isValue(params[0]) &&
      isValue(params[1])
    ) {
      if (!(Utils.len(value) <= params[1])) {
        const msg = await this.getMessage('E0002', ...params);
        if (!isNil(msg)) {
          this.errors.push(msg);
        }
      }
    }
    return undefined;
  }

  /**
   *
   *
   * @param {*} value
   * @param {*} params
   *  0: item name
   *  1: target check
   * @returns
   * @memberof BaseController
   */
  public async checkLessThan(value, ...params): Promise<any> {
    if (
      isNumeric(value) &&
      isArrayFull(params) &&
      isValue(params[0]) &&
      isNumber(params[1])
    ) {
      if (!(value < params[1])) {
        const msg = await this.getMessage('E0003', ...params);
        if (!isNil(msg)) {
          this.errors.push(msg);
        }
      }
    }
    return undefined;
  }

  /**
   *
   *
   * @param {*} value
   * @param {*} params
   *  0: item name
   *  1: target check
   * @returns
   * @memberof BaseController
   */
  public async checkLessThanOrEqualTo(value, ...params): Promise<any> {
    if (
      isNumeric(value) &&
      isArrayFull(params) &&
      isValue(params[0]) &&
      isNumber(params[1])
    ) {
      if (!(value <= params[1])) {
        const msg = await this.getMessage('E0004', ...params);
        if (!isNil(msg)) {
          this.errors.push(msg);
        }
      }
    }
    return undefined;
  }

  /**
   *
   *
   * @param {*} value
   * @param {*} params
   *  0: item name
   *  1: target check
   * @returns
   * @memberof BaseController
   */
  public async checkGreaterThan(value, ...params): Promise<any> {
    if (
      isNumeric(value) &&
      isArrayFull(params) &&
      isValue(params[0]) &&
      isNumber(params[1])
    ) {
      if (!(value > params[1])) {
        const msg = await this.getMessage('E0005', ...params);
        if (!isNil(msg)) {
          this.errors.push(msg);
        }
      }
    }
    return undefined;
  }

  /**
   *
   *
   * @param {*} value
   * @param {*} params
   *  0: item name
   *  1: target check
   * @returns
   * @memberof BaseController
   */
  public async checkGreaterThanOrEqualTo(value, ...params): Promise<any> {
    if (
      isNumeric(value) &&
      isArrayFull(params) &&
      isValue(params[0]) &&
      isNumber(params[1])
    ) {
      if (!(value >= params[1])) {
        const msg = await this.getMessage('E0006', ...params);
        if (!isNil(msg)) {
          this.errors.push(msg);
        }
      }
    }
    return undefined;
  }

  /**
   *
   *
   * @param {*} value
   * @param {*} params
   *  0: item name
   *  1: min target check
   *  2: max target check
   * @returns
   * @memberof BaseController
   */
  public async checkBetween(value, ...params): Promise<any> {
    if (
      isNumeric(value) &&
      isArrayFull(params) &&
      isValue(params[0]) &&
      isNumber(params[1]) &&
      isNumber(params[2])
    ) {
      if (!(value >= params[1] && value <= params[2])) {
        const msg = await this.getMessage('E0007', ...params);
        if (!isNil(msg)) {
          this.errors.push(msg);
        }
      }
    }
    return undefined;
  }

  /***********************************************
   *  PRIVATE METHOD
   ***********************************************/

  /**
   *
   *
   * @param {*} code
   * @param {*} params
   * @returns {Promise<MessageModel>}
   * @memberof BaseController
   */
  public async getMessage(code, ...params): Promise<MessageModel> {
    // let message = await this.getMessageInDB({
    //   company: this.company,
    //   code: code
    // });
    // if (!isStringFull(message)) {
    //   message = await this.getMessageInDB({
    //     company: SYSTEM_COMPANY,
    //     code: code
    //   });
    // }
    // if (isStringFull(message)) {
    //   const msg = new MessageModel(code, params);
    //   msg.message = message;
    //   msg.messageFull = Utils.format(message, params);
    //   return msg;
    // }
    return undefined;
  }
}
