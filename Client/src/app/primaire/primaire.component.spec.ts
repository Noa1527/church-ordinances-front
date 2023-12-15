import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaireComponent } from './primaire.component';

describe('PrimaireComponent', () => {
  let component: PrimaireComponent;
  let fixture: ComponentFixture<PrimaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
