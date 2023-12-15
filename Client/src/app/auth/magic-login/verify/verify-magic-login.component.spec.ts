import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyMagicLoginComponent } from './verify-magic-login.component';

describe('VerifyMagicLoginComponent', () => {
  let component: VerifyMagicLoginComponent;
  let fixture: ComponentFixture<VerifyMagicLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyMagicLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyMagicLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
