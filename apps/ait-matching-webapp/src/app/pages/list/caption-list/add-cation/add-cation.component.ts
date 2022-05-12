import { AddCaptionService } from './../../../../services/add-caption.service';
import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AitRenderPageService,
  AppState,
} from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ait-add-cation',
  templateUrl: './add-cation.component.html',
  styleUrls: ['./add-cation.component.scss'],
})
export class AddCationComponent extends AitBaseComponent implements OnInit {
  caption_key: string;
  group_no = 1;
  captionForm: FormGroup;


  constructor(
    public activeRouter: ActivatedRoute,
    private addCaptionService: AddCaptionService,
    private formBuilder: FormBuilder,

    env: AitEnvironmentService,
    store: Store<AppState>,
    apollo: Apollo,
    authService: AitAuthService,
    toastrService: NbToastrService,
    layoutScrollService: NbLayoutScrollService
  ) {
    super(
      store,
      authService,
      apollo,
      null,
      env,
      layoutScrollService,
      toastrService
    );

    this.captionForm = this.formBuilder.group({
      module: new FormControl(null, [Validators.required]),
      page: new FormControl(null, [Validators.required]),
      code: new FormControl(null, [Validators.required]),
      en_US: new FormControl(null, [Validators.required]),
      vi_VN: new FormControl(null, [Validators.required]),
      ja_JP: new FormControl(null, [Validators.required]),
      start_date_from: new FormControl(null, [Validators.required]),
      start_date_to: new FormControl(null, [Validators.required]),
      issue_date: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.caption_key = this.activeRouter.snapshot.paramMap.get('id');
    // if ( this.caption_key) {
    //   this.getCaptionByKey();
    // }
    this.cancelLoadingApp();
  }

  // async getCaptionByKey() {
  //   const captionData = {};
  //   const caption = await this.addCaptionService.findCaptionByKey(this.caption_key);
  //   captionData['en_US']  = caption.data[0].name.en_US;
  //   captionData['ja_JP'] = caption.data[0].name.ja_JP;
  //   captionData['vi_VN'] = caption.data[0].name.vi_VN;
  //   captionData['module']  = caption.data[0].module
  //   captionData['page'] = caption.data[0].page
  //   captionData['code'] = caption.data[0].code
  //   // console.log(captionData);
  //   this.captionForm.patchValue({...captionData}) ;
  //   console.log(this.captionForm.value);
  //   return caption;
  // }

  public find = async () => {
    const captionData = {};
    captionData['data'] = {};
    captionData['data'][0] = {};
    const caption = await this.addCaptionService.findCaptionByKey(this.caption_key);
    captionData['data'][0]['en_US']  = caption.data[0].name.en_US;
    captionData['data'][0]['ja_JP'] = caption.data[0].name.ja_JP;
    captionData['data'][0]['vi_VN'] = caption.data[0].name.vi_VN;
    captionData['data'][0]['module']  = '13629480'
    captionData['data'][0]['page'] = '13629175'
    captionData['data'][0]['code'] = caption.data[0].code
    // this.captionForm.patchValue({...captionData}) ;
    return captionData;
  }

  public save = async (condition = {}) => {
    let page_key
    let module_key

    const saveData = {};
    saveData['name'] = {};
    Object.keys(condition).forEach((key) => {
      if (key.includes('page')){
        page_key = condition[key];
      }
      if (key.includes('module')){
        module_key = condition[key];
      }
      const value = condition[key];
      key.includes('en_US')
        ? (saveData['name']['en_US'] = value)
        : key.includes('ja_JP')
        ? (saveData['name']['ja_JP'] = value)
        : key.includes('vi_VN')
        ? (saveData['name']['vi_VN'] = value)
        : (saveData[key] = value);
    });
    const page = await this.addCaptionService.findPageByKey(page_key);
    const module = await this.addCaptionService.findModuleByKey(module_key);
    saveData['page'] = page.data[0].code;
    saveData['module'] = module.data[0].code;
    saveData['active_flag'] = true;
    if(this.caption_key){
      saveData['_key'] = this.caption_key;
    }
    saveData['active_flag'] = true;
    console.log(saveData);
    
    return await this.addCaptionService.saveCaption(saveData);
  };
}
