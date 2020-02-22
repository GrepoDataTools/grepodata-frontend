import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ChangeDetectorRef, Component, Inject, ViewChild} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {RecaptchaComponent} from 'ng-recaptcha';
import {CaptchaService} from '../../services/captcha.service';
import {LocalStorageService} from '../../services/local-storage.service';
import {IndexerService} from '../../services/indexer.service';
import {WorldService} from '../../services/world.service';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {GoogleAnalyticsEventsService} from '../../services/google-analytics-events.service';


@Component({
  selector: 'new-index-dialog',
  templateUrl: './new-index.component.html',
  providers: [WorldService, IndexerService, CaptchaService, RecaptchaComponent, LocalStorageService, AuthService, GoogleAnalyticsEventsService]
})
export class NewIndexDialog {
  @ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;

  // contact_mail = '';
  // privacy_agreed = false;
  world = '';
  server: any = '';
  key = '';
  submitted = false;
  building = false;
  done = false;
  captcha = '';
  error = '';
  worldData = '';
  servers = [];
  worlds = [];
  createError = '';
  recaptcha_key = environment.recaptcha;

  login_required = false;

  constructor(
    public captchaService : CaptchaService,
    public cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<NewIndexDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private indexerService : IndexerService,
    private worldService: WorldService,
    private router: Router,
    private authService: AuthService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
    this.login_required = !this.authService.loggedIn;
    this.server = worldService.getDefaultServer();

    indexerService.getWorlds().subscribe((response) => this.loadWorlds(response));

    try {
      this.googleAnalyticsEventsService.emitEvent("indexer", "newIndexDialog", "newIndexDialog", 1);
    } catch (e) {}
  }

  login_callback() {
    this.login_required = !this.authService.loggedIn;
    this.cdr.detectChanges();
    console.log("callback received");
    console.log(this.login_required);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  loadWorlds(data) {
    this.servers = [];
    this.worldData = data;
    this.worlds = [];
    for (let i of this.worldData) {
      this.servers.push((<any>i).server);
      if ((<any>i).server == this.server) {
        for (let w of (<any>i).worlds) {
          this.worlds.push(w);
        }
      }
    }
  }

  updateWorlds(event) {
    this.server = event;
    this.world = '';
    this.loadWorlds(this.worldData)
  }

  public createNewIndex(event) {
    this.captcha = event;
    // if (this.privacy_agreed == false) {
    //   this.error = 'Agree to our privacy policy to continue';
    //   if (this.captchaRef != undefined) { this.captchaRef.reset(); }
    // } else if (this.contact_mail == '') {
    //   this.error = 'Mail is required';
    //   if (this.captchaRef != undefined) { this.captchaRef.reset(); }
    // } else if (this.world == '') {
    if (this.world == '') {
      this.error = 'Please select a world';
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
    } else if (this.captcha == undefined || this.captcha == '' || this.captcha == null) {
      this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
    } else {
      try {
        this.googleAnalyticsEventsService.emitEvent("indexer", "newIndexSendRequest", "newIndexSendRequest", 1);
      } catch (e) {}

      this.building = true;
      this.indexerService.createNewIndex(this.authService.accessToken, this.world, this.captcha).subscribe(
        (response) => {
          this.buildIndex(response);
          if (this.captchaRef != undefined) { this.captchaRef.reset(); }
        },
        (error) => {
          this.building = false;
          this.error = 'Invalid response. Please try again or contact us if this error persists.';
          if (this.captchaRef != undefined) { this.captchaRef.reset(); }
        }
      );
    }
  }

  public buildIndex(data) {
    if (data.status == 'ok') {
      this.router.navigate(['/indexer/'+data.key]);
      this.dialogRef.close();
    }
    this.key = data.key;
    this.createError = 'You will receive an email with your index information as soon as it becomes available (this may take a day or two)';
    this.building = false;
    this.submitted = true;
    this.done = true;
  }
}