/* eslint-disable @angular-eslint/no-output-on-prefix */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-inferrable-types */
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { objKeys, RESULT_STATUS } from '@ait/shared';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { select, Store } from '@ngrx/store';
import { FILE_TYPE_SUPPORT_DEFAULT, MAX_FILE_DEFAULT, SYSTEM_DEFAULT_COMPANY } from '../../@constant';
import { AitBinaryDataService } from '../../services/ait-binary-data.service';
import { AitDayJSService } from '../../services/ait-dayjs.service';
import { AitFileUploaderService } from '../../services/common/ait-file-upload.service';
import { AitMasterDataService, CLASS, DATA_TYPE } from '../../services/common/ait-master-data.service';
import { AitTranslationService } from '../../services/common/ait-translate.service';
import { AppState } from '../../state/selectors';
import { getEmpId, getLang_Company } from '../../state/selectors';
import { AitAppUtils } from '../../utils/ait-utils';
import { Guid } from 'guid-typescript';


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

  deletedKeys = [];
  savedData = [];
  dataDisplayDf = [];



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
  @Input() maxSize: number; // bytes
  @Input() isReset = false;
  @Input() isClear = false;
  isImgErr = false;
  @Input() isError = false;
  @Input() required = false;
  componentErrors = []
  @Input() classContainer;
  @Input() id;
  @Input() errorMessages;
  @Input() clearError = false;
  @Output() onError = new EventEmitter();
  @Input() isSubmit = false;
  @Input() hasStatus = true;
  @Input() isNew = false;
  loading = false;
  @Input() width;
  @Input() height;
  isFocus = false;
  @Input() tabIndex;

  errorImage: any = {}

  ID(element: string) {
    const idx = this.id && this.id !== '' ? this.id : Date.now();
    return idx + '_' + element;
  }


  focusInput() {
    this.isFocus = true;
  }

  getFocus() {
    return this.isError ? false : this.isFocus;
  }
  
  messagesError = () => {
    const errors = new Set([...this.componentErrors, ...(this.errorMessages || [])]);
    return Array.from(errors).filter((error: string) => error.indexOf('undefined') === -1);
  };

  getDataFiles = () => {
    return [...this.fileDatas, ...this.displayedFiles].length !== 0;
  }
  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        const element = changes[key].currentValue;
        if (key === 'isReset') {
          if (this.isReset) {
            this.fileDatas = [];
            this.displayedFiles = this.isNew ? [] : this.dataDisplayDf;
            this.componentErrors = [];
            this.errorMessages = [];
            this.messageErrorFileSp = '';
            setTimeout(() => {
              this.messageErrorFileSp = '';
              this.isReset = false;
            }, 100)
          }
        }

        if (key === 'isClear') {
          if (this.isClear) {
            this.fileDatas = [];
            this.displayedFiles = [];
            this.componentErrors = [];
            this.errorMessages = [];
            this.messageErrorFileSp = '';
            setTimeout(() => {
              this.messageErrorFileSp = '';
              this.isClear = false;
            }, 100)
          }
        }

        if (key === 'fileKeys') {
          if (this.fileKeys && this.fileKeys.length !== 0) {
            this.fileUploadService.getFilesByFileKeys(this.fileKeys || []).then((r: any) => {
              if (r?.status === RESULT_STATUS.OK) {
                this.dataDisplayDf = r.data;
                this.displayedFiles = r.data;
              }
            })
          }
        }

        if (key === 'isSubmit') {
          if (this.isSubmit) {
            if (this.savedData.length !== 0) {
              this.submitMultipleForm().then(() => {
                this.checkReq();
              })
            }
            if (this.deletedKeys.length !== 0) {
              this.deleteFile(null, null, true);
            }
            this.isSubmit = false;
          }

        }

        if (key === 'errorMessages') {
          if (this.messagesError().length !== 0) {
            this.isError = true;
            this.onError.emit({ isValid: false });
          }
          else {
            this.isError = false;
            this.onError.emit({ isValid: true });
          }
        }

        if (key === 'clearError') {
          this.messageErrorFileSp = '';
        }
      }
    }
  }

  getMessageErrorFile = () => {
    return this.messageErrorFileSp ? [this.messageErrorFileSp] : [];
  }

  getNote = () => this.translateService.translate(this.guidance);
  getTitle = () => this.translateService.translate(this.title);
  getPlaceHolder = () => this.translateService.translate(this.placeholder || '????????????&??????????????????????????????????????????');
  getReference = () => this.translateService.translate('??????');
  getMaxFileText = () => this.translateService.translate('???????????????????????????????????????');
  getFileTypeText = () => this.translateService.translate('????????????????????????????????????????????????');

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
    this.errorImage = { ...this.errorImage, [file?._key]: true }
    // file.isError = true;
  }

  getTime = (time: number) => {
    if (time) {
      return this.dayJSService.calculateDateTime(time);
    }
    return null;
  }

  getImage = (file: any, isError = false) => {
    if (!isError) {
      return this.safelyURL(file.data_base64, file.file_type)
    }
    return 'https://d30y9cdsu7xlg0.cloudfront.net/png/47682-200.png';
  }

  editFileName = (file) => {
    return `ait_${Date.now()}_${file?.name}`;
  }

  getFileCount = () => {
    return [...this.fileDatas, ...this.displayedFiles].length;
  }

  safelyURL = (data, type) => this.santilizer.bypassSecurityTrustUrl(`data:${type};base64, ${data}`);

  checkMaxSize = (file: any[]) => {
    // File nh???n v??o ?????nh d???ng theo ki???u bytes
    return this.fileRequest.length > 0 ? this.fileRequest[0]?.size <= this.convertMb2B(this.maxSize) : true;
  }
  checkMaxFile = () => {

    return this.fileDatas.length + this.displayedFiles.length < this.getFileMaxUpload();
  }

  getTextDelete = () => this.translateService.translate('c_2002');

  getKB = (bytes: number) => {
    return bytes ? bytes / 1024 : null;
  }

  getBackupSetting = async () => {
    const res = await this.masterDataService.find(
      { company: SYSTEM_DEFAULT_COMPANY, user_id: SYSTEM_DEFAULT_COMPANY },
      {
        file_max_size: true,
        file_max_upload: true
      },
      'user_setting'
    );
    if (res?.status === RESULT_STATUS.OK) {
      const settingByCode = res?.data[0];

      const codeTypes = [settingByCode?.file_max_size, settingByCode?.file_max_upload];
      const codes = codeTypes.map(m => {
        if (!m) {
          return '';
        }
        const split = m.split('.');
        return split ? split[1] : '';
      })
      //FILE_MAX_SIZE_MB
      this.applyMasterDataToSetting(codes).then();
    }
  }

  applyMasterDataToSetting = async (codeInCodes: string[]) => {
    const rest = await this.masterDataService.find({
      parent_code: CLASS.SYSTEM_SETTING,
      code: {
        value: codeInCodes || []
      }
    }, {
      _key: true,
      code: true,
      parent_code: true,
      class: true,
      name: true
    });
    if (rest?.status === RESULT_STATUS.OK) {
      const settings = rest.data;
      this.settings = settings.map((s: any) => ({ ...s, value: s?.name }));
      if (settings.length !== 0) {
        const vMaxSize = Number(this.settings.find(f => f.code === 'FILE_MAX_SIZE')?.value);
        const vMaxUpload = Number(this.settings.find(f => f.code === 'FILE_MAX_UPLOAD')?.value);
        if (!this.maxSize) {

          this.maxSize = isNaN(vMaxSize) ? null : vMaxSize;
        }
        else {
          const maxSizeFromComponent = this.maxSize;

          if (!isNaN(vMaxSize) && maxSizeFromComponent > vMaxSize) {
            this.maxSize = vMaxSize;
          }
        }
        if (!this.maxFiles) {
          this.maxFiles = isNaN(vMaxUpload) ? null : vMaxUpload;
        }
        else {
          if (!isNaN(vMaxUpload) && this.maxFiles > vMaxUpload) {
            this.maxFiles = vMaxUpload;
          }
        }
      }
    }
  }

  ngOnInit() {

    // L???y setting file t??? user-setting v???i company default
    this.masterDataService.find(
      { company: this.company, user_id: this.company },
      {
        file_max_size: true,
        file_max_upload: true
      },
      'user_setting'
    ).then(res => {
      if (res?.status === RESULT_STATUS.OK) {
        if (res?.data.length === 0) {
          this.getBackupSetting().then();
        }
        else {
          const settingByCode = res?.data[0];

          const codeTypes = [settingByCode?.file_max_size, settingByCode?.file_max_upload];
          const codes = codeTypes.map(m => {
            if (!m) {
              return '';
            }
            const split = m.split('.');
            return split ? split[1] : '';
          })
          //FILE_MAX_SIZE_MB
          this.applyMasterDataToSetting(codes).then();

        }
      }
    });


    if (this.fileKeys && this.fileKeys.length !== 0) {
      this.fileUploadService.getFilesByFileKeys(this.fileKeys || []).then((r: any) => {
        if (r?.status === RESULT_STATUS.OK) {
          this.dataDisplayDf = r.data;
          this.displayedFiles = r.data;
        }
      })
    }
  }

  getFileMaxUpload = () => {
    const maxfile = this.settings.find(f => f.code === 'FILE_MAX_UPLOAD');
    return this.maxFiles ? this.maxFiles : maxfile ? maxfile?.value : 99;
  }

  getFileTypeSup = () => {
    const supfile = this.settings.find(f => f.code === 'FILE_TYPE_SUPPORT');
    return this.fileTypes ? this.fileTypes : supfile ? supfile?.value : null;
  }

  getMaxSizeFile = () => {
    return this.maxSize ? this.convertMb2B(this.maxSize) : null;
  }

  convertMb2B(num: number) {
    return num * 1048576;
  }

  getValueByCode = (code) => {
    return this.settings.find(f => f.code === code)?.value;
  }


  checkFileExt = (file) => {
    if (this.fileTypes) {
      const check = AitAppUtils.checkFileExt(this.fileTypes, file);
      if (check.status !== 1) {
        this.messageErrorFileSp = this.translateService.getMsg('E0012')
          .replace('{0}', this.fileTypes);
        return false;
      }
      return check?.status === 1;
    }
    return true;
  }



  /**
   * on file drop handler
   */
  onFileDropped($event) {

    this.fileBrowseHandler($event)
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
      this.loading = true;
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
  deleteFile(file?: any, index?: number, isSubmit = false) {
    if (isSubmit) {
      this.fileUploadService.removeFile(this.deletedKeys).then(r => {
        if (r.status === RESULT_STATUS.OK) {

          this.checkReq();
          this.checkCommon()
        }
      })
    }
    else {
      this.deletedKeys = [...this.deletedKeys, { _key: file?._key }];
      this.savedData = this.savedData.filter(s => s._key !== file?._key)
      this.files.splice(index, 1);
      this.fileDatas = this.fileDatas.filter(f => f._key !== file?._key);
      this.displayedFiles = this.displayedFiles.filter(f => f._key !== file?._key);
      this.watchValue.emit({ value: [...this.fileDatas, ...this.displayedFiles] });
      this.checkReq();
      this.checkCommon()
    }
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

  checkCommon = () => {
    this.messageErrorFileSp = '';
    if (!this.checkMaxFile() && this.getFileMaxUpload().toString()) {
      this.messageErrorFileSp =
        this.translateService.getMsg('E0155').replace('{0}', this.getFileMaxUpload().toString());
      return false;

    }
    else if (!this.checkMaxSize(this.fileRequest) && this.getMaxSizeFile()) {
      this.messageErrorFileSp =
        this.translateService.getMsg('E0157').replace('{0}', this.formatBytes(this.getMaxSizeFile(), 2).toString());
      return false;

    }
    else {
      return true;
    }
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
        name: this.editFileName(item),
        size: item.size
      })
    }
    this.fileRequest = fileReq;
    // this.fileDatas = [...this.fileDatas, files[files.length - 1]];
    this.files = this.files = [files[files.length - 1]];


    if (this.checkCommon()) {
      this.files = [files[files.length - 1]];

      if (this.checkFileExt(fileReq[0])) {
        setTimeout(() => {
          const { type, ...objKeys } = this.fileRequest[0];
          const data = [
            {
              ...objKeys,
              file_type: type,
              company: this.company,
              user_id: AitAppUtils.getUserId(),
              data_base64: this.currentBase64,
              _key: Guid.create().toString()
            }
          ]
          this.savedData = [...this.savedData, ...data];
          this.fileDatas = [...this.fileDatas, { ...data[0], progress: 0 }];
          this.watchValue.emit({ value: [...this.fileDatas, ...this.displayedFiles] });
          this.fileDatas.forEach((file, index) => {
            this.uploadFilesSimulator(file._key);
          })
          this.loading = false;

          this.checkReq();
        }, 400)
      }
    }


    setTimeout(() => {
      this.loading = false;
    }, 100)
  }

  checkReq = () => {
    this.componentErrors = [];
    if (this.required) {
      if ([...this.displayedFiles, ...this.fileDatas].length === 0) {
        const err = this.translateService.getMsg('E0001').replace('{0}', this.getTitle());
        this.isError = true;
        this.componentErrors = [err];
        this.onError.emit({ isValid: false });
      }
      else {
        this.isError = false;
        this.onError.emit({ isValid: true });
      }
    }
    else {
      this.isError = false;
      this.onError.emit({ isValid: true });

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
    const data = this.savedData.map(m => {
      const { type, ...objKeys } = m;
      return {
        ...objKeys,
        company: this.company,
        user_id: AitAppUtils.getUserId(),
      }
    });

    try {
      data.forEach(async (file: any) => {
        delete file.progress;
        await this.fileUploadService.uploadFile(file);
      });
    } catch (err) {
      return {
        status: 0
      }
    }
  }
}
