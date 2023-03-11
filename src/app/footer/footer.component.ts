import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  date = new Date();
  sidebar = false;
  height_adjust = false;
  simplified = false;
  copyright = true;
  hidden = false;

  constructor(
    public dialog: MatDialog,
    public router: Router) {
    router.events.subscribe((params) => {
      let val: any = params;
      if ('url' in val) {
        let path = val.url;
        this.height_adjust = false;
        this.sidebar = false;
        this.simplified = false;
        this.copyright = true;
        this.hidden = false;
        if (path.indexOf('/compare') !== -1) {
          this.sidebar = true;
        } else if (path.indexOf('/points') !== -1) {
          this.height_adjust = true;
        } else if (path.indexOf('/indexer') !== -1) {
          this.simplified = true;
        } else if (path.indexOf('/operations') !== -1) {
          this.hidden = true;
        } else if (path === '/') {
          // hide on homepage
          this.hidden = true;
        } else if (
          path.indexOf('/profile') !== -1
          || path.indexOf('/intel') !== -1
        ) {
          this.simplified = true;
          this.copyright = false;
          this.hidden = true;
        }
      }
    });
  }

  ngOnInit() {
  }

  public showDisclaimerDialog(): void {
    let dialogRef = this.dialog.open(DisclaimerDialog, {
      // width: '600px',
      // height: '80%'
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

}

@Component({
  selector: 'disclaimer-dialog',
  templateUrl: '../footer/disclaimer-dialog.html',
})
export class DisclaimerDialog {
  date = new Date();

  constructor(
    public dialogRef: MatDialogRef<DisclaimerDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
