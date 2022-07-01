import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRightComponent } from './table-right.component';

describe('TableRightComponent', () => {
  let component: TableRightComponent;
  let fixture: ComponentFixture<TableRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableRightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
