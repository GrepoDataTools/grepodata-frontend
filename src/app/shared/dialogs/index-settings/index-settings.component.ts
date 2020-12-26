import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BasicDialog} from '../basic/basic.component';
import {IndexService} from '../../../auth/services/index.service';
import {JwtService} from '../../../auth/services/jwt.service';
import {environment} from '../../../../environments/environment';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-index-settings',
  templateUrl: './index-settings.component.html',
  styleUrls: ['./index-settings.component.scss'],
  providers: [IndexService]
})
export class IndexSettingsDialog {

  index: any = {
    name: 'loading'
  };

  constructor(
    public dialogRef: MatDialogRef<IndexSettingsDialog>,
    private authService: JwtService,
    private indexService: IndexService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    console.log(data.index);
    this.index = data.index;
  }

  close(): void {
    this.dialogRef.close();
  }

  loadOwners() {

  }

  loadSettings() {

  }
}