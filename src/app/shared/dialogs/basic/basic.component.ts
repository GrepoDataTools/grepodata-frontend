import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-basic-dialog',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})
export class BasicDialog {

  title: string;
  messageHtml: string;
  action: string = 'Dismiss';
  cancel_action: string = null;

  constructor(
    public dialogRef: MatDialogRef<BasicDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;

    this.title = data.title;
    this.messageHtml = data.messageHtml;
    if ('action' in data) {
      this.action = data.action;
    }
    if ('cancel_action' in data) {
      this.cancel_action = data.cancel_action;
    }
  }

  close(): void {
    this.dialogRef.close();
  }

}
