import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDataListComponent } from './group-data-list.component';

describe('GroupDataListComponent', () => {
  let component: GroupDataListComponent;
  let fixture: ComponentFixture<GroupDataListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupDataListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
