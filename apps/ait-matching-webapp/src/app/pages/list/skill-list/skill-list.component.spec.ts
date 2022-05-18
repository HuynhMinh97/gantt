import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillListViewComponent } from './skill-list.component';

describe('SkillListViewComponent', () => {
  let component: SkillListViewComponent;
  let fixture: ComponentFixture<SkillListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillListViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
