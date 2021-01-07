import { Component, OnInit } from '@angular/core';
import {JwtService} from '../services/jwt.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  submitting = false;
  error = '';
  success = '';

  constructor(
    private authService: JwtService
  ) { }

  ngOnInit(): void {
  }

  sendNewActivationMail() {
    this.submitting = true;
    this.error = '';
    this.success = '';
    this.authService.accessToken().then(access_token => {
      this.authService.newActivationEmail(access_token)
        .subscribe(
          (response) => {
            if (response && 'email_sent' in response && response.email_sent === true) {
              this.success = 'A new email with activation link was sent to ';
              if ('masked' in response && response.masked != false) {
                this.success += '<strong>'+response.masked+'</strong>.';
              } else {
                this.success += 'your email address.';
              }
            } else {
              this.error = 'Unable to request new email. Please try again later or contact us if this error persists.';
            }
            this.submitting = false;
          },
          (error) => {
            this.error = 'Unable to request new email. Please try again later or contact us if this error persists.';
            this.submitting = false;
          }
        );
    });

  }
}
