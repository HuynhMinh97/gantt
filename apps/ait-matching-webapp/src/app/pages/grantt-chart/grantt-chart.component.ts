import { Component, OnInit,ElementRef } from '@angular/core';
import { NbComponentShape, NbIconLibraries } from '@nebular/theme';
import dayjs from 'dayjs';
import { LocalDataSource } from 'ng2-smart-table';
export interface JOBS{
  dateFrom:number;
  dateTo:number;
  capacity:number;
  id:number;
}

export interface Project{
  id:number;
  name:string;
}
export interface TableUser{
  id:number;
  nameProject?:string;
  nameEmpolyee:string;
  dateFrom:number;
  dateTo:number;
  dateLeft?:number;
  capacity:number;
  dateFromShow?:object;
  dateToShow?:object;
  jobs?:JOBS[];

}



export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
const USER_DATA:TableUser[]=[
  {id:1,nameProject:"Pj A",nameEmpolyee:"A",jobs:[{id:1,dateFrom:1655312400000,dateTo:1655571600000,capacity:20}],dateFrom:1655312400000, dateTo: 1655571600000,capacity:20},
  {id:2,nameProject:"Pj A",nameEmpolyee:"B",jobs:[{id:1,dateFrom:1655398800000,dateTo:1658250000000,capacity:20}],dateFrom:1655398800000, dateTo: 
  1658250000000,capacity:20},
  {id:3,nameProject:"Pj A",nameEmpolyee:"C",jobs:[{id:1,dateFrom:1655226000000,dateTo:1655485200000,capacity:20}],dateFrom:1655226000000, dateTo: 1655485200000,capacity:20},
  {id:4,nameProject:"Pj A",nameEmpolyee:"D",jobs:[{id:1,dateFrom:1655312400000,dateTo:1655571600000,capacity:20}],dateFrom:1655312400000, dateTo: 1655571600000,capacity:20},
  {id:5,nameProject:"Pj A",nameEmpolyee:"E",jobs:[{id:1,dateFrom:1650042000000,dateTo:1655571600000,capacity:40}],dateFrom:1650042000000, dateTo: 1655571600000,capacity:40},
  // {id:6,nameProject:"Pj A",nameEmpolyee:"E",dateFrom:1650042000000, dateTo: 1655571600000,capacity:40},

]

@Component({
  selector: 'ait-grantt-chart',
  templateUrl: './grantt-chart.component.html',
  styleUrls: ['./grantt-chart.component.scss']
})



export class GranttChartComponent implements OnInit {

  constructor(private elementRef:ElementRef,iconsLibrary: NbIconLibraries){
    
  }

  
  // faCoffee = faPlusCircle;
  
  today=new Date();
  thisYear=this.today.getFullYear();
  indexYear=this.thisYear;
  ngOnInit(): void {
    
  }
  changeDateFrom(value:any,index:number){
    this.dataSource[index].dateFrom=new Date(value).getTime();
    this.dataSource[index].dateLeft=(this.dataSource[index].dateTo-new Date(value).getTime())/(1000 * 3600 * 24);

  }
  datePicker(){
    
  }
  projectName=['Project A','Project B','Project C','Project D']

  changeDateTo(value:any,index:number){
    this.dataSource[index].dateTo=new Date(value).getTime();
    this.dataSource[index].dateLeft=(new Date(value).getTime()-this.dataSource[index].dateFrom)/(1000 * 3600 * 24);
  
  }
  updateDateFrom(event: any,index:number) {
    this.dataSource[index].dateFromShow = new Date(event.target.valueAsDate.getTime());
    this.dataSource[index].dateFrom=event.target.valueAsDate.getTime();
    this.dataSource[index].dateLeft=(this.dataSource[index].dateTo-this.dataSource[index].dateFrom)/(1000 * 3600 * 24);
    this.renderSideToScroll();
  }
  updateDateTo(event: any,index:number) {
    this.dataSource[index].dateToShow = new Date(event.target.valueAsDate.getTime());
    this.dataSource[index].dateTo=event.target.valueAsDate.getTime();
    this.dataSource[index].dateLeft=(this.dataSource[index].dateTo-this.dataSource[index].dateFrom)/(1000 * 3600 * 24);
    this.renderSideToScroll();
    
  }
  handlePrevYear(){
    console.log(123)
    this.indexYear=this.indexYear-1;
  }
  hanldeNextYear(){
    this.indexYear=this.indexYear+1;
  }
  handlelog(value:any){
    console.log(value
      )
  }
  handleMouseOnRowCell(value:any){
    
    value.target.setAttribute('style','background:aliceblue');
  }
  handleMouseLeaveRowCell(value:any){
    if(parseInt(value.target.children[0].innerHTML))
    {

    }else
    {value.target.setAttribute('style','background:none');}
  }

