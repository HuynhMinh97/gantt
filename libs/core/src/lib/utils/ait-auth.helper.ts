import { APP_SECRET_KEY } from '@ait/shared';
import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';

export class AuthHelper {
  static async validate(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    const decodePwd: string = this.getEncrypt(hashedPassword);
    return await this.comparePwds(decodePwd, password);
  }

  static comparePwds = async (
    passwordInPlaintext: string,
    hashedPassword: string
  ): Promise<any> => {
    return await bcrypt.compare(passwordInPlaintext, hashedPassword);
  };

  static async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 8);
  }

  static setEncrypt( value){
    const key = CryptoJS.enc.Utf8.parse(APP_SECRET_KEY);
    const iv = CryptoJS.enc.Utf8.parse(APP_SECRET_KEY);
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
    {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
  }

  static getEncrypt(password: string) {
    const key = CryptoJS.enc.Utf8.parse(APP_SECRET_KEY);
    const iv = CryptoJS.enc.Utf8.parse(APP_SECRET_KEY);
    const decrypted = CryptoJS.AES.decrypt(password, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
