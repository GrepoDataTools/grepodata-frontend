import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {WorldService} from '../../../services/world.service';
import {Router} from '@angular/router';
import {GoogleAnalyticsEventsService} from '../../../services/google-analytics-events.service';
import {environment} from '../../../../environments/environment';
import {RecaptchaComponent} from 'ng-recaptcha';
import {JwtService} from '../../../auth/services/jwt.service';
import {CaptchaService} from '../../../services/captcha.service';
import {IndexerService} from '../../../indexer/indexer.service';
import {LocalCacheService} from '../../../services/local-cache.service';
import {ShareIndexDialog} from '../share-index/share-index.component';
import {IndexAuthService} from '../../../auth/services/index.service';

@Component({
  selector: 'new-index',
  templateUrl: './import-index.component.html',
  styleUrls: ['./import-index.component.scss'],
  providers: [WorldService, IndexAuthService, CaptchaService, RecaptchaComponent, LocalCacheService, JwtService]
})
export class ImportIndexDialog {
  @ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;

  index_name = '';
  key = '';
  submitted = false;
  building = false;
  captcha = '';
  error = '';
  createError = '';
  recaptcha_key = environment.recaptcha;
  createdIndex : any = {};

  constructor(
    public captchaService : CaptchaService,
    public dialogRef: MatDialogRef<ImportIndexDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private indexerAuthService : IndexAuthService,
    private router: Router,
    private authService: JwtService,
    private dialog: MatDialog,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
    try {
      this.googleAnalyticsEventsService.emitEvent("indexer", "importIndexDialog", "importIndexDialog", 1);
    } catch (e) {}
  }

  onNoClick(): void {
    this.close()
  }

  /**
   * Explicit V1 index import (user needs to provide the 8 charachter index key)
   * @param event
   */
  importIndex(event) {
    this.captcha = event;
    if (this.index_name == '') {
      this.error = '8 character index key is required';
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
    } else if (this.index_name.length !== 8) {
      this.error = 'Your index key must be exactly 8 characters and may not include special characters or spaces';
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
    } else if (this.captcha == undefined || this.captcha == '' || this.captcha == null) {
      this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
    } else {
      this.building = true;

      this.authService.accessToken().then(access_token => {
        this.indexerAuthService.importV1Keys(access_token, this.index_name, true, this.captcha).subscribe(
          (response) => {

            if ('success_code' in response && response.success_code == 1400) {
              this.submitted = true;
              this.createdIndex = {
                'key': this.index_name,
                'name': this.index_name,
                'world': '',
                'role': 'write',
                'share_link': 'Unauthorized',
                'contribute': 1,
                'overview': null,
              };
            } else if (response.error_code && response.error_code == 7101) {
              this.error = 'No index found for this key. Please enter a valid 8 character index key';
            } else if (response.error_code && response.error_code == 7601) {
              this.error = 'Sorry, the owner of this index has disabled the V1 import functionality. Contact the owner to get access to this index.';
            } else if (response.error_code && response.error_code == 7602) {
              this.error = 'Sorry, this is not an old V1 index. You can only import old indexes using this method.  Contact the owner to get access to this team.';
            } else {
              this.submitted = false;
              this.error = 'Invalid response from server. Please try again later or contact us if this error persists.';
            }

            if (this.captchaRef != undefined) {
              this.captchaRef.reset();
            }

            this.building = false;
          },
          (error) => {
            console.error(error);
            this.submitted = false;
            this.building = false;
            this.error = 'Invalid response from server. Please try again later or contact us if this error persists.';
            if (this.captchaRef != undefined) {
              this.captchaRef.reset();
            }
          }
        );
      });
    }
  }

  close() {
    if ('key' in this.createdIndex) {
      this.dialogRef.close(this.createdIndex);
    } else {
      this.dialogRef.close(false);
    }
  }

}
