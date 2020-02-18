import {Component, Inject, ViewChild} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MessageService} from '../../services/message.service';
import {CaptchaService} from '../../services/captcha.service';
import {RecaptchaComponent} from 'ng-recaptcha';

@Component({
  selector: 'contact-dialog',
  templateUrl: 'contact.component.html',
  providers: [MessageService, CaptchaService, RecaptchaComponent]
})
export class ContactDialog {
  @ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;

  contact_message = '';
  contact_mail = '';
  privacy_agreed = false;
  submitted = false;
  loading = false;
  copied = false;
  error = '';
  captcha = '';
  recaptcha_key = environment.recaptcha;

  constructor(
    public captchaService : CaptchaService,
    public dialogRef: MatDialogRef<ContactDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private messageService : MessageService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
    this.sendContactMessage();
  }

  public copy() {
    var selection = window.getSelection();
    var txt = document.getElementById('mail');
    var range = document.createRange();
    range.selectNodeContents(txt);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();
    this.copied = true;
    window.setTimeout(()=>{this.copied = false;}, 5000)
  }

  public sendContactMessage() {
    if (this.contact_mail != '' && this.privacy_agreed == false) {
      this.error = 'Agree to our privacy policy if you want to submit your email address.';
      if (this.captchaRef != undefined) { if (this.captchaRef != undefined) { this.captchaRef.reset(); } }
    } else if (this.contact_message == '') {
      this.error = 'Message is required';
      if (this.captchaRef != undefined) { if (this.captchaRef != undefined) { this.captchaRef.reset(); } }
    } else if (this.captcha == '' || this.captcha == null) {
      this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
    } else {
      this.loading = true;
      this.messageService.sendMessage(this.contact_message, this.contact_mail, '', this.captcha).subscribe(
        (response) => {
          this.submitted = true;
          this.loading = false;
          if (this.captchaRef != undefined) { this.captchaRef.reset(); }
        },
        (error) => {
          this.error = 'Invalid captcha response. Please try again later or contact us if this error persists.';
          this.loading = false;
          if (this.captchaRef != undefined) { this.captchaRef.reset(); }
        }
      );

    }
  }

}