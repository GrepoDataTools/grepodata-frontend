import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConquestComponent } from './conquest.component';

describe('ConquestComponent', () => {
  let component: ConquestComponent;
  let fixture: ComponentFixture<ConquestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConquestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConquestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
