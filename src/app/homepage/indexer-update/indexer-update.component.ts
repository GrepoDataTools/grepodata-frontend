import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ContactDialog} from '../../header/header.component';

@Component({
  selector: 'app-indexer-update',
  templateUrl: './indexer-update.component.html',
  styleUrls: ['./indexer-update.component.scss']
})
export class IndexerUpdateComponent implements OnInit {

  read_more = false;

  constructor(
    public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  showContactDialog() {
    let dialogRef = this.dialog.open(ContactDialog, {
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

}
