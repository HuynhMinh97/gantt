/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { RESULT_STATUS } from '@ait/shared';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { select, Store } from '@ngrx/store';
import { AitBinaryDataService } from '../../services/ait-binary-data.service';
import { AitTranslationService } from '../../services/common/ait-translate.service';
import { AppState, getCaption } from '../../state/selectors';

@Component({
  selector: 'ait-output-file',
  templateUrl: 'ait-output-file.component.html',
  styleUrls: ['./ait-output-file.component.scss']
})

export class AitOutputFileComponent implements OnChanges {
  constructor(
    private fileService: AitBinaryDataService,
    private sanitizer: DomSanitizer,
    private translateService: AitTranslationService,
    private store:Store<AppState>
  ) {
    this.url = fileService.downloadUrl;
    store.pipe(select(getCaption)).subscribe(() => {
      this.numberOfFilesI18 = translateService.translate(this.numberOfFilesI18);
    })
  }
  @Input() fileKeys = [];
  @Input() label;
  @Input() guidance = ''
  @Input() guidanceIcon = 'info-outline';
  @Input() classContainer;
  files: any[] = [
  ]
  url = ''

  numberOfFilesI18 = 'c_3001';

  prefixHref = (type) => `data:${type};base64,`;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  base64 = '';

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getUrl = (file_key) => this.url + `?file_key=${file_key}`


  download = (file_key: string, fileName: string) => {
    this.createAndDownloadBlobFile(file_key, fileName);
  }

  hexToBase64(str) {
    return atob(str)
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        const element = changes[key];
        if (element.currentValue?.length !== 0 && key === 'fileKeys') {
          this.fileService.getFilesByFileKeys(element.currentValue).then(r => {
            if (r?.status === RESULT_STATUS.OK) {
              console.log(r.data)
              this.files = r.data;
            }
          });
        }

      }
    }
  }

  encode(input) {
    const keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    let i = 0;

    while (i < input.length) {
      chr1 = input[i++];
      chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index
      chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
        keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    return output;
  }


  base64ToArrayBuffer(base64: any) {
    const arrayBuffer = base64.data;
    const bytes = new Uint8Array(arrayBuffer);
    return this.encode(bytes);
  }

  createAndDownloadBlobFile(file_key, filename,) {
    // Browsers that support HTML5 download attribute
    this.fileService.downloadFile(file_key).then((r: any) => {
      this.base64 = this.base64ToArrayBuffer(r.value.data);
    });

  }

  numberFixed = (number: number) => number.toFixed(2)

}
