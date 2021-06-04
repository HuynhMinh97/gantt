// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { isArrayFull, isEqual, Utils } from '@ait/shared';
import jwt_decode from 'jwt-decode';
import _ from 'lodash';
export class AitAppUtils extends Utils {

  static checkFileExt = (fileSupport: string, file) => {
    const filesExtSp = fileSupport.split(',').join('|');
    // eslint-disable-next-line no-useless-escape
    const regExp = new RegExp(`\.(${filesExtSp})$`);
    const name = file.name;
    if (!regExp.test(name)) {
      return {
        status: 0,
        message: 'E0158'
      }
    }
    return {
      status: 1
    }

  };

  static checkDifFrom2Arrays = (target: any[], source: any[], field: string) => {
    if (!target || !source) {
      return false;
    }
    const map = source.map(a => a[field]);
    const dif = target.filter(a => !map.includes(a[field]));
    return dif.length !== 0
  }

  static isObjectValueEmpty = (obj) => {
    if (typeof obj !== 'object') {
      return false;
    } else {
      return Object.values(obj).every(o => o === (null || ''));
    }
  }

  static checkTokens = () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken === undefined) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.clear()
    }
  }
  static getUniqueArray = (array: any[], field: string) => {
    let currentArr = [];
    const result = [];
    if (array) {
      array.forEach(arr => {
        if (arr && !currentArr.includes(arr[field])) {
          currentArr = [...currentArr, arr[field]];
          result.push(arr);
        }
      });
    }
    return result;
  }

  static isObjectEmpty = (objx) => {
    const obj = {};
    Object.entries(objx || {}).forEach(([key, value]) => {
      if (value) {
        obj[key] = value;
      }
    })
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  static objectsEqual = (o1, o2) =>
    Object.keys(o1).length === Object.keys(o2).length
    && Object.keys(o1).every(p => o1[p] === o2[p]);
  static sortArrays = (arr: any[]) => {
    return arr.sort((a, b) => a.sort_no - b.sort_no);
  }

  static checkArrayIsEqual = (array1: any[], array2: any[]) => {
    return (
      array1.length === array2.length &&
      array1.every((value, index) => value === array2[index])
    );
  }

  static deepCloneObject = (obj: any) => {
    return JSON.parse(JSON.stringify(obj));
  }

  static isObjectEqual = (obj1: any, clone: any) => {
    const obj2 = { ...clone };
    let checked = true;
    for (const prop in obj1) {
      if (!obj1[prop] && !obj2[prop]) {
        continue;
      }
      if (typeof obj1[prop] === 'object') {
        obj1[prop] = isArrayFull(obj1[prop]) ? Utils.getKeys(obj1[prop]) : Utils.getKey(obj1[prop]);
        obj2[prop] = isArrayFull(obj2[prop]) ? Utils.getKeys(obj2[prop]) : Utils.getKey(obj2[prop]);
      }
      if (!isEqual(JSON.stringify(obj1[prop]), JSON.stringify(obj2[prop]))) {
        checked = false;
        break;
      }
    }
    return checked;
  }

  static validateEmail = (email) => {
    // eslint-disable-next-line max-len
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  static isValidDate = (d) => {
    return !isNaN(d) && d instanceof Date;
  }
  static getUserId = () => {
    try {
      const access_token = localStorage.getItem('access_token');
      const decode: any = jwt_decode(access_token);
      return decode.user_key;
    } catch (e) {
      return ''
    }
  }
  static registerScrollWindowEvent = () => {
    window.addEventListener('scroll', () => {
      document.body.style.setProperty('--scroll', window.pageYOffset / (document.body.offsetHeight - window.innerHeight) + '');
    }, false);
  }
  static isLogined = () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken === undefined) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    return accessToken && accessToken !== '';
  };


  static formatTime = (datetime) => {
    const date = new Date(datetime);
    const dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
      .toISOString()
      .split('T')[0];
    return dateString['replaceAll']('-', '/');
  }
  static random = (min, max) => Math.floor(Math.random() * max) + min;
  static difference(object, base) {
    function changes(object, base) {
      return _.transform(object, function (result, value, key) {
        if (!_.isEqual(value, base[key])) {
          result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
        }
      });
    }
    return changes(object, base);
  }
  // Modified Data
  static trimDataString = (data: string) => {
    if (data) {
      const target = data.toString();
      return target.trim();
    }
    return '';
  }

  static getParamsOnUrl = (isLast?: boolean, LastIndex?: number) => {
    if (isLast) {
      const a = location.hash.split('/');
      return a[a.length - (LastIndex || 1)]
    }
    return location.hash.split('/');
  }
  static getArrayNotFalsy = (array: any[]) => array.filter(a => !!a);
  static deepCloneArray = (array: any[]) => [...array.map(a => ({ ...a }))];
  static getDif2Days(date1: string | Date | any, date2: string | Date | any) {
    if (date1 === null || date2 === null) {
      return 0;
    }
    const date1Format = new Date(date1);
    const date2Format = new Date(date2);
    const diffTime = Math.abs(Number(date2Format) - Number(date1Format));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return typeof diffDays !== 'number' || isNaN(diffDays) ? 0 : diffDays;
  }

  static randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * max) + min;
  }

  static format(value: string, ...args): string {
    try {
      return value.replace(/{(\d+)}/g, (match, num) => {
        return typeof args[num] !== 'undefined' ? args[num] : match;
      });
    } catch (e) {
      return '';
    }
  }

  static JpDateFormat(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `平成${year}年${month}月${day}日`;
  }
}
