import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexVersionComponent } from './index-version.component';

describe('IndexVersionComponent', () => {
  let component: IndexVersionComponent;
  let fixture: ComponentFixture<IndexVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