  renderSideToScroll(){
    for(let ele in this.dataSource){
      let yearFrom=new Date(this.dataSource[ele].dateFrom).getFullYear();
      let yearTo=new Date(this.dataSource[ele].dateTo).getFullYear();
      let monthFrom=new Date(this.dataSource[ele].dateFrom).getMonth();
      let monthTo=new Date(this.dataSource[ele].dateTo).getMonth();
      let monthLeft=(yearTo-yearFrom)*12+monthTo-monthFrom+1;
      console.log(monthLeft)
      let divCap:number;
      let divCapLeft:number=0;
      if(this.dataSource[ele].capacity%monthLeft==0)
      {
        divCap=this.dataSource[ele].capacity/monthLeft;
      }
      else{
        divCap=Math.ceil(this.dataSource[ele].capacity/monthLeft);
        divCapLeft=this.dataSource[ele].capacity%monthLeft;
      }
      let check=0;
      for(let i=monthFrom;i<=monthTo;i++)
      {
        // console.log(document.getElementById(`table-cell-right-${ele}`)?.children[i])
        // document.getElementById(`table-cell-right-${ele}`)?.children[1].children[i].setAttribute('style','background-color:gray');
       document.getElementById(`table-cell-right-${ele}`)?.children[i].setAttribute('style','background-color:aliceblue')
       let container=document.getElementById(`table-cell-right-${ele}`)?.children[i].children[0] as HTMLInputElement;
      //  if(divCapLeft==0)
      // {
      //   container.innerHTML=divCap.toString();
      // }else{
      //   container.innerHTML=divCap.toString();
      // }
        if(check+divCap>this.dataSource[ele].capacity)
        {
          container.innerHTML=(this.dataSource[ele].capacity-check).toString();
        }else{
          container.innerHTML=divCap.toString();
          check+=divCap;
        }

      }

    }
  }

  rs:TableUser[]=[];
  displayedColumns: string[] = ['name project', 'name empolyee', 'date from', 'date to','capacity'];
  test=USER_DATA.map(ele=>{
    
    ele.dateFromShow = new Date(ele.dateFrom); 
    ele.dateToShow = new Date(ele.dateTo);
    // ele.dateFrom=newdateFrom;
    // ele.dateTo=newdateTo;
    
    ele.dateLeft=(ele.dateTo-ele.dateFrom)/(1000 * 3600 * 24)
    return ele
  })

  renderSide(){

  }

  handleShowMonth(){
    let month=new Date().getMonth();
    let offsetLef:number=document.getElementById(`cell-month-title-${month}`)?.offsetLeft!;
    if(document.getElementById('scroll-bar')){
      document.getElementById('scroll-bar')!.scrollLeft=offsetLef ;
    }
    // console.log(document.getElementById('scroll-bar')?.scrollLeft!)
  }
  dataSource = USER_DATA;
  
  months=["January","February","March","April","May","June","July","August","September","October","November","December"];
  // attrEle=document.getElementsByClassName('cell-month-title-0')
  
  // log(param:any) {
  //   // document.querySelector(".table-work-0")?.setAttribute('style','background-color:red;width:50px');
  //   // document.querySelector(".table-work-1")?.setAttribute('style','background-color:red;width:50px');
  //   // document.querySelector(".table-work-2")?.setAttribute('style','background-color:red;width:50px');
  //   // document.querySelector(".table-work-3")?.setAttribute('style','background-color:red;width:50px');
  //   console.log(this.getNumberOfDays(2022,1));
  //   console.log(12)
  // }
  // dateText:any;
  // handleChange(param:any){
  //   console.log(typeof param.target.value);
  // }

