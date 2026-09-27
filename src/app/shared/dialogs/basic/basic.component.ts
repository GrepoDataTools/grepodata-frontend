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
  actionClass: string = 'bg-navy-800 hover:bg-slate-900';
  icon: string = '';
  iconClass: string = '';
  cancel_action: string = null;
  show_close: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<BasicDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
    dialogRef.addPanelClass('team-dialog');

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
      switch (data.action_type) {
        case 'danger':
          this.actionClass = 'bg-rose-600 hover:bg-rose-700';
          this.icon = 'exclamation-triangle';
          this.iconClass = 'bg-rose-100 text-rose-600';
          break;
        case 'success':
          this.actionClass = 'bg-brand-700 hover:bg-brand-800';
          break;
        case 'primary':
        default:
          this.actionClass = 'bg-navy-800 hover:bg-slate-900';
      }
    }
    if ('icon' in data) {
      this.icon = data.icon;
    }
    if ('iconClass' in data) {
      this.iconClass = data.iconClass;
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

}
