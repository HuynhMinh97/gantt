import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'ait-user-reorder-skills',
  templateUrl: './user-reorder-skills.component.html',
  styleUrls: ['./user-reorder-skills.component.scss']
})
export class UserReorderSkillsComponent implements OnInit {
  skillByCategory = [
    {
      name: "TOP5",
      data:[
        {
          top_skill: true,
          _key:"1111111111111",
          name:"JAVA11"
        },
        {
          top_skill: true,
          _key:"1111111111111",
          name:"JAVA2"
        },
        {
          top_skill: true,
          _key:"11111111111113",
          name:"JAVA3"
        },
        {
          top_skill: true,
          _key:"11111111111114",
          name:"JAVA4"
        },
       
      ],
        
    },
    {
      name: "INDUSTRY KNOWLEDGE",
      data:[
        {
          top_skill: true,
          _key:"1111111111111",
          name:"JAVA5"
        },
        {
          top_skill: false,
          _key:"1111111111111",
          name:"JAVA6"
        },
        {
          top_skill: false,
          _key:"1111111111111",
          name:"JAVA7"
        },
        {
          top_skill: false,
          _key:"1111111111111",
          name:"JAVA8"
        },
       
      ],
    },
    {
      name: "TOOLS",
      data:[
        {
          top_skill: false,
          _key:"1111111111111",
          name:"JAVA9"
        },
        {
          top_skill: true,
          _key:"1111111111111",
          name:"JAVA10"
        },
        {
          top_skill: false,
          _key:"1111111111111",
          name:"JAVA11"
        },
        {
          top_skill: true,
          _key:"1111111111111",
          name:"JAVA12"
        },
       
      ],
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

}
