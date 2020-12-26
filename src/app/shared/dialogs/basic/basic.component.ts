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
  actionClass: string = 'bg-gd-2';
  cancel_action: string = null;
  show_close: boolean = true;

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
    if ('show_close' in data) {
      this.show_close = data.show_close;
    }

    if ('action_type' in data) {
      console.log(data.action_type);
      switch (data.action_type) {
        case 'danger':
          this.actionClass = 'bg-gd-3';
          break;
        case 'success':
          this.actionClass = 'bg-gd-1';
          break;
        case 'primary':
        default:
          this.actionClass = 'bg-gd-2';
      }
    }

    console.log(this.actionClass);
  }

  close(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

}
