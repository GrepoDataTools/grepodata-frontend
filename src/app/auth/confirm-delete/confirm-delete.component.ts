import {Component, OnInit, ViewChild} from '@angular/core';
import {environment} from '../../../environments/environment';
import {FormGroup} from '@angular/forms';
import {RecaptchaComponent} from 'ng-recaptcha';
import {ActivatedRoute, Router} from '@angular/router';
import {JwtService} from '../services/jwt.service';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss']
})
export class ConfirmDeleteComponent implements OnInit {

  @ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;

  environment = environment;
  submitted = false;
  loading = false;
  success = false;
  captcha = '';
  error = '';
  token = '';
  recaptcha_key = environment.recaptcha;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService : JwtService) {

    // Check if user is logged in
    this.authService.accessToken().then(access_token => {});

    this.route.params.subscribe((params) => {
      if ('token' in params) {
        this.token = params.token
      } else {
        this.router.navigate(['/indexer']);
      }
    });

  }

  ngOnInit(): void {
  }
  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
    this.sendRequest();
  }

  public sendRequest() {
    this.submitted = true;
    if (this.captchaRef != undefined) {
      this.captchaRef.reset();
    }

    this.loading = true;
    this.authService.accessToken().then(access_token => {
      this.authService.deleteAccountConfirm(access_token, this.token, this.captcha != '' ? this.captcha : 'dev').subscribe(
        (response) => {
          // console.log(response);
          this.error = '';
          this.loading = false;
          this.success = true;
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        },
        (error) => {
          console.log(error);
          this.captcha = '';
          this.error = "Unable to remove your account. Please try again later or contact us if this error persists.";

          if ('error_code' in error.error && error.error.error_code == 3006) {
            this.error = 'This link has expired. Please request a new account removal token or contact us if this error persists.';
          } else if (error.error.message != undefined && error.error.message.search('Invalid captcha') != -1) {
            this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
          }

          this.loading = false;
          if (this.captchaRef != undefined) {
            this.captchaRef.reset();
          }
        },
      );
    });

  }

}
