import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {JwtService} from '../../../auth/services/jwt.service';
import {IndexerService} from '../../../indexer/indexer.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-index-settings',
    animations: [
      trigger('rotate', [
        state('open', style({
          transform: 'rotate(360deg)'
        })),
        state('closed', style({
          transform: 'rotate(0deg)'
        })),
        // transition('open => closed', [
        //   animate('1s')
        // ]),
        transition('closed => open', [
          animate('.7s ease-in-out')
        ]),
      ]),
    ],
  templateUrl: './share-index.component.html',
  styleUrls: ['./share-index.component.scss'],
  providers: [IndexerService]
})
export class ShareIndexDialog {

  copied = false;
  loadingLink = false;
  animate_refresh = false;
  share_link = '';
  index: any = {
    name: 'loading'
  };

  constructor(
    public dialogRef: MatDialogRef<ShareIndexDialog>,
    private authService: JwtService,
    private indexService: IndexerService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    console.log(data.index);
    this.index = data.index;
    this.share_link = 'https://grepodata.com/share/' + this.index.key + '/' + this.index.share_link
  }

  close(): void {
    this.dialogRef.close();
  }

  copyLink() {
    navigator.clipboard.writeText(this.share_link).then(() => {});
    this.copied = true;
    window.setTimeout(()=>{this.copied = false;}, 6000);
  }

  getNewLink() {
    this.loadingLink = true;
    this.copied = false;
    this.animate_refresh = true;
    let that = this;
    setTimeout(function() {
      that.animate_refresh = false;
      }, 1000);
    this.authService.accessToken().then(access_token => {
      this.indexService.createNewLink(access_token, this.index.key)
        .subscribe(
          (response) => {
            this.loadingLink = false;
            console.log(response);
            if ('success_code' in response && response.success_code === 1200) {
              this.share_link = 'https://grepodata.com/share/' + this.index.key + '/' + response.share_link;
            }
          },
          (error) => {
            this.loadingLink = false;
          }
        );
    });
  }
}