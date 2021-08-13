import { AitAuthService, AitEnvironmentService, AitMasterDataService, AitTranslationService, AppState, MODE } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbToastrService, NbGlobalLogicalPosition, NbLayoutScrollService } from '@nebular/theme';
import { isArrayFull, isObjectFull, KeyValueDto } from '@ait/shared';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { extend } from 'lodash';
import { AitBaseComponent } from '../../../../../../libs/ui/src/lib/components/base.component';
import kanjidate from 'kanjidate';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ait-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent extends AitBaseComponent implements OnInit {
  userInfo: FormGroup;
  mode = MODE.NEW;
  user_key = '';
  isReset = false
  resetUserInfo = {
    name: new FormControl(null),
      certificate: false,
      grade: false,
      issue: false,
      issueDate: false,
      immigration: false,
      description: false,
      file: false,
  };
  datas = [
    {
      id: "1",
      user_id: "01442c21-0944-46e2-a946-0df9dc0d08c7",
      name : [{_key:'11a', value: 'Thuan1'}],
      certificate :"thuan1",
      grade : "thuan",
      issue : [{_key:'3a', value: 'HEHEHE'}, {_key:'3b', value: 'HOHOHOHO'}],
      issueDate : "2021/08/17",
      immigration : "2021/08/10",
      description : "tudakjpfokskd",
      file : '/r/r/r'
    },
    {
      id: "2",
      user_id: "01442c21-0944-46e2-a946-0df9dc0d08c7",
      name : [{_key:'11a', value: 'thuan2'}],
      certificate :"thuan2",
      grade : "thuan2",
      issue : [{_key:'3a', value: 'HEHEHE'}, {_key:'3b', value: 'HOHOHOHO'}],
      issueDate : "2021/08/17",
      immigration : "2021/08/10",
      description : "tudakjpfokskd",
      file : '/r/r/r'
    }
  ]
  fakeData = {
    
  }
  constructor(
    public usersService : UserService,
    private formBuilder: FormBuilder,
    layoutScrollService: NbLayoutScrollService,
    private masterDataService: AitMasterDataService,
    public activeRouter: ActivatedRoute,
    // private matchingCompanyService: RecommencedUserService,
    // private reactionService: ReactionService,
    private translateService: AitTranslationService,
    store: Store<AppState>,
    authService: AitAuthService,
   
    env: AitEnvironmentService,
    apollo: Apollo
  ) {
    super(store, authService, apollo, null, env, layoutScrollService);
    
    this.userInfo = this.formBuilder.group({
      name: new FormControl(null),
      certificate: new FormControl(null),
      grade: new FormControl(null),
      issue: new FormControl(null),  
      issueDate: new FormControl(null),
      immigration: new FormControl(null),
      description: new FormControl(null),
      file: new FormControl(null),
    });

    // get key form parameters
    this.user_key = this.activeRouter.snapshot.paramMap.get('id');
    
    if (this.user_key) {
      this.mode = MODE.EDIT;
      for(let i of this.datas){
        if(i.id == this.user_key){
          this.fakeData = i;
        }
      }
    }
    if (this.mode === MODE.NEW) {
      this.userInfo.addControl(
        'agreement',
        new FormControl(false, [Validators.requiredTrue])
      );
    }

  }
  takeInputValue(value: string, form: string): void {
    this.userInfo.controls[form].setValue(value); 
  }
  setKanjiDate() {
    const dob_jp = kanjidate.format(
      kanjidate.f2,
      new Date(this.userInfo.controls['dob'].value)
    );
    this.userInfo.controls['dob_jp'].setValue(dob_jp);
  }
  takeDatePickerValue(value: number, group: string, form: string) {
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(value);
      // set jp_dob format japan cadidates
      form === 'dob' && this.setKanjiDate();
    } else {
      this[group].controls[form].setValue(null);
      form === 'dob' && this.userInfo.controls['dob_jp'].setValue(null);
    }
  }
  getFiles(fileList: any[]) {
    if (isArrayFull(fileList)) {
      const data = [];
      fileList.forEach((file) => {
        data.push(file._key);
      });
      this.userInfo.controls['agreement_file'].setValue(data);
    } else {
      this.userInfo.controls['agreement_file'].setValue(null);
    }
  }
  ngOnInit(): void {
    if(this.user_key){
      this.userInfo.patchValue({...this.fakeData});
    }
  }

  save = () => {
    this.datas.push(this.userInfo.value);
    console.log(this.datas);
  }
  resetForm() {
    if (this.mode === MODE.NEW) {
      console.log(this.userInfo.value)
      this.userInfo.reset();
      for (const prop in this.resetUserInfo) {
        this.resetUserInfo[prop] = true;
        setTimeout(() => {
          this.resetUserInfo[prop] = false;
        }, 10);
      }
    }
    else if(this.mode === MODE.EDIT){
      this.userInfo.reset();
      for (const prop in this.resetUserInfo) {
        this.resetUserInfo[prop] = true;
        setTimeout(() => {
          this.resetUserInfo[prop] = false;
        }, 10);
      }
    }
    this.showToastr('', this.getMsg('I0007'));
  }

}