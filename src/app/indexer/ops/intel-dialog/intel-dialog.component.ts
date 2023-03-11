import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'ops-intel-dialog',
  templateUrl: './intel-dialog.component.html',
  styleUrls: ['./intel-dialog.component.scss']
})
export class OpsIntelDialog {

  world: any
  id: any
  team: any

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<OpsIntelDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = data.id;
    this.world = data.world;
    this.team = data.team;
  }

  close(): void {
    this.dialogRef.close(false);
  }

}
