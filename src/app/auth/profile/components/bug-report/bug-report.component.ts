import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RecaptchaComponent} from 'ng-recaptcha';
import {environment} from '../../../../../environments/environment';
import {CaptchaService} from '../../../../services/captcha.service';
import {MessageService} from '../../../../services/message.service';
import {Platform} from '@angular/cdk/platform';
import {JwtService} from '../../../services/jwt.service';

@Component({
  selector: 'app-bug-report',
  templateUrl: './bug-report.component.html',
  styleUrls: ['./bug-report.component.scss'],
  providers: [CaptchaService, MessageService]
})
export class BugReportComponent {
  @ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;

  bug_report = '';
  submitted = false;
  loading = false;
  copied = false;
  error = '';
  captcha = '';
  recaptcha_key = environment.recaptcha;
  files : any = null;

  constructor(
    public captchaService : CaptchaService,
    private platform : Platform,
    private authService : JwtService,
    private messageService : MessageService) {
  }

  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
    this.sendContactMessage();
  }

  public sendContactMessage() {
    if (this.bug_report == '' && !this.files) {
      this.error = 'Please describe the issue or upload an image';
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
      return;
    }

    if (this.files && this.files.length > 10) {
      this.error = 'You can upload at most 10 files';
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
      return;
    }

    if (this.bug_report.indexOf('[report]') === 0 || this.bug_report.indexOf('/report hash') === 0) {
      this.error = 'This form is not meant to upload reports. Use the \'index +\' button (GrepoData userscript required) to index reports';
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
      return;
    }

    let report = this.bug_report;
    try {
      if (this.platform) {
        let platform = {
          Android: this.platform.ANDROID,
          iOS: this.platform.IOS,
          Firefox: this.platform.FIREFOX,
          Blink: this.platform.BLINK,
          Webkit: this.platform.WEBKIT,
          Trident: this.platform.TRIDENT,
          Edge: this.platform.EDGE,
          Safari: this.platform.SAFARI
        }
        report += ' ' + JSON.stringify(platform);
      }
    } catch (e) {}

    this.loading = true;

    this.authService.accessToken().then(access_token => {
      this.messageService.sendMessage(report, access_token, 'bug_report', this.captcha, this.files).subscribe(
        (response) => {
          this.submitted = true;
          this.loading = false;
          if (this.captchaRef != undefined) { this.captchaRef.reset(); }
        },
        (error) => {
          this.error = 'Invalid captcha response. Please try again later.';
          this.loading = false;
          if (this.captchaRef != undefined) { this.captchaRef.reset(); }
        }
      );
    });

  }

  onFileChanged(file) {
    this.files = file.target.files;
  }

}
