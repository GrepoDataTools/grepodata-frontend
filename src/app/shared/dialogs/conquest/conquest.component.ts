import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';


@Component({
  selector: 'conquest-dialog',
  templateUrl: './conquest.component.html'
})
export class ConquestDialog {

  params: any;
  name: string;

  constructor(
    public dialogRef: MatDialogRef<ConquestDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.params = data.filters;
    this.name = data.name
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}