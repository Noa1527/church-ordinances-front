import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JeuneFillesComponent } from './jeune-filles.component';

describe('JeuneFillesComponent', () => {
  let component: JeuneFillesComponent;
  let fixture: ComponentFixture<JeuneFillesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JeuneFillesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JeuneFillesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
