import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexTableComponent } from './table.component';

describe('TableComponent', () => {
  let component: IndexTableComponent;
  let fixture: ComponentFixture<IndexTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