  getNumberOfDays(year:number, month:number) {
    var isLeap = ((year % 4) == 0 && ((year % 100) != 0 || (year % 400) == 0));
    return [31, (isLeap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
}
// ngDoCheck(){
//   // document.querySelector(".table-work-0")?.setAttribute('style','background-color:red;width:50px');
//   console.log(document.querySelector(".table-work-0")?.attributes);
//   for(var date in this.dataSource)
//   {
//    this.getMonth(this.dataSource[date].dateFrom.toString())
//   }
// 

// check:any;
ngDoCheck(){
  for(var index in this.dataSource)
  {
    let day=new Date(this.dataSource[index].dateFrom).getDate();
    let dayLeft=this.dataSource[index].dateLeft;
    let month=new Date(this.dataSource[index].dateFrom).getMonth();
    let year=new Date(this.dataSource[index].dateFrom).getFullYear();
    let ele=document.getElementById(`cell-month-title-${month}`);
    let percentCell=Math.round((day/this.getNumberOfDays(year,month))*ele?.offsetWidth!);
    let percentCellLeft=Math.round((dayLeft!/this.getNumberOfDays(year,month))*ele?.offsetWidth!);
    let eleDiv=document.getElementById(`table-work-${index}`);
    let eleDivLeft=ele?.offsetLeft!+percentCell;
    let eleDivWidth=percentCellLeft;
    // if(eleDiv!=undefined)
    // {
    //   eleDiv.style.marginLeft =eleDivLeft.toString() +"px";
    //   eleDiv.style.width=percentCellLeft.toString() +"px";
    //   console.log(eleDiv.style.left)
    // }
    eleDiv?.setAttribute('style',`margin-left: ${eleDivLeft}px;width:${eleDivWidth.toString()}px;background-color:#49BBEE`);
    // document.getElementById(`table-work-${index}`)?.setAttribute('style','background-color:red');
    // document.getElementById(`table-work-${index}`)?.setAttribute('style',`width:10 px`);

  }
  
  // for(let i=0;i <tableTitleMonth.length;i++)
  // {
  //   console.log(i,tableTitleMonth[i].offsetWidth)
  // }
}

// load function contenteditable
loadContenteditable(){
  
}


randColor(length:number, ...ranges:any[]) {
  var str = "";                                                       // the string (initialized to "")
  while(length--) {                                                   // repeat this length of times
    var ind = Math.floor(Math.random() * ranges.length);              // get a random range from the ranges object
    var min = ranges[ind][0].charCodeAt(0),                           // get the minimum char code allowed for this range
        max = ranges[ind][1].charCodeAt(0);                           // get the maximum char code allowed for this range
    var c = Math.floor(Math.random() * (max - min + 1)) + min;        // get a random char code between min and max
    str += String.fromCharCode(c);                                    // convert it back into a character and append it to the string str
  }
  return str;                                                         // return str
}
getMonth(date:string){
  let m=date.slice(0,date.indexOf('/'))
  // console.log(m)
}

ngAfterViewInit() {
  this.elementRef.nativeElement.querySelector('#datefrom-left-0')?.addEventListener('blur', this.onClick.bind(this));
  this.renderSideToScroll();
}
onClick(event:any) {
  
}

// isShowPlus:boolean=false;
handleHover(value:any){
  value.target.setAttribute('style','cursor: pointer;background-color:rgba(108,117,125,0.3)');
  let ele=value.target.children[0];
  let x=ele.offsetLeft+ele.offsetWidth;
  let y=ele.page+ele.offsetHeight;
  // console.log(value.target.children[0].target);
  value.target.children[0].children[1].setAttribute('style',`position: fixed;margin-left: 8px;margin-top: 32px;`)

  // this.isShowPlus=true;
}
handleHoverOut(value:any){
  value.target.setAttribute('style','background-color:none');
  value.target.children[0].children[1].setAttribute('style','display:none')
  // this.isShowPlus=false;
}
handleClickIcon(number:number){
  let dateFrom=new Date().getTime();
  let dateTo=new Date().getTime()+24*60*60*60;
  let dateFromShow=new Date();
  let dateToShow=new Date(dateTo);
  let dateLeft=(dateTo-dateFrom)/(1000 * 3600 * 24);
  let newUser={nameProject:'',nameEmpolyee:'',id:this.dataSource.length+1,dateFrom,dateTo,capacity:0,dateFromShow ,dateToShow,dateLeft}
  this.dataSource.splice(number+1,0,newUser);
  console.log(number);
}
handleChangeCapacity(value:any,index:number){
  if(parseInt(value.target.innerText))
  this.dataSource[index].capacity=parseInt(value.target.innerText);

}

////test
///table left
settings = {
  title:'Test',
  add: {
    addButtonContent: '<i class="nb-plus"></i>',
    createButtonContent: '<i class="nb-checkmark"></i>',
    cancelButtonContent: '<i class="nb-close"></i>',
  },
  edit: {
    editButtonContent: '<i class="nb-edit"></i>',
    saveButtonContent: '<i class="nb-checkmark"></i>',
    cancelButtonContent: '<i class="nb-close"></i>',
  },
  delete: {
    deleteButtonContent: '<i class="nb-trash"></i>',
    confirmDelete: true,
  },
  editable:false
  ,
  columns: {
    id: {
      title: 'ID',
      type: 'number',
      width:'150px'
    },
    projectName: {
      title: 'Project Name',
      type: 'string',
      width:'150px'

    },
    userName: {
      title: 'Name User',
      type: 'string',
      width:'150px'

    },
    dateFrom: {
      title: 'Date From',
      type: 'string',
      width:'150px'

    },
    dateTo: {
      title: 'Date To',
      type: 'string',
      width:'150px'

    },
    Capacity: {
      title: 'Capacity',
      type: 'number',
      width:'150px',
      editable:true

    },
  },
 
};
  data = [
    {
      id: 4,
      projectName: 'Patricia Lebsack',
      userName: 'Julianne.OConner@kory.org',
      dateFrom: this.getDateFormat(1655398800000),
      dateTo:this.getDateFormat(1655398800000),
      Capacity:10
    },
    {
      id: 5,
      projectName: 'Patricia Lebsack',
      userName: 'Julianne.OConner@kory.org',
      dateFrom: this.getDateFormat(1655398800000),
      dateTo:this.getDateFormat(1655398800000),
      Capacity:10
    },
    {
      id: 5,
      projectName: 'Patricia Lebsack',
      userName: 'Julianne.OConner@kory.org',
      dateFrom: this.getDateFormat(1655398800000),
      dateTo:this.getDateFormat(1655398800000),
      Capacity:10
    },
    
  ];

  
  getDateFormat(time: number) {
    if (!time) {
      return '';
    } else {
      return dayjs(time).format('MM/YYYY');
    }
  }

  setting2={
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        width:'150px'
      },
      projectName: {
        title: 'Project Name',
        type: 'string',
        width:'150px'
  
      },
      userName: {
        title: 'Name User',
        type: 'string',
        width:'150px'
  
      },
      dateFrom: {
        title: 'Date From',
        type: 'string',
        width:'150px'
  
      },
      dateTo: {
        title: 'Date To',
        type: 'string',
        width:'150px'
  
      },
      Capacity: {
        title: 'Capacity',
        type: 'number',
        width:'150px'
  
      }
    },

    }
    onDeleteConfirm(event): void {
      if (window.confirm('Are you sure you want to delete?')) {
        event.confirm.resolve();
      } else {
        event.confirm.reject();
      }
    }
    displayedColumns1: string[] = ['position', 'name', 'weight', 'symbol'];
    dataSource1 = ELEMENT_DATA;
    

