// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { APP_SECRET_KEY } from '@ait/shared';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})

export class AitEncrDecrService {
  //The set method is use for encrypt the value.
  set( value){
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

  //The get method is use for decrypt the value.
  get(value){
    const key = CryptoJS.enc.Utf8.parse(APP_SECRET_KEY);
    const iv = CryptoJS.enc.Utf8.parse(APP_SECRET_KEY);
    const decrypted = CryptoJS.AES.decrypt(value, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
