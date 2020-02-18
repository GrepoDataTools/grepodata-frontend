import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewDialogComponent } from './overview-dialog.component';

describe('OverviewDialogComponent', () => {
  let component: OverviewDialogComponent;
  let fixture: ComponentFixture<OverviewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
