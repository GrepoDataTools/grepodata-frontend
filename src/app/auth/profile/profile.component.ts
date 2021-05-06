import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { JwtService } from '../services/jwt.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import * as jwt_decode from 'jwt-decode';
import { MediaMatcher } from '@angular/cdk/layout';
import {ContactDialog} from '../../header/header.component';
import {BasicDialog} from '../../shared/dialogs/basic/basic.component';
import {MatSidenav} from '@angular/material/sidenav';
import {SidenavService} from '../../layout/sidebar/sidenav-service';
import {IndexAuthService} from '../services/index.service';
import {Globals} from '../../globals';
import {DisclaimerDialog} from '../../footer/footer.component';
import {NewIndexDialog} from '../../shared/dialogs/new-index/new-index.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [ProfileService, IndexAuthService, JwtService],
})
export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  date = new Date();
  logged_in = false;
  account_confirmed = false;
  account_linked = false;
  collapsed = false;
  active_tab = '';

  username = '';
  active_index = '';
  active_world = '';
  active_id = '';
  mobileQuery: MediaQueryList;

  private readonly _mediaQueryListener: () => void;

  @ViewChild('snav') public snav: MatSidenav;

  constructor(
    private authService: JwtService,
    private indexerAuthService: IndexAuthService,
    private profileService: ProfileService,
    private sidenavService: SidenavService,
    private router: Router,
    private globals: Globals,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private location: Location,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mediaQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', () => {
      this._mediaQueryListener();
      if (this.mobileQuery.matches) {
        this.sidenavService.open();
      }
    });

    if (this.authService.refreshToken == null) {
      this.logout();
    } else {
      this.authService.accessToken().then(access_token => {
        // Implicit v1 migration
        this.indexerAuthService.implicitV1Migration(access_token);

        this.route.params.subscribe((params) => this.load(params));
      });
    }

    this.checkTokenStatus();
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.snav);
  }

  ngOnInit() { }

  checkTokenStatus() {
    this.route.queryParams.subscribe((params) => {
      if ('token' in params) {
        this.showTokenMessage(params.token)
      }
      if ('action' in params) {
        switch (params.action) {
          case 'new_team':
            let dialogRef = this.dialog.open(NewIndexDialog, {
              autoFocus: false,
              disableClose: true,
              data: {
                world: params.world || null,
                closeOnNavigation: false
              }
            });
            dialogRef.afterClosed().subscribe(result => {});
        }
      }
    });
  }

  showTokenMessage(token_status) {
    switch (token_status) {
      case 'confirmed':
        this.newBasicDialog(
          '<span class="gd-primary">Your email address was confirmed successfully!</span>',
          '<h4>You can now create or join a team to share your enemy intelligence with your allies.</h4>');
        break;
      case 'failed':
        this.newBasicDialog(
          '<span class="gd-error">Unable to verify your email address.</span>',
          '<h4>Sorry, we were unable to verify your email activation link.<br/>Please try again later or contact us if this error persists.</h4>');
        break;
      case 'invalid':
        this.newBasicDialog(
          '<span class="gd-error">Unable to verify your email address.</span>',
          '<h4>The activation link you tried to use has expired, please request a new activation email.</h4>');
        break;
      default:
        console.error("Uncaught token status: " + token_status);
    }
    this.location.replaceState('/profile');
  }

  newBasicDialog(title, content) {
    const dialogRef = this.dialog.open(BasicDialog, {
      autoFocus: false,
      data: {
        title: title,
        messageHtml: content,
        closeOnNavigation: false
      }
    });
  }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', () => this._mediaQueryListener());
  }

  logout() {
    this.authService.logout();
  }

  load(response) {
    if (response.hasOwnProperty('activetab')) {
      this.active_tab = response.activetab;
    }
    if (response.hasOwnProperty('key')) {
      this.active_index = response.key;
      if (this.active_index == '0') {
        this.active_tab = 'teams'
      }
    }
    if (response.hasOwnProperty('world')) {
      this.active_world = response.world;
    }
    if (response.hasOwnProperty('id')) {
      this.active_id = response.id;
    }
    if (!this.active_tab || this.active_tab == '') {
      this.active_tab = 'intel';
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
      // if (payload.hasOwnProperty('account_is_linked')) {
      //   if (payload.account_is_linked === true) {
      //     this.account_linked = true;
      //   }
      // }

      if (!this.account_confirmed) {
        // check again
        console.log('verifying account status');
        this.authService.verifyToken(access_token).subscribe((response) => {
          let refresh = false;
          if (response.hasOwnProperty('mail_is_confirmed') && response.mail_is_confirmed === true) {
            this.account_confirmed = true;
            refresh = true;

            this.globals.showSnackbar(
              `<h4>Your email address has been verified. <span class="gd-primary">Thank you for using GrepoData</span></h4>`,
              'success', '', false,20000);
          }
          // if (response.hasOwnProperty('account_is_linked') && response.account_is_linked === true) {
          //   this.account_linked = true;
          //   refresh = true;
          // }

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


  public showDisclaimerDialog(): void {
    let dialogRef = this.dialog.open(DisclaimerDialog, {
      // width: '600px',
      // height: '80%'
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

}
