import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagicLoginComponent } from './magic-login.component';

describe('MagicLoginComponent', () => {
  let component: MagicLoginComponent;
  let fixture: ComponentFixture<MagicLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MagicLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MagicLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
