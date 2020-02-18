import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BbScoreboardDialogComponent } from './bb-scoreboard-dialog.component';

describe('BbScoreboardDialogComponent', () => {
  let component: BbScoreboardDialogComponent;
  let fixture: ComponentFixture<BbScoreboardDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BbScoreboardDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BbScoreboardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
