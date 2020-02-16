import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ContactDialog} from '../../dialogs/contact/contact.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  active = '';

  constructor(public translate: TranslateService,
              private router: Router,
              public dialog: MatDialog) {
    router.events.subscribe((params) => {
      let val: any = params;
      if ('url' in val) {
        let path = val.url;
        if (path.includes('/points')) {
          this.active = 'points';
        } else if (path.includes('/discord')) {
          this.active = 'discord';
        } else if (path.includes('/compare')) {
          this.active = 'compare';
        } else if (path.includes('/ranking')) {
          this.active = 'ranking';
        } else if (path.includes('/indexer')) {
          this.active = 'indexer';
        } else {
          this.active = '';
        }
      }
    });
    const browserLang = translate.getBrowserLang();
   }

  ngOnInit(): void {
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
