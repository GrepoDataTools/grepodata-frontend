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
  v1_redirect : boolean = false;
  invalid_link : boolean = false;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private authService: JwtService,
    private indexAuthService: IndexAuthService,
  ) {
    this.route.params.subscribe( params => this.load(params));
  }

  ngOnInit(): void {
  }

  load(params) {
    this.invite_link = params.invite_link;
    if (this.invite_link.length == 8) {
      // V1 redirect
      this.v1_redirect = true;
    } else if (this.invite_link.length == 18) {
      this.v1_redirect = false;
    } else {
      // Invalid invite link
      this.invalid_link = true;
    }
    this.verifyInviteLink();
  }

  verifyInviteLink() {
    this.authService.accessToken().then(access_token => {
      this.indexAuthService.verifyInviteLink(access_token, this.invite_link).subscribe(
        (response) => this.verifyResponse(response),
        (error) => {
          this.router.navigate(['/profile/indexes']);
        });
    });
  }

  verifyResponse(response) {
    console.log(response);
  }

}
