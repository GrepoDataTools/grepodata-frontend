import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {WorldService} from '../../services/world.service';
import {LocalCacheService} from '../../services/local-cache.service';
import {IndexerService} from '../indexer.service';
import {JwtService} from '../../auth/services/jwt.service';
import {Globals} from '../../globals';
import {BBDialog} from '../utils';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ContactDialog} from '../../header/header.component';
import {IndexSettingsDialog} from '../../shared/dialogs/index-settings/index-settings.component';
import {ShareIndexDialog} from '../../shared/dialogs/share-index/share-index.component';
import {IndexMembersDialog} from '../../shared/dialogs/index-members/index-members.component';
import {SiegeListDialog} from '../siege/siege.service';
import {MediaMatcher} from '@angular/cdk/layout';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  providers: [IndexerService, LocalCacheService, WorldService],
})
export class OverviewComponent implements OnInit, OnDestroy, OnInit {
  paramsSubscription : Subscription;

  copied = false;
  editting_name = false;
  committing_prev_intel = false;
  committing_error = '';
  commit_complete = false;
  saving_name = false;
  saving_error = '';
  name_saved = false;
  world = '';
  index_name = '';
  index_name_edit = '';
  key = '';
  data: any = '';
  error = '';
  errorEvents = '';
  loading = true;
  loadingEvents = true;
  clicked = false;
  is_admin = false;
  role = '';
  contribute = false;
  contributors = false;
  world_stopped = false;
  missing_v1_owner = false;
  has_uncommitted_intel = 0;
  share_link = '';
  delete_days = '';
  allow_join_v1_key = '';
  index_version = '2';
  latest_intel: any = [];
  recent_conquests: any = [];
  events: any = [];
  update: any = '';

  mobileQuery: MediaQueryList;
  private readonly _mediaQueryListener: () => void;

  constructor(
    private globals: Globals,
    private indexerService: IndexerService,
    public router: Router,
    private route: ActivatedRoute,
    private authService: JwtService,
    public dialog: MatDialog,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.paramsSubscription = this.route.params.subscribe( params => {
      if ('activetab' in params && params.activetab == 'team') {
        console.log('Construct team component: ', params);
        this.load(params);
      }
    });

    this.mobileQuery = media.matchMedia('(min-width: 1400px)');
    this._mediaQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', () => this._mediaQueryListener());
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    console.log('destroy team component');
    this.paramsSubscription.unsubscribe();
  }

  private load(params) {
    this.loading = true;
    this.loadingEvents = true;
    this.world = '';
    this.key = '';
    this.error = '';
    this.events = [];
    this.latest_intel = [];
    this.recent_conquests = [];
    this.contributors = false;
    this.committing_prev_intel = false;
    this.commit_complete = false;
    this.committing_error = '';
    this.has_uncommitted_intel = 0;
    if (typeof params['key'] != 'undefined' && params['key'].length == 8) {
      this.key = params['key'];
      this.index_name = this.key;
      this.index_name_edit = this.key;
      this.authService.accessToken().then(access_token => {
        this.indexerService.getIndex(access_token, this.key).subscribe(
          (response) => this.loadIndex(response),
          (error) => this.loadIndex(null)
        );
      });
    } else {
      this.loading = false;
    }
  }

  public refresh(): void {
    window.location.reload();
  }

