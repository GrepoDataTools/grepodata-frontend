import { Component, OnInit } from '@angular/core';
import {ProfileService} from '../../../services/profile.service';
import {PageEvent} from '@angular/material/paginator';
import {JwtService} from '../../../services/jwt.service';
import {NewIndexDialog} from '../../../../shared/dialogs/new-index/new-index.component';
import {MatDialog} from '@angular/material/dialog';
import {WorldService} from '../../../../services/world.service';

@Component({
  selector: 'app-intel',
  templateUrl: './intel.component.html',
  styleUrls: ['./intel.component.scss'],
  providers: [ProfileService, WorldService]
})
export class IntelComponent implements OnInit {

  from = 0;
  size = 20;
  num_results = 20;
  pageEvent: PageEvent;

  loadingIndexes = true;
  confirmed = true;

  loading = true;
  paging = true;
  intel = null;
  topIndexes = [];

  constructor(
    private authService: JwtService,
    private dialog: MatDialog,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.loadUserIntel();
    this.loadIndexes();
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

  loadIndexes() {
    // Top indexes
    this.loadingIndexes = true;
    this.authService.accessToken().then(access_token => {
      this.profileService.getIndexes(access_token, 4, true, 'reports').subscribe(
        (response) => {
          this.topIndexes = response.items;
          this.loadingIndexes = false;
          console.log(this.topIndexes);
        },
        (error) => {
          console.log(error);
          if ('error_code' in error.error && error.error.error_code == 3010) {
            this.confirmed = false;
          }
          this.loadingIndexes = false;
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
