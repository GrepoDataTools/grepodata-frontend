import { Component, OnInit } from '@angular/core';
import {ContactDialog} from '../header/header.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

  constructor(
    public dialog: MatDialog) { }

  ngOnInit() {
  }

  public showContactDialog(): void {
    let dialogRef = this.dialog.open(ContactDialog, {
      // width: '600px',
      // height: '90%'
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

}
