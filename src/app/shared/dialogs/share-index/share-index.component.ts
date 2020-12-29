import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {JwtService} from '../../../auth/services/jwt.service';
import {IndexerService} from '../../../indexer/indexer.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-index-settings',
  templateUrl: './share-index.component.html',
  styleUrls: ['./share-index.component.scss'],
  providers: [IndexerService]
})
export class ShareIndexDialog {

  index: any = {
    name: 'loading'
  };

  constructor(
    public dialogRef: MatDialogRef<ShareIndexDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data.index);
    this.index = data.index;
  }

  close(): void {
    this.dialogRef.close(this.index.share_link);
  }

}