    shapes: NbComponentShape = 'round' ;
    
    takeDatePickerValue(value: number, group: string, form: string) {
      if (value) {
        const data = value as number;
        if (form == 'create_at_to' || form == 'change_at_to') {
          value = new Date(data).setHours(23, 59, 59, 0);
        } else {
          value = new Date(data).setHours(0, 0, 0, 0);
        }
        this[group].controls[form].markAsDirty();
        this[group].controls[form].setValue(value);
      } else {
        this[group].controls[form].setValue(null);
      }
      console.log(this[group].controls[form])
      
    }
    handleDays(){
      this.date='days';
    }
    handleWeeks(){
      this.date='weeks';
    }
    handleMonths(){
      this.date='months';
    }
    
    check='2022/07/07';
    

    date:string='days';
    yearNow:number=new Date().getFullYear()
    yearIndex:number=this.yearNow;
    
};
  
// name:string='';
// filterStatus:string='XEM_TAT_CA';
// isShow=true;
// isHightlight=true;
// currentStyle={color:'red',fontSize:'30px'}
// arrWords = [
//   { id: 1, en: 'action', vn: 'hành động', memorized: true },
//   { id: 2, en: 'actor', vn: 'diễn viên', memorized: false },
//   { id: 3, en: 'activity', vn: 'hoạt động', memorized: true },
//   { id: 4, en: 'active', vn: 'chủ động', memorized: true },
//   { id: 5, en: 'bath', vn: 'tắm', memorized: false },
//   { id: 6, en: 'bedroom', vn: 'phòng ngủ', memorized: true }
// ];
// vn:string='';
// en:string='';
// handleSubmit():void{
//   if(this.vn==''||this.en=='')
//   {
//     alert("Chưa có dữ liệu");
//   }else{
//     let m={id:this.arrWords.length+1,en:this.en,vn:this.vn,memorized:true};
//     this.arrWords.push(m);
//     this.vn='';
//     this.en='';
//   }
  
//   this.isShow=!this.isShow;
// }
// styleDiv={width:300+'px',height:100+'px',backgroundColor:'rgb(159 137 137 / 15%',marginBottom:10+'px'};
// handleDelete(id:number){
//   const index=this.arrWords.findIndex(word=>word.id==id)
//   this.arrWords.splice(index,1);
// }

// handleSelect(memorized:boolean){
//   const xemAll=this.filterStatus=='XEM_TAT_CA';
//   const xemNho=this.filterStatus=='NHO' && memorized;
//   const xemChuaNho=this.filterStatus=='CHUA_NHO' && !memorized;
//   return xemAll||xemNho||xemChuaNho;
// }



