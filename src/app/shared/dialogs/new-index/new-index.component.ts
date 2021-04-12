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

@Component({
  selector: 'new-index',
  templateUrl: './new-index.component.html',
  styleUrls: ['./new-index.component.scss'],
  providers: [WorldService, IndexerService, CaptchaService, RecaptchaComponent, LocalCacheService, JwtService]
})
export class NewIndexDialog {
  @ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;

  index_name = '';
  world = '';
  server: any = '';
  key = '';
  submitted = false;
  building = false;
  copied = false;
  clickedShare = false;
  captcha = '';
  error = '';
  worldData = '';
  servers = [];
  worlds = [];
  createError = '';
  recaptcha_key = environment.recaptcha;
  createdIndex : any = {};

  constructor(
    public captchaService : CaptchaService,
    public dialogRef: MatDialogRef<NewIndexDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private indexerService : IndexerService,
    private worldService: WorldService,
    private router: Router,
    private authService: JwtService,
    private dialog: MatDialog,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
    this.server = worldService.getDefaultServer();

    indexerService.getWorlds().subscribe((response) => this.loadWorlds(response));

    try {
      this.googleAnalyticsEventsService.emitEvent("indexer", "newIndexDialog", "newIndexDialog", 1);
    } catch (e) {}
  }

  onNoClick(): void {
    this.close()
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

  createNewIndex(event) {
    this.captcha = event;
    if (this.index_name == '') {
      this.error = 'Team name is required';
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
    } else if (this.world == '') {
      this.error = 'Please select a world';
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
    } else if (this.captcha == undefined || this.captcha == '' || this.captcha == null) {
      this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
    } else {
      this.building = true;

      this.authService.accessToken().then(access_token => {
        this.indexerService.createNewIndex(access_token, this.index_name, this.world, this.captcha).subscribe(
          (response) => {
            this.building = false;
            this.submitted = true;

            if ('key' in response) {
              this.createdIndex = {
                'key': response.key,
                'name': this.index_name,
                'world': this.world,
                'role': 'owner',
                'share_link': response.share_link || 'Unauthorized',
                'contribute': 1,
                'overview': null,
              };
            }
            if (this.captchaRef != undefined) {
              this.captchaRef.reset();
            }
          },
          (error) => {
            this.submitted = false;
            this.building = false;
            this.error = 'Invalid response. Please try again or contact us if this error persists.';
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

  showShareDialog() {
    this.clickedShare = true;
    let dialogRef = this.dialog.open(ShareIndexDialog, {
      minWidth: '60%',
      // height: '90%'
      autoFocus: false,
      disableClose: false,
      data: {
        index: {
          key: this.createdIndex.key || '',
          name: this.index_name,
          world: this.world,
          share_link: this.createdIndex.share_link || '',
          role: this.createdIndex.role || ''
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.close();
    });
  }

  copyLink() {
    navigator.clipboard.writeText(`https://grepodata.com/invite/${this.createdIndex.key}${this.createdIndex.share_link}`).then(() => {});
    this.copied = true;
    window.setTimeout(()=>{this.copied = false;}, 6000);
  }
}
