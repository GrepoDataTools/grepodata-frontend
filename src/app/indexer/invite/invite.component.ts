import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IndexAuthService} from '../../auth/services/index.service';
import {JwtService} from '../../auth/services/jwt.service';
import {IndexerService} from '../indexer.service';
import {Globals} from '../../globals';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {BasicDialog} from '../../shared/dialogs/basic/basic.component';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
  providers: [IndexAuthService]
})
export class InviteComponent implements OnInit {

  invite_link : string = '';
  index_key : string = '';
  v2_scriptlink : boolean = false;
  v1_redirect : boolean = false;
  invalid_link : boolean = false;
  expired : boolean = false;
  query_params : any = {};

  verification_loading = true;
  error : string = '';
  logged_in : boolean = false;
  read_more : boolean = false;

  verifying_invite = false;
  verifying_script = false;

  constructor(
    public router: Router,
    private globals: Globals,
    private dialogRef: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private authService: JwtService,
    private indexAuthService: IndexAuthService,
  ) {
    this.verification_loading = true;
    this.route.params.subscribe( params => this.load(params));
  }

  ngOnInit(): void {
    // this.snackBar.open('Basic snackbar example.', 'Dismiss', {panelClass: 'script-auth-link-error'});
  }

  load(params) {
    this.query_params = params;
    console.log(this.query_params);
    if ('uid' in this.query_params) {
      // V2 script linking
      this.v2_scriptlink = true;
    } else {
      // V2 index invites
      this.invite_link = params.invite_link;
      this.index_key = this.invite_link.substr(0, 8);
      if (this.invite_link.length == 8) {
        // V1 redirect
        this.v1_redirect = true;
      } else if (this.invite_link.length == 18) {
        this.v1_redirect = false;
      } else {
        // Invalid invite link
        this.invalid_link = true;
      }
    }

    this.authService.accessToken(false).then(access_token => {
      console.log('found local access_token', access_token);
      if (access_token == 'refresh_failed' || access_token == '' || access_token == null || !access_token) {
        this.loginRequired();
      } else {
        this.loginCallback(access_token);
      }
    }).catch(rejected => {
      this.loginRequired();
    });
  }

  loginRequired() {
    console.log('login required!');
    this.verification_loading = false;
    this.logged_in = false;

    if (!this.v2_scriptlink && !this.expired && !this.invalid_link) {
      this.globals.showSnackbar(
        `<h4>You have to be logged in to join this team.</h4>`,
        'error', '', true,10000);
    }
  }

  /**
   * Once an access_token is available, call backend to check status of invite link
   * @param access_token
   */
  verifyInviteLink(access_token) {
    this.verifying_invite = true;
    this.indexAuthService.verifyInviteLink(access_token, this.invite_link).subscribe(
      (response) => this.handleInviteResponse(response, access_token),
      (error) => this.handleInviteResponse(error, access_token));
  }

  /**
   * Once an access_token is available, call backend to check status of script link
   * @param access_token
   */
  verifyScriptLink(access_token) {
    console.log('script link', this.query_params.uid);
    this.error = '';
    this.verifying_script = true;
    this.authService.enableScriptLink(access_token, this.query_params.uid).subscribe((response) => {
        console.log(response);
        if (response.success_code && response.success_code === 1151) {
          // Script auth complete
          this.userscriptLinkedDialog();
          this.router.navigate(['/profile']);
        } else {
          // script auth failed
          this.error = '<h2>Sorry, we were unable to link your account to the userscript</h2><h4>You can request a new token using the in-game script, try again later or contact us if this error persists.</h4>';
          // this.snackBar.open('Sorry, we were unable to link your account to the userscript. Please request a new token using the in-game script.', 'Dismiss', {panelClass: 'script-auth-link-error'});
        }
        this.verifying_script = false;
        this.verification_loading = false;
      },
      (error) => {
        console.log(error);
        if (error.error.error_code && error.error.error_code === 3041) {
          // 3041 = script token does not exist
          this.error = '<h2>Sorry, your userscript token is <strong>invalid</strong></h2><h4>Request a new token using the in-game script.</h4>';
        } else if (error.error.error_code && error.error.error_code === 3042) {
          // 3042 = expired script token
          this.error = '<h2>Sorry, your userscript token has <strong>expired</strong></h2><h4>Request a new token using the in-game script.</h4>';
        } else if (error.error.error_code && error.error.error_code === 3043) {
          // 3043 = invalid client address
          this.error = '<h2>Sorry, your IP address has changed. <strong>If you use a VPN, you may need to disable it for a moment while you authenticate your userscript.</strong></h2><h4>Request a new token using the in-game script.</h4>';
        } else if (error.error.error_code && error.error.error_code === 3003) {
          // access token is not valid!
          this.authService.logout(false);
          this.error = '';
          this.logged_in = false;
        } else {
          this.error = `
            <h2>Sorry, we were unable to link your account to the userscript</h2>
            <h4>You can request a new token using the in-game script. Please try again later or contact us if this error persists.<br/>When you contact us, add a screenshot of the information below:</h4>
            <pre class="pre-no-css">UNIX ${Date.now()} - ${JSON.stringify(error)}</pre>
        `;
        }
        this.verifying_script = false;
        this.verification_loading = false;
      });
  }

