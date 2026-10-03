import { Component, OnInit } from '@angular/core';
import {ContactDialog} from '../header/header.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
})
export class PrivacyComponent implements OnInit {

  language = 0;

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

  scroll(el: HTMLElement) {
    const yOffset = -80;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  }

}
