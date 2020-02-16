import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexHomeComponent } from './index-home.component';

describe('IndexHomeComponent', () => {
  let component: IndexHomeComponent;
  let fixture: ComponentFixture<IndexHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
