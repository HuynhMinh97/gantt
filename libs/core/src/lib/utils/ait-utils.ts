/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNil, KEYS, KeyValueDto, STRING_EMPTY } from '@ait/shared';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Guid } from 'guid-typescript';
import { extname } from 'path';

export class AitUtils {
  static join(...params: any): string {
    if (!isNil(params)) {
      return params.join(STRING_EMPTY);
    }
    return STRING_EMPTY;
  }

  /**
   *
   *
   * @param {*} doc
   * @param {string} lang
   * @returns {KeyValueDto}
   * @memberof Utils
   */
  static getKeyValue(doc: any, lang: string): KeyValueDto {
    const kv = {} as KeyValueDto;
    if (isNil(doc)) return kv;
    // set key
    kv._key = doc[KEYS.KEY];
    // set value with current lang
    kv.value = doc[KEYS.NAME] ? doc[KEYS.NAME][lang] : STRING_EMPTY;
    return kv;
  }

  static editFileName = (req, file, callback) => {
    const name = file.originalname.split('{_}')[2];
    const fileExtName = extname(name);
    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 10).toString(10))
      .join('');
    callback(null, `${name}${randomName}${fileExtName}`);
  };
  // Allow only images
  static imageFileFilter = (req, file, callback) => {
    const name = file.originalname.split('{_}')[2];
    if (!name.match(/\.(jpg|jpeg|png|gif|doc|docx|xls|xlsx|json|csv|pdf)$/)) {
      return callback(
        new HttpException(
          "Your file's format is not supported",
          HttpStatus.BAD_REQUEST
        ),
        false
      );
    }
    callback(null, true);
  };

    /**
   * Generate GUID
   *
   * @readonly
   * @type {string}
   * @memberof BaseService
   */
    static get guid(): string {
      return Guid.create().toString();
    }

    static getUnixTime() {
      return new Date().setHours(0, 0, 0, 0);
    }
}