  /**
   * Check if the user gained access to the index and handle accordingly
   * @param response
   * @param access_token
   */
  handleInviteResponse(response, access_token) {
    console.log(response);
    if (response.verified && response.verified === true) {
      // User has access to index!
      if ('is_new_access' in response && response.is_new_access === true) {
        this.globals.showSnackbar(
          `<h4>You have been added to team <span class="gd-primary">${response.index_name}</span></h4>`,
          'success', '', true,300000);
      }
      this.redirect();
    } else {
      this.error = `
            <h2>Sorry, we are unable to verify this invite</h2>
            <h4>Please try again later or contact us if this error persists.<br/>When you contact us, add a screenshot of the information below:</h4>
            <pre class="pre-no-css">UNIX ${Date.now()} - ${JSON.stringify(response)}</pre>
        `;
      if (response.error_code && response.error_code === 3008) {
        // Generic invalid invite link
        this.error = '<h2>Invalid invite link</h2><h4>Please ask the owner of the team for a new invite link</h4>';
      } else if (response.error_code && response.error_code === 7101) {
        // No index found for this key (?)
        if (this.v1_redirect) {
          this.error = '<h2>Unable to find this team</h2><h4>Please try again later or contact us if this error persists</h4>';
        } else {
          this.error = '<h2>Invalid invite link</h2><h4>Please ask the owner of the team for a new invite link</h4>';
        }
      } else if (response.error_code && response.error_code === 3009) {
        // Expired invite link
        this.error = '<h2>Sorry, this invite link has expired</h2><h4>Please ask the owner of the team for a new invite link</h4>';
      } else if (response.error_code && response.error_code === 7601) {
        // V1 key joining is disabled
        this.error = '<h2>Sorry, the owner of this team has disabled backwards compatible redirects</h2>' +
          '<h4>Please ask the owner of this team for an invite link to get access to the team</h4>';
      } else if (
        response.error
        && response.error.error_code
        && (response.error.error_code === 3003 || response.error.error_code === 1010)) {
        // 3003 access token is not valid
        // 1010 bad request (probably empty access token)
        this.authService.logout(false);
        this.error = '';
        this.verification_loading = false;
        this.logged_in = false;

        if (!this.v2_scriptlink && !this.expired && !this.invalid_link) {
          this.globals.showSnackbar(
            `<h4>You have to be logged in to join this team</h4>`,
            'error', '', true,10000);
        }
      }

      // this.router.navigate(['/profile']);
    }
    this.verification_loading = false;
    this.verifying_invite = false;
  }

  /**
   * When a user registers or signs in, this callback will be called with the new access token
   * @param access_token
   */
  loginCallback(access_token) {
    console.log("logged in callback");
    this.logged_in = true;
    if (this.v2_scriptlink) {
      // Verify script token
      this.verifyScriptLink(access_token);
    } else {
      // Verify invite token
      this.verifyInviteLink(access_token);
    }
  }

  /**
   * Once the invite is verified, the user is redirected
   */
  redirect() {
    if (this.v2_scriptlink) {
      // Direct to profile
      this.router.navigate(['/profile']);
    } else if (this.v1_redirect && this.query_params.type && this.query_params.world && this.query_params.id) {
      this.router.navigate(['/intel/'+this.query_params.type+'/'+this.query_params.world+'/'+this.query_params.id]);
    } else {
      // Direct to index overview
      this.router.navigate(['/profile/team/'+this.index_key]);
    }
  }

  userscriptLinkedDialog() {
    const dialogRef = this.dialogRef.open(BasicDialog, {
      minWidth: '50%',
      minHeight: '50%',
      autoFocus: false,
      data: {
        title: '',
        show_close: false,
        messageHtml: '<div class="text-center">' +
          '<div class="gd-txt-icon-container">\n' +
          '  <span class="gd-txt-icon-1">GREPO</span>\n' +
          '  <span class="gd-txt-icon-2">DATA</span>\n' +
          '</div>' +
          '<h2 class="gd-primary">Userscript login complete. Happy indexing!</h2>' +
          '<h4>You can now use the city indexer tool while playing Grepolis.</h4>' +
          '<br/>' +
          '<h5>Thank you for using GrepoData.</h5>' +
          '</div>',
        closeOnNavigation: false
      }
    });
  }
}
