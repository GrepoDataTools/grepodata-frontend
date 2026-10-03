import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'ops-intel-dialog',
  templateUrl: './intel-dialog.component.html',
  host: {class: 'block h-full'}
})
export class OpsIntelDialog {

  world: any
  id: any
  type: any
  team: any

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<OpsIntelDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.addPanelClass('team-dialog');
    this.id = data.id;
    this.type = data.type;
    this.world = data.world;
    this.team = data.team;
  }

  close(): void {
    this.dialogRef.close(false);
  }

}
