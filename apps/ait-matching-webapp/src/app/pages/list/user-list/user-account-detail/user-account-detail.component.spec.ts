import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountDetailComponent } from './user-account-detail.component';

describe('UserAccountDetailComponent', () => {
  let component: UserAccountDetailComponent;
  let fixture: ComponentFixture<UserAccountDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAccountDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
