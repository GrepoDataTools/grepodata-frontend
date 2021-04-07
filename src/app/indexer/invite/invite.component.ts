import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IndexAuthService} from '../../auth/services/index.service';
import {JwtService} from '../../auth/services/jwt.service';
import {IndexerService} from '../indexer.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
  providers: [IndexAuthService]
})
export class InviteComponent implements OnInit {

  invite_link : string = '';
  index_key : string = '';
  v1_redirect : boolean = false;
  invalid_link : boolean = false;
  expired : boolean = false;
  query_params : any = {};

  verification_loading = true;
  error : string = '';
  logged_in : boolean = false;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private authService: JwtService,
    private indexAuthService: IndexAuthService,
  ) {
    this.verification_loading = true;
    this.route.params.subscribe( params => this.load(params));
  }

  ngOnInit(): void {
  }

  load(params) {
    this.query_params = params;
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

    this.authService.accessToken().then(access_token => {
      console.log('found local access_token');
      this.logged_in = true;
      this.verifyInviteLink(access_token);
    }).catch(rejected => {
      this.verification_loading = false;
      this.logged_in = false;
    });
  }

  /**
   * Once an access_token is available, call backend to check status of invite link
   * @param access_token
   */
  verifyInviteLink(access_token) {
    this.indexAuthService.verifyInviteLink(access_token, this.invite_link).subscribe(
      (response) => this.handleInviteResponse(response, access_token),
      (error) => this.handleInviteResponse(error, access_token));
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
      this.redirect();
    } else {
      this.error = '<h2>Sorry, we are unable to verify this invite</h2><h4>Please try again later or contact us if this error persists</h4>';
      if (response.error_code && response.error_code === 3008) {
        // Generic invalid invite link
        this.error = '<h2>Invalid invite link</h2><h4>Please ask the owner of the index for a new invite link.</h4>';
      } else if (response.error_code && response.error_code === 7101) {
        // No index found for this key (?)
        if (this.v1_redirect) {
          this.error = '<h2>Unable to find this index</h2><h4>Please try again later or contact us if this error persits.</h4>';
        } else {
          this.error = '<h2>Invalid invite link</h2><h4>Please ask the owner of the index for a new invite link.</h4>';
        }
      } else if (response.error_code && response.error_code === 3009) {
        // Expired invite link
        this.error = '<h2>Sorry, this invite link has expired</h2><h4>Please ask the owner of the index for a new invite link.</h4>';
      } else if (response.error_code && response.error_code === 7601) {
        // V1 key joining is disabled
        this.error = '<h2>Sorry, the owner of this index has disabled backwards compatible redirects</h2>' +
          '<h4>Please ask the owner of this index for an invite link to get access to the index.</h4>';
      }

      // this.router.navigate(['/profile']);
    }
    this.verification_loading = false;
  }

  /**
   * When a user registers or signs in, this callback will be called with the new access token
   * @param access_token
   */
  loginCallback(access_token) {
    console.log("logged in callback");
    this.logged_in = true;
    this.verifyInviteLink(access_token);
  }

  /**
   * Once the invite is verified, the user is redirected
   */
  redirect() {
    if (this.v1_redirect && this.query_params.type && this.query_params.world && this.query_params.id) {
      this.router.navigate(['/intel/'+this.query_params.type+'/'+this.query_params.world+'/'+this.query_params.id]);
    } else {
      // Direct to index overview
      this.router.navigate(['/profile/overview/'+this.index_key]);
    }
  }
}
