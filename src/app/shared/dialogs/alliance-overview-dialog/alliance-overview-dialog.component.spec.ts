import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllianceOverviewDialogComponent } from './alliance-overview-dialog.component';

describe('AllianceOverviewDialogComponent', () => {
  let component: AllianceOverviewDialogComponent;
  let fixture: ComponentFixture<AllianceOverviewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllianceOverviewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllianceOverviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
