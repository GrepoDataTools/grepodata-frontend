import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerOverviewDialogComponent } from './player-overview-dialog.component';

describe('PlayerOverviewDialogComponent', () => {
  let component: PlayerOverviewDialogComponent;
  let fixture: ComponentFixture<PlayerOverviewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerOverviewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerOverviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
