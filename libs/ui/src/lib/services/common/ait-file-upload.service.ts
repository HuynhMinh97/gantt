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


  uploadFiles = async (formData: FormData): Promise<any> => {
    return new Promise((resolve, reject) => {
      fetch(this.url, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: 'Bearer ' + this.token
        },
      }).then(res => res.json()).then(result => {
        resolve(result)
      }).catch(e => reject(e));
    })
  }

  removeFiles = async (_keys: string[]): Promise<any> => {
    return this.http.post(this.removeUrl, { condition: { _keys } }).toPromise();
  }

  async importData(data: any[]) {
    return await this.post(this.importURL, { data }).toPromise();
  }

}