import { isArrayFull, isObjectFull, KeyValueDto } from '@ait/shared';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Guid } from 'guid-typescript';
import _ from 'lodash';
@Component({
  selector: 'ait-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnChanges {
  dataForm: FormGroup;
  guid = Guid.create().toString();
  @Output() watchValue = new EventEmitter();
  @Input() areaStyle = {};
  @Input() elementStyle = {};
  @Input() masterStyle = { width: '400px' };
  @Input() inputWidth = '400px';
  @Input() isReset = {
    country_region: false,
    postcode: false,
    province_city: false,
    district: false,
    ward: false,
  };
  @Input() defaultValue: any;
  @Input() isSubmit = false;
  constructor(private formBuilder: FormBuilder) {
    this.dataForm = this.formBuilder.group({
      country_region: new FormControl(null, [Validators.required]),
      postcode: new FormControl(null, [
        Validators.required,
        Validators.maxLength(20),
      ]),
      province_city: new FormControl(null, [Validators.required]),
      district: new FormControl(null, [Validators.required]),
      ward: new FormControl(null, [Validators.required]),
    });
  }

  ngOnChanges() {
    if (this.defaultValue) {
      this.dataForm.patchValue({ ...this.defaultValue })
    }

  }
  takeInputValue(value: string): void {
    if (value) {
      this.dataForm.controls['postcode'].markAsDirty();
      this.dataForm.controls['postcode'].setValue(value);
    } else {
      this.dataForm.controls['postcode'].setValue(null);
    }
    this.watchValue.emit({ ...this.dataForm.value });
  }

  takeMasterValue(value: KeyValueDto | KeyValueDto[], form: string): void {
    const data = this.dataForm.controls[form].value;
    if (isObjectFull(value)) {
      const target = isArrayFull(value) ? value[0] : value;
      const isEqual = _.isEqual(target, data);
      if (isEqual) {
        return;
      }
      this.dataForm.controls[form].markAsDirty();
      this.dataForm.controls[form].setValue(
        isArrayFull(value) ? value[0] : value
      );
      if (form !== 'ward') {
        this.resetValue(form);
      }
    } else {
      this.dataForm.controls[form].setValue(null);
      this.resetValue(form);
    }
    this.watchValue.emit({ ...this.dataForm.value });
  }

  resetValue(form: string) {
    this.dataForm.controls['ward'].setValue(null);
    this.isReset.ward = true;
    setTimeout(() => {
      this.isReset.ward = false;
    }, 50);
    if (form === 'province') {
      this.dataForm.controls['district'].setValue(null);
      this.isReset.ward = true;
      this.isReset.district = true;
      setTimeout(() => {
        this.isReset.ward = false;
        this.isReset.district = false;
      }, 50);
    } else if (form === 'country_region') {
      this.dataForm.controls['province_city'].setValue(null);
      this.dataForm.controls['district'].setValue(null);
      this.isReset.ward = true;
      this.isReset.district = true;
      this.isReset.province_city = true;
      setTimeout(() => {
        this.isReset.ward = false;
        this.isReset.district = false;
        this.isReset.province_city = false;
      }, 50);
    }
  }

  getParentCode(parent: string): string {
    const parentCode = this.dataForm.controls[parent].value;
    if (parentCode) {
      return parentCode._key || this.guid;
    } else {
      return this.guid;
    }
  }
}
