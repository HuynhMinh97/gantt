/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-inferrable-types */
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { objKeys, RESULT_STATUS } from '@ait/shared';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { select, Store } from '@ngrx/store';
import { FILE_TYPE_SUPPORT_DEFAULT, MAX_FILE_DEFAULT } from '../../@constant';
import { AitBinaryDataService } from '../../services/ait-binary-data.service';
import { AitDayJSService } from '../../services/ait-dayjs.service';
import { AitFileUploaderService } from '../../services/common/ait-file-upload.service';
import { AitMasterDataService, CLASS, DATA_TYPE } from '../../services/common/ait-master-data.service';
import { AitTranslationService } from '../../services/common/ait-translate.service';
import { AppState } from '../../state/selectors';
import { getEmpId, getLang_Company } from '../../state/selectors';
import { AitAppUtils } from '../../utils/ait-utils';


@Component({
  selector: 'ait-input-file',
  styleUrls: ['./ait-input-file.component.scss'],
  templateUrl: './ait-input-file.component.html'
})
export class AitInputFileComponent implements OnInit, OnChanges {

  user_id = '';
  company = '';
  settings = [];
  isLoading = false;
  messageErrorFileSp = '';
  isSupported = false; // for test
  @Input() mode: 'dark' | 'light' = 'light';
  @Input()
  fileKeys = []
  displayedFiles = []; // _keys of files
  currentBase64 = '';



  fileRequest: any = {};

  styleHover = {

  }

