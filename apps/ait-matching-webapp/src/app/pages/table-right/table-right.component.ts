import { Component, Input, OnInit } from '@angular/core';
import { GranttChartComponent } from '../grantt-chart/grantt-chart.component';
export interface Days{
  date:number;
  capacity:number;
}

export interface UserGantt{
  user_id:number;
  user_name:string;
  project_name:string;
  dateFrom:number;
  dateTo:number;
  capacity:number;
  days:Days[];
}

export interface ClassMonth{
  january?:string,
  february?:string,
  march?:string,
  april?:string,
  may?:string,
  june?:string,
  july?:string,
  august?:string,
  september?:string,
  october?:string,
  november?:string,
  december?:string,
}

export interface TableRight {
  id:number,
  timeMonth:ClassMonth[]
  dateFrom?:number,
  dateTo?:number,
  
}

const ELEMENT_DATA :UserGantt[]= [
  {user_id:1,user_name:'Minh',project_name:'abc',dateFrom:1656488116925,dateTo:1656580162253,days:[{date:1656488116925,capacity:4},{date:1656580162253,capacity:4}],capacity:8}]
 
  // {id:1,timeMonth:[{january:'8',february:'8',march:'16',april:'',may:'',june:'',july:'',august:'',september:'',october:'',november:'',december:''}]},
  // {id:1,timeMonth:[{january:'8',february:'8',march:'16',april:'',may:'',june:'',july:'',august:'',september:'',october:'',november:'',december:''}]}

;

@Component({
  selector: 'ait-table-right',
  templateUrl: './table-right.component.html',
  styleUrls: ['./table-right.component.scss']
})
export class TableRightComponent implements OnInit {
  @Input() checkDate:string;
  @Input() yearIndex:number;
  
  constructor() {
  console.log(this.checkDate)
   }
  ngOnInit(): void {
  }
  
  renderMonth(){
    let foo = [];
    for (var i = 1; i <= 12; i++) {
      foo.push(i);
   }
   return foo;
  }
  renderDays(value:number){
    let foo=[];
    let N=(value % 400 === 0 || (value % 100 !== 0 && value % 4 === 0))?366:365;
    for (var i = 1; i <= N; i++) {
      foo.push(i);
   }
   return foo
  }
  
  getWeekNumber(d:any) {
    // Copy date so don't modify original
    d = new Date(+d);
    d.setHours(0, 0, 0, 0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    // Get first day of year
    var yearStart:any = new Date(d.getFullYear(), 0, 1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
    // Return array of year and week number
    return [d.getFullYear(), weekNo];
  }
  
  renderWeeks(year) {
    let foo=[]
    var month = 11,
      day = 31,
      week;
  
    // Find week that 31 Dec is in. If is first week, reduce date until
    // get previous week.
    do {
      let d = new Date(year, month, day--);
      week = this.getWeekNumber(d)[1];
    } while (week == 1);
    for (var i = 1; i <= week; i++) {
      foo.push(i);
   }
   return foo
  }
  
  
  displayedColumnsMonth: string[] = this.renderMonth();
  ColumnsMonths=this.displayedColumnsMonth.length;
  displayedColumnsDays: string[] = this.renderDays(2022);
  ColumnsDay=this.displayedColumnsDays.length;
  
  displayedColumnsWeeks : string[] = this.renderWeeks(2022);
  ColumnsWeeks=this.displayedColumnsWeeks.length;
  

  dataSource = ELEMENT_DATA;
  
  
}
