import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDataMasterComponent } from './edit-data-master.component';

describe('EditDataMasterComponent', () => {
  let component: EditDataMasterComponent;
  let fixture: ComponentFixture<EditDataMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDataMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDataMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
