import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableInlineEditComponent } from './table-inline-edit.component';

describe('TableInlineEditComponent', () => {
  let component: TableInlineEditComponent;
  let fixture: ComponentFixture<TableInlineEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableInlineEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableInlineEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
