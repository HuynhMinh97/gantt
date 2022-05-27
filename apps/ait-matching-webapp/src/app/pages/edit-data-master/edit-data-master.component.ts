import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AppState,
} from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { EditDataMasterService } from '../../services/edit-data-master.service';
import { MasterListService } from '../../services/master-list.service';

@Component({
  selector: 'ait-edit-data-master',
  templateUrl: './edit-data-master.component.html',
  styleUrls: ['./edit-data-master.component.scss'],
})
export class EditDataMasterComponent
  extends AitBaseComponent
  implements OnInit {
  _key: string;
  dataForm: FormGroup;
  obj = {};
  collections = [
    'm_certificate_award',
    'm_company',
    'm_industry',
    'm_project',
    'm_title',
    'm_training_center',
    'm_school',
    'm_skill',
  ];
  constructor(
    public activeRouter: ActivatedRoute,
    private formBuilder: FormBuilder,
    private editDataMasterService: EditDataMasterService,

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

    this.dataForm = this.formBuilder.group({
      collection: new FormControl(null, [Validators.required]),
      en_US: new FormControl(null, [Validators.required]),
      vi_VN: new FormControl(null, [Validators.required]),
      ja_JP: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this._key = this.activeRouter.snapshot.paramMap.get('id');
    this.cancelLoadingApp();
  }

  public find = async () => {
    const condition = {
      _key: this._key,
    };
    
    const Data = {};
    Data['data'] = {};
    Data['data'][0] = {};
    for (const collection of this.collections) {
      await this.editDataMasterService
        .getRecordOfMaster(condition, collection)
        .then((res) => {
          if(res.data[0]._id){
            Data['data'][0]['name_en_US'] = res.data[0]?.name.en_US;
            Data['data'][0]['name_ja_JP'] = res.data[0]?.name.ja_JP;
            Data['data'][0]['name_vi_VN'] = res.data[0]?.name.vi_VN;
            Data['data'][0]['collection'] = res.data[0]?._id.split('/', 1)[0];
            Data['data'][0]['active_flag'] = res.data[0]?.active_flag;
          }
        });
    }
    console.log(Data)
    return Data;
  };

  public save = async (condition = {}) => {
    const saveData = {};
    const collection = condition['collection'];
    saveData['name'] = {};
    Object.keys(condition).forEach((key) => {
      const value = condition[key];
      if (key.includes('en_US')){
        saveData['name']['en_US'] = value
      }
      if (key.includes('ja_JP')){
        saveData['name']['ja_JP'] = value
      }
      if (key.includes('vi_VN')){
        saveData['name']['vi_VN'] = value
      }

    });
    saveData['_key'] = this._key;
    saveData['active_flag'] = condition['active_flag'] ? condition['active_flag'] : false;
    return  await this.editDataMasterService.saveDataMaster(saveData, collection);
  };
}
