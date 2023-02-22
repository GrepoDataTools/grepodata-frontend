import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Globals} from '../../../globals';
import {ContactDialog} from '../../../header/header.component';

@Component({
  selector: 'app-donate-dialog',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss']
})
export class DonateDialog {

  constructor(
    public dialog: MatDialog,
    private globals: Globals,
    public dialogRef: MatDialogRef<DonateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  close(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  copyText(target) {
    let selection = window.getSelection();
    let txt = document.getElementById(target);
    let range = document.createRange();
    range.selectNodeContents(txt);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();
    this.globals.showSnackbar(
      `<h4>Copied to clipboard</h4>`,
      'success', '', true,5000);
  }

  public showContactDialog(): void {
    let dialogRef = this.dialog.open(ContactDialog, {
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

}
