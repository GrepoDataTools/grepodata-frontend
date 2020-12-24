import { Component, OnInit } from '@angular/core';
import {ProfileService} from '../../../services/profile.service';
import {PageEvent} from '@angular/material/paginator';
import {JwtService} from '../../../services/jwt.service';
import {NewIndexDialog} from '../../../../shared/dialogs/new-index/new-index.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-intel',
  templateUrl: './intel.component.html',
  styleUrls: ['./intel.component.scss'],
  providers: [ProfileService]
})
export class IntelComponent implements OnInit {

  from = 0;
  size = 20;
  num_results = 20;
  pageEvent: PageEvent;

  loading = true;
  paging = true;
  intel = null;
  topIndexes = [{name: 'test1'}, {name: 'test1'}, {name: 'test1'}, {name: 'test1'}];

  constructor(
    private authService: JwtService,
    private dialog: MatDialog,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.loadUserIntel();
  }

  loadUserIntel() {
    this.paging = true;

    this.authService.accessToken().then(access_token => {
      this.profileService.getUserIntel(access_token, this.from, this.size).subscribe(
        (response) => {
          // this.accounts = response.items;
          // Object.keys(this.accounts).forEach(account => {
          //   if (this.accounts[account].confirmed) {
          //     this.linked = true;
          //   }
          // });
          this.intel = response.items;
          this.num_results = response.size;
          if (typeof this.num_results === 'string') {
            console.log(this.num_results);
            this.num_results = this.from + this.size + 1
          }
          this.loading = false;
          this.paging = false;
        },
        (error) => {
          this.loading = false;
          this.paging = false;
        },
      );
    });
  }

  public newIndex() {
    let dialogRef = this.dialog.open(NewIndexDialog, {
      // width: '80%',
      // height: '90%'
      autoFocus: false,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  paginatorEvent($event) {
    this.pageEvent = $event;
    if (typeof this.pageEvent != 'undefined') {
      this.from = this.pageEvent.pageIndex * this.pageEvent.pageSize;
      this.size = this.pageEvent.pageSize;
    }
    this.loadUserIntel();
  }

}
