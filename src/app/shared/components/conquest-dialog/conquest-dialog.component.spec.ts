import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConquestDialogComponent } from './conquest-dialog.component';

describe('ConquestDialogComponent', () => {
  let component: ConquestDialogComponent;
  let fixture: ComponentFixture<ConquestDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConquestDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConquestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
