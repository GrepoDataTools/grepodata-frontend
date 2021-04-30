import {ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {IndexList, ProfileService} from '../../../services/profile.service';
import {JwtService} from '../../../services/jwt.service';
import {Router} from '@angular/router';
import {WorldService} from '../../../../services/world.service';
import {IndexerService} from '../../../../indexer/indexer.service';
import {CaptchaService} from '../../../../services/captcha.service';
import {environment} from '../../../../../environments/environment';
import {RecaptchaComponent} from 'ng-recaptcha';
import {NewIndexDialog} from '../../../../shared/dialogs/new-index/new-index.component';
import {MatDialog} from '@angular/material/dialog';
import {IndexSettingsDialog} from '../../../../shared/dialogs/index-settings/index-settings.component';
import {IndexMembersDialog} from '../../../../shared/dialogs/index-members/index-members.component';
import {ShareIndexDialog} from '../../../../shared/dialogs/share-index/share-index.component';
import {IndexAuthService} from '../../../services/index.service';
import {ImportIndexDialog} from '../../../../shared/dialogs/import-index/import-index.component';
import {Globals} from '../../../../globals';
import {BasicDialog} from '../../../../shared/dialogs/basic/basic.component';
import {MediaMatcher} from '@angular/cdk/layout';
import {Sort} from '@angular/material/sort';

@Component({
  selector: 'app-indexes',
  templateUrl: './indexes.component.html',
  styleUrls: ['./indexes.component.scss'],
  providers: [IndexerService, WorldService, CaptchaService, IndexAuthService],
  encapsulation: ViewEncapsulation.None
})
export class IndexesComponent implements OnInit {
  @ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;

  indexes: IndexList[] = [];
  loading = false;
  confirmed = true;
  error = '';
  leave_error = '';
  created_index = '';
  contribute_success = '';
  leave_success = '';

  readonly ROLE_ADMIN = environment.ROLE_ADMIN;
  readonly ROLE_OWNER = environment.ROLE_OWNER;

  mobileQuery: MediaQueryList;
  private readonly _mediaQueryListener: () => void;

  active_sort : any = null;
  filter_index_name : any = '';
  filter_index_owners : any = '';
  filter_world : any = '';
  filter_role : any = '';

  constructor(
    private globals: Globals,
    private authService: JwtService,
    private profileService: ProfileService,
    private router: Router,
    private dialog: MatDialog,
    private indexAuthService: IndexAuthService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mediaQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', () => {
      this._mediaQueryListener();
      console.log('mobile query matches: ', this.mobileQuery.matches);
    });
  }

  goToOverview(index_key) {
    this.routing(`/profile/team/${index_key}`)
  }

  ngOnInit() {
    this.loadIndexes();

  }

  public routing(url) {
    this.router.navigate([url]);
  }

  public newIndex() {
    let dialogRef = this.dialog.open(NewIndexDialog, {
      // width: '80%',
      // height: '90%'
      autoFocus: false,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadIndexes(true);
      if (result) {
        this.error = '';
        this.contribute_success = '';
        this.created_index = result;
      }
    });
  }

  public importV1Index() {
    let dialogRef = this.dialog.open(ImportIndexDialog, {
      // width: '80%',
      // height: '90%'
      autoFocus: false,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadIndexes(true);
      if (result) {
        this.error = '';
        this.contribute_success = '';
        this.created_index = result;
      }
    });
  }

  public openIndexSettings(index) {
    let dialogRef = this.dialog.open(IndexSettingsDialog, {
      // width: '80%',
      // height: '90%'
      autoFocus: false,
      disableClose: false,
      data: {
        index: index
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadIndexes(true);
    });
  }

  public openIndexMembers(index) {
    let dialogRef = this.dialog.open(IndexMembersDialog, {
      minWidth: '50%',
      // height: '90%'
      autoFocus: false,
      disableClose: false,
      data: {
        index: index
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadIndexes();
    });
  }

  public openShareIndexDialog(index) {
    let dialogRef = this.dialog.open(ShareIndexDialog, {
      // width: '80%',
      // height: '90%'
      autoFocus: false,
      disableClose: false,
      data: {
        index: index
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadIndexes();
    });
  }

  loadIndexes(force_refresh=false) {
    let localIndexes = this.getIndexListFromCache();
    if (!force_refresh && localIndexes) {
      console.log('using local index list');
      this.indexes = localIndexes;
    } else if (force_refresh) {
      this.deleteIndexListFromCache();
    }

    this.error = '';
    this.contribute_success = '';
    this.loading = !force_refresh && !localIndexes;
    this.authService.accessToken().then(access_token => {
      this.profileService.getIndexes(access_token, 0, true).subscribe(
        (response) => {
          console.log(response);
          this.indexes = response.items;
          this.saveIndexListToCache(this.indexes);
          this.loading = false;
          if (this.active_sort!=null) {
            this.sortData(this.active_sort);
          }
        },
        (error) => {
          console.log(error);
          if (error.status === 401) {
            console.log('Redirecting to login');
            this.authService.logout();
          } else if ('error_code' in error.error && error.error.error_code == 3010) {
            console.error(error.error);
            this.confirmed = false;
          } else {
            console.error(error.error);
            this.error = 'Unable to load your teams. Please try again later or contact us if this error persists.';
          }

          this.loading = false;
        },
      );
    });
  }

  enableContributions(index) {
    this.error = '';
    this.contribute_success = '';
    this.loading = true;
    this.created_index = '';
    this.authService.accessToken().then(access_token => {
      this.indexAuthService.toggleIndexContribute(access_token, index.key, !index.contribute).subscribe(
        (response) => {
          if ('success_code' in response && response.success_code == 1000) {
            let new_status = response.data.contribute;
            if (new_status==false) {
              this.contribute_success = 'The reports you index will no longer be shared with team <strong>' + index.name + '</strong>';
            } else {
              this.contribute_success = 'The reports you index will now be shared with team <strong>' + index.name + '</strong>';
            }
            this.contribute_success = '<h5>' + this.contribute_success + '</h5>';
            index.contribute = new_status;
            this.indexes = this.indexes.map(indexm => {
              return indexm.key === index.key ? index : indexm
            });
            this.saveIndexListToCache(this.indexes);
          } else {
            this.error = 'Unable to update contribution settings. Please try again later or contact us if this error persists.';
          }
          this.loading = false;
        },
        (error) => {
          console.log(error);
          this.error = 'Unable to update contribution settings. Please try again later or contact us if this error persists.';
          this.loading = false;
        },
      );
    });
  }


  public showLeaveDialog(index): void {
    const dialogRef = this.dialog.open(BasicDialog, {
      // minWidth: '40%',
      autoFocus: false,
      data: {
        title: '',
        show_close: false,
        messageHtml: '<div class="text-center"><h3>Are you sure you want to leave team <span class="gd-primary">' + index.name + '</span>?</h3><p>You will have to be invited to join the team again.</p></div>',
        cancel_action: 'Cancel',
        action_type: 'danger',
        action: 'Leave team',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

      if (result === true) {
        this.loading = true;
        this.leave_error = '';
        this.leave_success = '';
        this.authService.accessToken().then(access_token => {
          this.indexAuthService.leaveIndex(access_token, index.key)
            .subscribe(
              (response) => {
                console.log(response);
                if (response && 'success_code' in response && response.success_code === 1500) {
                  // left successfully
                  this.leave_success = '<h4>You are no longer a member of team <span class="gd-primary">'+index.name+'</span>. Your intel will no longer be shared with this team. </h4>';

                  this.indexes = this.indexes.filter(i => i.key != index.key);

                  this.loadIndexes(true);

                  this.globals.showSnackbar(
                    `<h4>You are no longer a member of team <span class="gd-primary">${index.name}</span></h4>`,
                    'success', '', false,10000);

                } else if (response && 'error_code' in response && response.error_code === 7610) {
                  // User cant leave because they are the only owner and there are still other members
                  this.leave_error = '<h5>You are the only remaining owner of this team and there are still other non-owner members in the team. ' +
                    'You can only leave once there are no other members or if there is another owner in the team. <br/>' +
                    '<strong>Make somebody else owner of the team or remove all users from the team in order for you to leave the team.</strong><h5>'
                } else {
                  this.leave_error = '<h5>Sorry, we are unable to process that request right now. Please try again later or contact us if this problem persists.</h5>'
                }
                this.loading = false;
                this.scrollToTop();
              },
              (error) => {
                console.log(error);
                this.loading = false;
                this.leave_error = '<h5>Sorry, we are unable to process that request right now. Please try again later or contact us if this problem persists.</h5>';
                this.scrollToTop();
              }
            );
        });
      }

    });
  }

  leaveIndex(index) {
    this.showLeaveDialog(index);
  }

  saveIndexListToCache(data) {
    this.globals.set_all_indexes(data, 60 * 24 * 7)
  }

  getIndexListFromCache() {
    return this.globals.get_all_indexes()
  }

  deleteIndexListFromCache() {
    return this.globals.delete_all_indexes()
  }

  scrollToTop() {
    document.querySelector('.page-wrapper').scrollIntoView();
  }

  sortData(sort: Sort) {
    console.log(sort);
    if (!sort.active || sort.direction === '') {
      this.indexes = this.getIndexListFromCache();
      return;
    }
    this.active_sort = sort;
    this.indexes = this.indexes.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          if (a.world_stopped == b.world_stopped) {
            return this.compare(a.name, b.name, isAsc);
          } else {
            return this.compare(a.world_stopped, b.world_stopped, true);
          }
        case 'world':
          if (a.world_stopped == b.world_stopped) {
            return this.compare(a.world, b.world, isAsc);
          } else {
            return this.compare(a.world_stopped, b.world_stopped, true);
          }
        case 'reports':
          let reportsA = a.stats.total_reports >= 0 ? a.stats.total_reports : -1;
          let reportsB = b.stats.total_reports >= 0 ? b.stats.total_reports : -1;
          if (a.world_stopped == b.world_stopped) {
            return this.compare(reportsA, reportsB, isAsc);
          } else {
            return this.compare(a.world_stopped, b.world_stopped, true);
          }
        case 'role':
          if (a.world_stopped == b.world_stopped) {
            return this.compare(a.role, b.role, isAsc);
          } else {
            return this.compare(a.world_stopped, b.world_stopped, true);
          }
        default: return 0;
      }
    })
  }

  compare(a: number | string | boolean, b: number | string | boolean, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  hasOwnerFilter(index) {
    if (!this.filter_index_owners || !index || !('stats' in index) || !('owners' in index.stats) || index.stats.owners.length <= 0) {
      return false;
    }
    let matched_owners = index.stats.owners.filter(i => {
      if (!i || !('alliance_name' in i) || !i.alliance_name) {
        return false;
      }
      return i.alliance_name.toLowerCase().includes(this.filter_index_owners.toLowerCase())
    });
    return matched_owners.length > 0
  }

  uniqueWorlds() {
    return [...new Set(this.indexes.map(item => item.world))];
  }
}
