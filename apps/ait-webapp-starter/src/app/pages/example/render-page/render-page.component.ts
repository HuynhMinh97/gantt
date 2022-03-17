import { AitMasterDataService } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ait-render-page',
  templateUrl: './render-page.component.html',
  styleUrls: ['./render-page.component.scss']
})
export class RenderPageComponent implements OnInit {
  page: string;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private masterDataService: AitMasterDataService
  ) { 
    this.activatedRoute.queryParams.subscribe((params) => {
      this.page = params['page'];
    });
  }
  
  ngOnInit(): void {
    console.log(this.page);
  }

  public callBack = async (condition = {}) => {
    return await this.masterDataService.getAllMasterData(condition);
  }
}
