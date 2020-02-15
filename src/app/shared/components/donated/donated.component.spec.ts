import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonatedComponent } from './donated.component';

describe('DonatedComponent', () => {
  let component: DonatedComponent;
  let fixture: ComponentFixture<DonatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