  @ViewChild('image', { static: false }) image;
  constructor(
    private fileUploadService: AitFileUploaderService,
    store: Store<AppState>,
    private masterDataService: AitMasterDataService,
    private translateService: AitTranslationService,
    private santilizer: DomSanitizer,
    private binaryService: AitBinaryDataService,
    private dayJSService: AitDayJSService,
  ) {
    store.pipe(select(getEmpId)).subscribe(userId => this.user_id = userId);
    store.pipe(select(getLang_Company)).subscribe(ob => this.company = ob.company);
    // console.log(this.image);
  }
  files: any[] = [];
  Files: File[] = [];
  fileDatas = [];
  @Input() withInput: number = 300;
  @Input() hasImage: boolean = true;
  @Output() watchValue = new EventEmitter();
  @Input() placeholder = '';
  @Input() isDefault = true;
  @Input() title = '';
  @Input() guidance = '';
  @Input() guidanceIcon = '';
  @Input() margin_top = 0;
  @Input() fileTypes = '';
  @Input() maxFiles: number;
  @Input() maxSizeBytes: number; // bytes
  @Input() isReset: boolean;
  isImgErr = false;
  @Input() isError = false;
  @Input() required = false;
  errors = []
  @Input() classContainer;

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        const element = changes[key].currentValue;
        console.log(element,key)
        if (key === 'isReset') {
          if (this.isReset) {
            this.fileDatas = [];
            this.fileKeys = [];
            this.isReset = false;
          }
        }

      }
    }
  }

  getNote = () => this.translateService.translate(this.guidance);
  getTitle = () => this.translateService.translate(this.title);
  getPlaceHolder = () => this.translateService.translate(this.placeholder || 'ドラッグ&ドロップでファイル添付または');
  getReference = () => this.translateService.translate('参照');
  getMaxFileText = () => this.translateService.translate('ファイルまで添付できます。');
  getFileTypeText = () => this.translateService.translate('形式のファイルのみ添付できます。');

  check = () => {
    return this.getNote() || (this.getFileMaxUpload() || this.maxFiles) || (this.getFileTypeSup() || this.fileTypes)
  }

  sumSizeFiles = (files: any[]) => {
    return (this.fileRequest[0]?.size || 0) / (1024);
  }

  getSrc = (file) => {
    if (!file.isError) {
      return this.safelyURL(file.data_base64, file.file_type) ||
        '../../../../assets/images/file.svg'
    }
    return '../../../../assets/images/not-f.jpg'
  }

  handleErrorImage = (file) => {
    this.isImgErr = true;
    file.isError = true;
  }

  getTime = (time: number) => {
    if (time) {
      return this.dayJSService.calculateDateTime(time);
    }
    return null;
  }

  getFileCount = () => {
    return [...this.fileDatas, ...this.displayedFiles].length;
  }

  safelyURL = (data, type) => this.santilizer.bypassSecurityTrustUrl(`data:${type};base64, ${data}`);

  checkMaxSize = (file: any[]) => {
    return this.fileRequest[0]?.size <= this.maxSizeBytes * 1024;
  }
  checkMaxFile = () => {

    return this.fileDatas.length + this.displayedFiles.length < this.getFileMaxUpload();
  }

  getTextDelete = () => this.translateService.translate('c_2002');

  getKB = (bytes: number) => {
    return bytes ? bytes / 1024 : null;
  }

  ngOnInit() {
    const settingFiles = ['FILE_TYPE_SUPPORT', 'FILE_MAX_UPLOAD', 'FILE_MAX_SIZE_MB'];
    this.masterDataService.find({
      parent_code: CLASS.SYSTEM_SETTING,
    }, {
      _key: true,
      code: true,
      parent_code: true,
      class: true,
      name: true
    }).then(r => {
      const settings = r.data.filter(d => settingFiles.includes(d?.code));
      this.settings = settings.map((s: any) => ({ ...s, value: s?.name }));

      if (settings.length !== 0) {
        if (!this.maxSizeBytes) {
          this.maxSizeBytes = Number(this.settings.find(f => f.code === 'FILE_MAX_SIZE_MB')?.value);
        }
        if (!this.maxFiles) {
          this.maxFiles = Number(this.getValueByCode('FILE_MAX_UPLOAD')?.value);
        }
        if (!this.fileTypes) {
          this.fileTypes = this.getValueByCode('FILE_TYPE_SUPPORT')?.value;
        }

      }


    })
    console.log(this.fileKeys)


    if (this.fileKeys && this.fileKeys.length !== 0) {
      this.fileUploadService.getFilesByFileKeys(this.fileKeys || []).then((r: any) => {
        if (r?.status === RESULT_STATUS.OK) {
          console.log(r.data)
          this.displayedFiles = r.data;
        }
      })
    }
  }

  getFileMaxUpload = () => {
    const maxfile = this.settings.find(f => f.code === 'FILE_MAX_UPLOAD');
    return this.maxFiles ? this.maxFiles : maxfile ? maxfile?.value : MAX_FILE_DEFAULT;
  }

  getFileTypeSup = () => {
    const supfile = this.settings.find(f => f.code === 'FILE_TYPE_SUPPORT');
    return this.fileTypes ? this.fileTypes : supfile ? supfile?.value : FILE_TYPE_SUPPORT_DEFAULT;
  }

  getMaxSizeFile = () => {
    return this.maxSizeBytes ? this.maxSizeBytes * 1024 : 5000000;
  }

  getValueByCode = (code) => {
    return this.settings.find(f => f.code === code)?.value;
  }


  checkFileExt = (file) => {
    const check = AitAppUtils.checkFileExt(this.fileTypes || FILE_TYPE_SUPPORT_DEFAULT, file);
    if (check.status !== 1) {
      this.messageErrorFileSp = this.translateService.getMsg('E0012')
        .replace('{0}', this.fileTypes || this.getValueByCode('FILE_TYPE_SUPPORT') || FILE_TYPE_SUPPORT_DEFAULT);
      return false;
    }
    return check?.status === 1;
  }



  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.styleHover = {
      background: 'rgba(0,0,0,0.15)'
    }
  }

  onFileDragLeave() {
    this.styleHover = {
    }
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    if (files && files[0]) {

      const FR = new FileReader();
      FR.onload = (e: any) => {
        const index = e.target.result.indexOf(',');
        this.currentBase64 = e.target.result.slice(index + 1);
        this.prepareFilesList(files);
      }


      FR.readAsDataURL(files[0]);
    }

  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(file: any, index: number) {
    this.fileUploadService.removeFile(file?._key).then(r => {
      if (r.status === RESULT_STATUS.OK) {

        this.files.splice(index, 1);
        this.fileDatas = this.fileDatas.filter(f => f._key !== file?._key);
        this.displayedFiles = this.displayedFiles.filter(f => f._key !== file?._key);
        this.watchValue.emit({ value: this.fileDatas });
        this.checkReq();
      }
    })
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(_key: string) {
    const file = this.fileDatas.find(f => f._key === _key);
    setTimeout(() => {
      const progressInterval = setInterval(() => {
        if (file.progress === 100) {
          clearInterval(progressInterval);
        } else {
          file.progress += 5;
        }
      }, 10);
    }, 500);
  }


  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    this.messageErrorFileSp = '';
    const fileReq = [];

    for (const item of files) {
      fileReq.push({
        type: item.type,
        name: item.name,
        size: item.size
      })
    }
    this.fileRequest = fileReq;
    // this.fileDatas = [...this.fileDatas, files[files.length - 1]];
    this.files = this.files = [files[files.length - 1]];
    // // console.log(this.fileDatas);


    this.files = this.files = [files[files.length - 1]];

    if (!this.checkMaxFile()) {
      this.messageErrorFileSp =
        this.translateService.getMsg('E0155').replace('{0}', this.getFileMaxUpload().toString())
    }
    else if (!this.checkMaxSize(fileReq)) {
      this.messageErrorFileSp =
        this.translateService.getMsg('E0157').replace('{0}', this.formatBytes(this.getMaxSizeFile(), 2).toString())
    }
    else {
      this.files = [files[files.length - 1]];

      if (this.checkFileExt(fileReq[0])) {
        this.submitMultipleForm().then(
          res => {
            console.log(res)
            if (res.status !== 0) {

              this.fileDatas = [...this.fileDatas, { ...res.data[0], progress: 0 }];

              this.watchValue.emit({ value: this.fileDatas });
              this.fileDatas.forEach((file, index) => {
                this.uploadFilesSimulator(file._key);
              })

              this.checkReq();


            }
            else {

            }

          }
        )
      }

    }
  }

  checkReq = () => {
    this.errors = [];
    if (this.required) {
      if (this.fileDatas.length === 0 && this.displayedFiles.length === 0) {
        const err = this.translateService.getMsg('E0001').replace('{0}', this.getTitle());
        this.isError = true;
        this.errors = [err];
      }
    }
    else {
      this.isError = false;
    }
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals?) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }


  // eslint-disable-next-line no-prototype-builtins
  hasProperty = (prop: string, obj: any) => (obj || {}).hasOwnProperty(prop || '');


  async submitMultipleForm() {
    const { type, ...objKeys } = this.fileRequest[0];
    const data = [
      {
        ...objKeys,
        file_type: type,
        company: this.company,
        user_id: AitAppUtils.getUserId(),
        data_base64: this.currentBase64,
      }
    ]

    try {
      const response = await this.fileUploadService.uploadFile(data);
      if (!response) {
        throw new Error(response.statusText);
      }
      // originalname
      if (response.status === 200) {
        return {
          status: 1,
          data: response.data
        }
      }
      return {
        status: 0
      }
    } catch (err) {
      return {
        status: 0
      }
    }
  }
}
