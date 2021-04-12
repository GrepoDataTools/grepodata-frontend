import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RecaptchaComponent} from 'ng-recaptcha';
import {environment} from '../../../../../environments/environment';
import {CaptchaService} from '../../../../services/captcha.service';
import {MessageService} from '../../../../services/message.service';

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
    private messageService : MessageService) { }

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

    if (this.files && this.files.length > 5) {
      this.error = 'You can only upload 5 files';
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
      return;
    }

    this.loading = true;
    this.messageService.sendMessage(this.bug_report, '', 'bug_report', this.captcha, this.files).subscribe(
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

  }

  onFileChanged(file) {
    this.files = file.target.files;
  }

}
