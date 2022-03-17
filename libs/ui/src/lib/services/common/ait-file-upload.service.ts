import * as _ from 'lodash';

import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Subject, Subscription } from 'rxjs';
import { AitBaseService } from './ait-base.service';

export enum FileQueueStatus {
  Pending,
  Success,
  Error,
  Progress
}

export class FileQueueObject {
  public file: any;
  public status: FileQueueStatus = FileQueueStatus.Pending;
  public progress = 0;
  public request: Subscription = null;
  public response: HttpResponse<any> | HttpErrorResponse = null;

  constructor(file: any) {
    this.file = file;
  }

  // actions
  public upload = () => { /* set in service */ };
  public cancel = () => { /* set in service */ };
  public remove = () => { /* set in service */ };

  // statuses
  public isPending = () => this.status === FileQueueStatus.Pending;
  public isSuccess = () => this.status === FileQueueStatus.Success;
  public isError = () => this.status === FileQueueStatus.Error;
  public inProgress = () => this.status === FileQueueStatus.Progress;
  public isUploadable = () => this.status === FileQueueStatus.Pending || this.status === FileQueueStatus.Error;

}

// tslint:disable-next-line:max-classes-per-file
@Injectable(
  {
    providedIn: 'root'
  }
)
export class AitFileUploaderService extends AitBaseService {

  public afterMethodFileSelect: Subject<any> = new Subject();


  // public url: string = this.baseURL + '/upload-file/upload';
  public url: string = this.baseURL + '/upload-file/upload-files';
  public removeUrl: string = this.baseURL + '/upload-file/remove-files';
  private importURL: string = this.env?.API_PATH?.SYS?.UPLOAD + '/import-data';

  uploadFile = async (data: any[]) => {
    return await this.mutation('saveBinaryData', 'sys_binary_data', data, {
      _key: true
    });
  }


  removeFile = async (_keys: any[]) => {
    console.log(_keys)

    return await this.mutation('removeBinaryData', 'sys_binary_data', _keys, {
      _key: true,
      name: true,
      data_base64: true,
      size: true,
      file_type: true
    });
  }

  // getSystemSetting = async (company : string) => {
  //   return await this.mutation('findSystem','user_setting',)
  // }

  async getFilesByFileKeys(file_key: string | string[]) {

    if ((file_key || []).length !== 0) {
      try {
        const req = {
          collection: 'sys_binary_data',
          condition: {
            _key: {
              value: file_key
            }
          }
        }
        const result = await this.query('findBinaryData', req, {
          _key: true,
          data_base64: true,
          file_type: true,
          size: true,
          name: true,
          create_at: true
        });
        return result;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

}
