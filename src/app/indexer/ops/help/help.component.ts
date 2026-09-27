import {Component} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'ops-help-dialog',
  templateUrl: './help.component.html'
})
export class OpsHelpDialog {

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<OpsHelpDialog>
  ) {
    dialogRef.addPanelClass('team-dialog');
  }

  close(): void {
    this.dialogRef.close(false);
  }

}
