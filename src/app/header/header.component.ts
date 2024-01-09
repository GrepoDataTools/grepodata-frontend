import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import {MessageService} from "../services/message.service";
import {NavigationEnd, Router} from "@angular/router";
import {CaptchaService} from "../services/captcha.service";
import {RecaptchaComponent} from 'ng-recaptcha';
import {environment} from '../../environments/environment';
import {MediaMatcher} from '@angular/cdk/layout';
import {SidenavService} from '../layout/sidebar/sidenav-service';
import {DonateDialog} from '../shared/dialogs/donate/donate.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  toggled = false;
  isScoreboard = false;
  isCompare = false;
  isRanking = false;
  isIndexer = false;
  isProfile = false;

  hideHeader = false;

  mobileQuery: MediaQueryList;
  private readonly _mediaQueryListener: () => void;

  constructor(
    private sidenavService: SidenavService,
    private router: Router,
    public dialog: MatDialog,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 900px)');
    this._mediaQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', () => this._mediaQueryListener());

    // Watch for path changes
    router.events.subscribe((params) => {
      let val: any = params;
      if ('url' in val) {
        this.parsePath(val.url)
      }
    });

    // Check ingnitial path
    this.parsePath(this.router.url)
  }

  parsePath(path) {
    this.isScoreboard = false;
    this.isRanking = false;
    this.isIndexer = false;
    this.isCompare = false;
    this.hideHeader = false;
    if (path.includes('/points')) {
      this.isScoreboard = true;
    } else if (path.includes('/compare')) {
      this.isCompare = true;
    } else if (path.includes('/ranking')) {
      this.isRanking = true;
    } else if (path.includes('/indexer') || path.includes('/profile') || path.includes('/login')) {
      this.isIndexer = true;
    } else if (path.includes('/operations')) {
      this.hideHeader = true;
    }
    this.isProfile = path.includes('/profile') || path.includes('/indexer') || path.includes('/intel');
  }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', () => this._mediaQueryListener());
  }

  ngOnInit() {
  }

  donate()
  {
    // window.open("https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=WYX6WW65KYQ5N&source=url", "_blank")
    // this.routing('/donate');

    const dialogRef = this.dialog.open(DonateDialog, {
      autoFocus: false,
    });
  }

  toggleNav()
  {
    console.log(this.mobileQuery.matches)
    console.log(this.isProfile)
    if (this.mobileQuery.matches == false && this.isProfile) {
      // IF profile AND mobile: shown profile sidenav
      this.toggled = false;
      let sidenav = this.sidenavService.toggle();
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
    this.routing('/indexer');
  }

  public routing(url) {
    // console.log(url);
    this.router.navigate([url]);
    if (this.toggled) this.toggled = false;
  }

  public showContactDialog(): void {
    let dialogRef = this.dialog.open(ContactDialog, {autoFocus: false});
    dialogRef.afterClosed().subscribe(result => {});
  }

}

@Component({
  selector: 'contact-dialog',
  templateUrl: 'contact-dialog.html',
  styleUrls: ['./contact.scss'],
  providers: [MessageService, CaptchaService, RecaptchaComponent]
})
export class ContactDialog {
  @ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;

  custom_title = '';
  context = '';
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
    private messageService : MessageService)
  {
    if (data && 'custom_title' in data) {
      this.custom_title = data.custom_title;
    }
    if (data && 'context' in data) {
      this.context = data.context;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
    this.sendContactMessage();
  }

  public copy() {
    navigator.clipboard.writeText(`admin@grepodata.com`).then(() => {});
    this.copied = true;
    window.setTimeout(()=>{this.copied = false;}, 5000);
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
      let context = '_'+this.context;
      this.messageService.sendMessage(this.contact_message+context, this.contact_mail, '', this.captcha).subscribe(
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
