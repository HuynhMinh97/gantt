import { CreateUserService } from './../../../../services/create-user.service';
import { GRAPHQL, RESULT_STATUS } from '@ait/shared';
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
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'ait-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent extends AitBaseComponent implements OnInit {
  userForm: FormGroup;
  user_key = '';
  checkPw = false;
  constructor(
    private formBuilder: FormBuilder,
    private createUserService: CreateUserService,
    public activeRouter: ActivatedRoute,


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

    this.userForm = this.formBuilder.group({
      username: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      confirmPassword: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.user_key = this.activeRouter.snapshot.paramMap.get('id');
    this.cancelLoadingApp();
  }

  
  public save = async (condition = {}) => {
    let email;
    let password;
    let username;
    let confirmPassword;
    let _key
    const saveData = {};
    saveData['user_id'] = this.authService.getUserID();
    Object.keys(condition).forEach((key) => {
      const value = condition[key];
      saveData[key] = value;
      switch (key) {
        case 'password': {
          password = value;
          break;
        }
        case 'email': {
          email = value;
          break;
        }
        case 'username': {
          username = value;
          break;
        }
        case 'confirm_password': {
          confirmPassword = value;
          break;
        }
        default: {
          _key= value
        }
      }
    });
    password === confirmPassword
      ? (this.checkPw = true)
      : (this.checkPw = false);
     
    if (this.checkPw) {
      const result = await this.createUserService.registerForAdmin(
        username,
        email,
        password,
        this.env?.COMMON?.COMPANY_DEFAULT,
        _key
      );

      const data = {
        status: RESULT_STATUS.OK,
      };
      return data;
    } else {
      const data = {
        status: GRAPHQL.CHECK_PASSWORD,
      };
      return data;
    }
  };
}
