import { RESULT_STATUS } from '@ait/shared';
import { Component, OnInit } from '@angular/core';
import { AddRoleService } from '../../services/add-role.service';

@Component({
  selector: 'ait-table-inline-edit',
  templateUrl: './table-inline-edit.component.html',
  styleUrls: ['./table-inline-edit.component.scss']
})
export class TableInlineEditComponent implements OnInit {
  employeeList: any[] = [];
  isEdit = false;
  id : number
   data = [
     {id: 1, name: 'name 1 name 1 name 1 name 1', start_plan: 1652692672901, end_plan: 1652692672901, remark:'project ok'},
     {id: 2, name: 'name 1 name 1 name 1 name 1', start_plan: 1652692672901, end_plan: 1652692672901, remark:'project ok'},
     {id: 3, name: 'name 1 name 1 name 1 name 1', start_plan: 1652692672901, end_plan: 1652692672901, remark:'project ok'},
   ];

  constructor(
    private addRoleService: AddRoleService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getEmployee();
    console.log(this.employeeList)
  }

  handleClickEdit(id) {
    this.id = id;
    this.isEdit = true;
  }

  handleClickCancel(){
    this.id = 0;
    this.isEdit = false;
  }

  async getEmployee() {
    await this.addRoleService.getEmployee().then((res) => {
      if (res.status === RESULT_STATUS.OK) {
        const data = [];
        (res.data || []).forEach((e: any) =>
          data.push({ _key: e?._key, value: e?.full_name })
        );
        this.employeeList = data;
      }
    });
  }

}