  public showContactDialog(): void {
    let dialogRef = this.dialog.open(ContactDialog, {
      // width: '600px',
      // height: '90%'
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  copyLink() {
    navigator.clipboard.writeText(`https://grepodata.com/invite/${this.key}${this.share_link}`).then(() => {});
    this.copied = true;
    window.setTimeout(()=>{this.copied = false;}, 6000);
  }

  private loadIndex(data) {
    console.log(data);
    if (!data) {
      this.error = '<h2>Sorry, we were unable to load this team overview</h2><h4>Please try again later or contact us if this error persists.</h4>';
    } else if (data && 'error_code' in data) {
      if (data.error_code == 7101) {
        // not a valid index
        this.error = '<h2>This is not a valid team</h2><h4>Team not found. Please try again later or contact us if this error persists.</h4>';
      } else if (data.error_code == 7504) {
        // no read access to this index
        this.error = '<h2>Access to team denied</h2><h4>You no longer have access to this team. This can happen if the team admin removes you or if you leave the team. If you think this is incorrect, please ask the team admin to get access.</h4>';
      } else {
        this.error = '<h2>Sorry, we were unable to load this team overview</h2><h4>Please try again later or contact us if this error persists.</h4>';
      }
    } else {
      this.globals.set_active_intel(data.world);
      this.is_admin = data.is_admin;
      this.share_link = data.share_link || '';
      this.delete_days = data.num_days || 0;
      this.world_stopped = 'world_stopped' in data && data.world_stopped == true;
      this.allow_join_v1_key = data.allow_join_v1_key;
      this.index_version = data.index_version || '2';
      this.role = data.role || 'read';
      this.contribute = data.contribute===1;
      this.world = data.world;
      this.index_name = data.index_name;
      this.index_name_edit = data.index_name;
      this.data = data;
      if (data.latest_intel) {
        this.latest_intel = data.latest_intel;
      }
      if (data.recent_conquests) {
        this.recent_conquests = data.recent_conquests;
      }
      if (data.contributors_actual) {
        this.contributors = data.contributors_actual;
      }
      if (data.uncommitted_reports && data.uncommitted_reports > 0 && data.uncommitted_status != 'ignore') {
        this.has_uncommitted_intel = data.uncommitted_reports;
        if (data.uncommitted_status == 'processing') {
          this.committing_prev_intel = true;
        }
      }
      if (data.uncommitted_status && data.uncommitted_status == 'success') {
        this.commit_complete = true;
      }
      if ('has_v2_owner' in data && 'index_version' in data) {
        if (data.has_v2_owner === false && data.index_version === '1') {
          this.missing_v1_owner = true;
        }
      }
    }

    this.loading = false;
  }

  public loadSiegeListDialog(): void {
    let dialogRef = this.dialog.open(SiegeListDialog, {
      autoFocus: false,
      data: {
        key: this.key,
        world: this.world,
        index_name: this.index_name
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  public openBBdialog(type) {
    let dataBB = {
      data: {},
      key: this.key,
      world: this.world
    };
    if (type == 'players_indexed') {
      dataBB.data = this.data['players_indexed']
    } else if (type == 'alliances_indexed') {
      dataBB.data = this.data['alliances_indexed']
    } else {
      return false;
    }

    let dialogRef = this.dialog.open(BBDialog, {
      // width: '90%',
      // height: '80%',
      autoFocus: false,
      data: {
        dataBB: dataBB,
        type: type
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  showSettingsDialog() {
    let dialogRef = this.dialog.open(IndexSettingsDialog, {
      minWidth: '60%',
      // height: '90%'
      autoFocus: false,
      disableClose: false,
      data: {
        index: {
          key: this.key,
          name: this.index_name,
          world: this.world,
          share_link: this.share_link,
          allow_join_v1_key: this.allow_join_v1_key,
          index_version: this.index_version,
          num_days: this.delete_days,
          role: this.role
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.load({key: this.key});
    });
  }

  doEditName() {
    if (this.is_admin) {
      this.editting_name=true;
    }
  }

  saveIndexName() {
    this.editting_name = false;
    this.index_name = this.index_name_edit;
    this.saving_name = true;
    this.saving_error = '';

    this.authService.accessToken().then(access_token => {
      this.indexerService.updateTeamName(access_token, this.key, this.index_name_edit).subscribe(
        (response) => {
          if (!!response['success']) {
            this.name_saved = true;
            setTimeout(_ => {this.name_saved = false;}, 4000);
          } else {
            this.saving_error = 'Unable to update name. Try again later';
          }
          this.saving_name = false;
          },
        (error) => {
          this.saving_error = 'Unable to update name. Try again later';
          this.saving_name = false;
        }
      );
    });
  }

  commitPrevIntel(action) {
    this.committing_prev_intel = true;
    this.commit_complete = false;
    this.committing_error = '';

    this.authService.accessToken().then(access_token => {
      this.indexerService.commitPrevIntel(access_token, this.key, action).subscribe(
        (response) => {
          if (response.error_code && (response.error_code === 2020 || response.error_code === 1300 || response.error_code === 7503)) {
            // index does not exist or request is already processing or user can not write
            this.committing_error = 'Error: ' + response.message;
          } else if (response.has_error && response.has_error === true) {
            this.committing_error = 'We ran into an error while processing your import. Please try again later or contact us if this error persists.';
          } else if (response.success_code && response.success_code === 1000) {
            // Ignore
            this.has_uncommitted_intel = 0;
          } else if (response.success_code && response.success_code === 1410) {
            this.commit_complete = true;
          } else {
            this.committing_error = 'Unknown error. Please try again later or contact us if this error persists.';
          }
          this.committing_prev_intel = false;
        },
        (error) => {
          this.committing_error = 'Unable to import. Try again later or contact us if this error persists';
          this.committing_prev_intel = false;
        }
      );
    });
  }

  showShareDialog() {
    let dialogRef = this.dialog.open(ShareIndexDialog, {
      minWidth: '60%',
      // height: '90%'
      autoFocus: false,
      disableClose: false,
      data: {
        index: {
          key: this.key,
          name: this.index_name,
          world: this.world,
          share_link: this.share_link,
          role: this.role
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.load({key: this.key});
    });
  }

  showMembersDialog() {
    let dialogRef = this.dialog.open(IndexMembersDialog, {
      minWidth: '60%',
      // height: '90%'
      autoFocus: false,
      disableClose: false,
      data: {
        index: {
          key: this.key,
          name: this.index_name,
          world: this.world,
          share_link: this.share_link,
          role: this.role
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.load({key: this.key});
      this.update = new Date();
    });
  }

}
