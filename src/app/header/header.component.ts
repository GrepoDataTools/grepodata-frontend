import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import {MessageService} from "../services/message.service";
import {NavigationEnd, Router} from "@angular/router";
import {CaptchaService} from "../services/captcha.service";
import {RecaptchaComponent} from 'ng-recaptcha';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  toggled = false;
  isScoreboard = false;
  isCompare = false;
  isRanking = false;
  isIndexer = false;

  constructor(private router: Router,
              public dialog: MatDialog) {
    router.events.subscribe((params) => {
      let val: any = params;
      if ('url' in val) {
        let path = val.url;
        if (path.includes('/points')) {
          this.isScoreboard = true;    this.isRanking = false;   this.isIndexer = false;   this.isCompare = false;
        } else if (path.includes('/compare')) {
          this.isScoreboard = false;   this.isRanking = false;   this.isIndexer = false;   this.isCompare = true;
        } else if (path.includes('/ranking')) {
          this.isScoreboard = false;   this.isRanking = true;    this.isIndexer = false;   this.isCompare = false;
        } else if (path.includes('/indexer') || path.includes('/profile') || path.includes('/login')) {
          this.isScoreboard = false;   this.isRanking = false;   this.isIndexer = true;    this.isCompare = false;
        } else {
          this.isScoreboard = false;   this.isRanking = false;   this.isIndexer = false;   this.isCompare = false;
        }
      }
    });
  }

  ngOnInit() {
  }

  donate()
  {
    window.open("https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=WYX6WW65KYQ5N&source=url", "_blank")
  }

  toggleNav()
  {
    this.toggled = !this.toggled;
  }

  headerContact()
  {
    this.toggleNav();
    this.showContactDialog();
  }

  openIndexer()
  {
    // if (this.router.url.search('indexer') === 1) {
    //   this.routing('/indexer/0');
    // } else {
    //   this.routing('/profile/intel');
    // }
    this.routing('/indexer');
  }

  public routing(url) {
    // console.log(url);
    this.router.navigate([url]);
    if (this.toggled) this.toggled = false;
  }

  public showContactDialog(): void {
    let dialogRef = this.dialog.open(ContactDialog, {
      // width: '600px',
      // height: '90%'
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

}

@Component({
  selector: 'contact-dialog',
  templateUrl: 'contact-dialog.html',
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