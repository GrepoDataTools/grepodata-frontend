import { Component, OnInit } from '@angular/core';
import {ProfileService} from '../../../services/profile.service';
import {PageEvent} from '@angular/material/paginator';
import {JwtService} from '../../../services/jwt.service';
import {NewIndexDialog} from '../../../../shared/dialogs/new-index/new-index.component';
import {MatDialog} from '@angular/material/dialog';
import {WorldService} from '../../../../services/world.service';
import {LocalCacheService} from '../../../../services/local-cache.service';
import {IntelSourceDialog} from '../../../../shared/dialogs/intel-source/intel-source.component';
import {Globals} from '../../../../globals';

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

  hasIndexes = true;
  hasIntel = true;

  constructor(
    private globals: Globals,
    private authService: JwtService,
    private dialog: MatDialog,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.loadUserIntel();
    this.loadIndexes();
  }

  loadUserIntel() {
    let localIntel = this.getIntelListFromCache();
    if (localIntel && this.from == 0 && this.size == 20) {
      console.log('using local intel list');
      this.intel = localIntel.items;
      if ('total_items' in localIntel && localIntel.total_items >= 0) {
        this.num_results = localIntel.total_items;
      }
      this.hasIntel = true;
      this.loading = false;
      this.paging = true;
    } else {
      this.paging = true;
    }

    this.authService.accessToken().then(access_token => {
      this.profileService.getUserIntel(access_token, this.from, this.size).subscribe(
        (response) => {
          this.intel = response.items;
          if ('total_items' in response && response.total_items!=null && response.total_items >= 0) {
            console.log('setting total items: ', response.total_items);
            this.num_results = response.total_items;
          }
          if (response.batch_size <= 0) {
            this.hasIntel = false;
          } else if (this.from == 0 && this.size == 20) {
            this.saveIntelListToCache(response);
          }
          this.loading = false;
          this.paging = false;
        },
        (error) => {
          this.num_results = 0;
          this.hasIntel = false;
          this.loading = false;
          this.paging = false;
        },
      );
    });
  }

  loadIndexes() {
    let localIndexes = this.getIndexListFromCache();
    let timeout = 0;
    if (localIndexes) {
      console.log('using local index list');
      this.topIndexes = localIndexes;
      timeout = 3000;
    }

    this.loadingIndexes = !localIndexes;
    setTimeout(_ => {
      // Top indexes
      this.authService.accessToken().then(access_token => {
        this.profileService.getIndexes(access_token, 4, true, 'reports').subscribe(
          (response) => {
            this.topIndexes = response.items;
            this.loadingIndexes = false;
            console.log(this.topIndexes);
            this.saveIndexListToCache(this.topIndexes);
          },
          (error) => {
            this.hasIndexes = false;
            console.log(error);
            if ('error_code' in error.error && error.error.error_code == 3010) {
              this.confirmed = false;
            }
            this.loadingIndexes = false;
          },
        );
      });
    }, timeout);
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

  openShareInfoDialog(shared_list) {
    let indexes = shared_list.split(', ')
    let dialogRef = this.dialog.open(IntelSourceDialog, {
      autoFocus: false,
      disableClose: false,
      data: {
        index_list: indexes,
        intel_type: 'outgoing'
      }
    });
  }

  saveIndexListToCache(data) {
    this.globals.set_top_indexes(data, 60 * 24 * 14)
  }

  getIndexListFromCache() {
    return this.globals.get_top_indexes()
  }

  saveIntelListToCache(data) {
    this.globals.set_recent_intel(data, 60 * 24 * 14)
  }

  getIntelListFromCache() {
    return this.globals.get_recent_intel()
  }
}
