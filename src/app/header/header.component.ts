import {ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import {MessageService} from "../services/message.service";
import {NavigationEnd, Router} from "@angular/router";
import {CaptchaService} from "../services/captcha.service";
import {RecaptchaComponent} from 'ng-recaptcha';
import {environment} from '../../environments/environment';
import {MediaMatcher} from '@angular/cdk/layout';
import {SidenavService} from '../layout/sidebar/sidenav-service';

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
  isProfile = false;

  mobileQuery: MediaQueryList;
  private readonly _mediaQueryListener: () => void;

  constructor(
    private sidenavService: SidenavService,
    private router: Router,
    public dialog: MatDialog,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mediaQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', () => this._mediaQueryListener());

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
        this.isProfile = path.includes('/profile') || path.includes('/indexer');
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
    console.log(this.mobileQuery.matches)
    console.log(this.isProfile)
    if (this.mobileQuery.matches == false && this.isProfile) {
      // IF profile AND mobile: shown profile sidenav
      this.toggled = false;
      console.log("yeah boiiii");
      let sidenav = this.sidenavService.toggle();
      console.log(sidenav);
    } else {
      // ELSE shown regular toggled
      this.toggled = !this.toggled;
    }
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
      this.error = 'Sorry, we could not verify the captcha. Please try again later.';
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
          this.error = 'Invalid captcha response. Please try again later.';
          this.loading = false;
          if (this.captchaRef != undefined) { this.captchaRef.reset(); }
        }
      );

    }
  }

}
