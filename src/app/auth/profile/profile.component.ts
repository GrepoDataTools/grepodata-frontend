import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { JwtService } from '../services/jwt.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IndexList, ProfileService } from '../services/profile.service';
import { EditOwnersDialog } from '../../indexer/indexer.component';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import * as jwt_decode from 'jwt-decode';
import { MediaMatcher } from '@angular/cdk/layout';
import {BasicDialog} from '../../shared/dialogs/basic/basic.component';
import {ContactDialog} from '../../header/header.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [ProfileService],
})
export class ProfileComponent implements OnInit, OnDestroy {
  logged_in = false;
  account_confirmed = false;
  account_linked = false;
  collapsed = false;
  active_tab = 'intel';

  username = '';
  active_index = '';
  active_world = '';
  active_id = '';
  mobileQuery: MediaQueryList;

  private readonly _mediaQueryListener: () => void;

  constructor(
    private authService: JwtService,
    private profileService: ProfileService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private location: Location,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mediaQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', () => this._mediaQueryListener());
    if (this.authService.refreshToken == null) {
      this.logout();
    } else {
      this.authService.accessToken().then(access_token => {
        this.route.params.subscribe((params) => this.load(params));
      });
    }

  }

  ngOnInit() {}

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', () => this._mediaQueryListener());
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  load(response) {
    if (response.hasOwnProperty('activetab')) {
      this.active_tab = response.activetab;
      // if (this.active_tab == 'overview') {
      //
      // }
    }
    if (response.hasOwnProperty('key')) {
      this.active_index = response.key;
      if (this.active_index == '0') {
        this.active_tab = 'indexes'
      }
    }
    if (response.hasOwnProperty('world')) {
      this.active_world = response.world;
    }
    if (response.hasOwnProperty('id')) {
      this.active_id = response.id;
    }

    this.loadProfile();
  }

  loadProfile() {
    this.authService.accessToken().then(access_token => {
      let payload = jwt_decode(access_token);
      if (payload.hasOwnProperty('mail_is_confirmed')) {
        if (payload.mail_is_confirmed === true) {
          this.account_confirmed = true;
        }
      }
      if (payload.hasOwnProperty('account_is_linked')) {
        if (payload.account_is_linked === true) {
          this.account_linked = true;
        }
      }

      if (!this.account_confirmed || !this.account_linked) {
        // check again
        console.log('verifying account status');
        this.authService.verifyToken(access_token).subscribe((response) => {
          let refresh = false;
          if (response.hasOwnProperty('mail_is_confirmed') && response.mail_is_confirmed === true) {
            this.account_confirmed = true;
            refresh = true;
          }
          if (response.hasOwnProperty('account_is_linked') && response.account_is_linked === true) {
            this.account_linked = true;
            refresh = true;
          }

          if (refresh) {
            this.authService.refreshAccessToken().subscribe((res) => {});
          }
        });
      }

      if (payload.hasOwnProperty('username')) {
        this.username = payload.username;
      }
      this.logged_in = true;
    });
  }

  showContactDialog() {
    let dialogRef = this.dialog.open(ContactDialog, {
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  changeTab(tab) {
    this.active_tab = tab;
    this.location.replaceState('/profile/' + tab);
  }

  editOwners(key, world, owners) {
    let dialogRef = this.dialog.open(EditOwnersDialog, {
      // width: '600px',
      // height: '80%',
      autoFocus: false,
      data: {
        key: key,
        world: world,
        owners: owners,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
