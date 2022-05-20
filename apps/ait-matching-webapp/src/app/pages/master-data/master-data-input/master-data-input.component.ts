import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ait-master-data-input',
  templateUrl: './master-data-input.component.html',
  styleUrls: ['./master-data-input.component.scss']
})
export class MasterDataInputComponent implements OnInit {
_key: string;
  constructor() { }

  ngOnInit(): void {
  }

  save() {}

}
