import {Component} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'ops-help-dialog',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class OpsHelpDialog {

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<OpsHelpDialog>
  ) {
  }

  close(): void {
    this.dialogRef.close(false);
  }

}
