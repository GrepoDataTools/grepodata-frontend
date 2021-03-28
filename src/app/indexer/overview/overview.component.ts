import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  providers: [IndexerService, LocalCacheService, WorldService],
})
export class OverviewComponent implements OnInit {


  world = '';
  index_name = '';
  key = '';
  data: any = '';
  error = '';
  loading = true;
  clicked = false;
  is_admin = false;
  role = '';
  contribute = false;
  share_link = '';
  delete_days = '';
  allow_join_v1_key = '';
  index_version = '2';
  latest_intel: any = [];
  recent_conquests: any = [];

  constructor(
    private globals: Globals,
    private indexerService: IndexerService,
    public router: Router,
    private route: ActivatedRoute,
    private authService: JwtService,
    public dialog: MatDialog) {
    this.route.params.subscribe( params => this.load(params));
  }

  ngOnInit() {
  }

  private load(params) {
    this.loading = true;
    this.world = '';
    this.key = '';
    this.error = '';
    this.latest_intel = [];
    this.recent_conquests = [];
    if (typeof params['key'] != 'undefined' && params['key'].length == 8) {
      this.key = params['key'];
      this.authService.accessToken().then(access_token => {
        this.indexerService.getIndex(access_token, this.key).subscribe(
          (response) => this.loadIndex(response),
          (error) => {
            this.router.navigate(['/profile/indexes']);
          });
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

  private loadIndex(data) {
    console.log(data);
    this.globals.set_active_intel(data.world);
    this.is_admin = data.is_admin || false;
    this.share_link = data.share_link || '';
    this.delete_days = data.num_days || 0;
    this.allow_join_v1_key = data.allow_join_v1_key || false;
    this.index_version = data.index_version || '2';
    this.role = data.role || 'read';
    this.contribute = data.contribute==1 || true;
    this.world = data.world;
    this.index_name = data.index_name;
    this.data = data;
    if (data.latest_intel) {
      this.latest_intel = data.latest_intel;
    }
    if (data.recent_conquests) {
      this.recent_conquests = data.recent_conquests;
    }
    this.loading = false;
  }

  // public loadSiegeListDialog(): void {
  //   let dialogRef = this.dialog.open(SiegeListDialog, {
  //     autoFocus: false,
  //     data: {
  //       key: this.key,
  //       world: this.world
  //     }
  //   });
  //
  //   dialogRef.afterClosed().subscribe(result => {});
  // }

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
    });
  }

}
