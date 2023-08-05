import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Globals } from '../../../../globals';
import { WorldService } from '../../../../services/world.service';
import { IntelSourceDialog } from '../../../../shared/dialogs/intel-source/intel-source.component';
import { NewIndexDialog } from '../../../../shared/dialogs/new-index/new-index.component';
import { JwtService } from '../../../services/jwt.service';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-intel',
  templateUrl: './intel.component.html',
  styleUrls: ['./intel.component.scss'],
  providers: [ProfileService, WorldService],
  host: {
    class: 'container-fluid gap-5 d-flex flex-column pb-5'
  }
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
          // TODO: if error_code is 3003 (invalid JWT) try a refresh or navigate to login if needed

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

  public getAttackTooltipText(town) {
    if (town.type === 'enemy_attack') {
      return 'Enemy attack';
    }

    return 'Friendly attack'
  }

  public getCountryFromWorld(world: string) {
    const market = world.substring(0, 2);

    switch (market) {
      case 'en':
        return 'gb';
      default:
        return market;
    }
  }

  paginatorEvent($event) {
    this.pageEvent = $event;
    if (typeof this.pageEvent != 'undefined') {
      this.from = this.pageEvent.pageIndex * this.pageEvent.pageSize;
      this.size = this.pageEvent.pageSize;
    }
    this.loadUserIntel();
  }

  openShareInfoDialog(town) {
    if ('shared_via_indexes' in town) {
      let shared_list = town.shared_via_indexes || '';
      let indexes = shared_list.split(', ')
      if (shared_list.length > 0 && indexes.length > 0) {
        let dialogRef = this.dialog.open(IntelSourceDialog, {
          width: '70%',
          autoFocus: false,
          disableClose: false,
          data: {
            intel: town,
            index_list: indexes,
            intel_type: 'outgoing'
          }
        });
      }
    }
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
