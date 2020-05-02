import {Component, Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

const apiUrl = environment.apiUrl;

@Injectable()
export class SiegeService {

  constructor(
    private dialog: MatDialog,
    private http: HttpClient) {

  }

  getConquestDetailsByKey(key, id) {
    let url =  '/indexer/conquest?key='+key+'&conquest_id='+id;
    return this.http.get(apiUrl + url);
  }

  getConquestDetailsByUid(uid) {
    let url =  '/indexer/conquest?uid='+uid;
    return this.http.get(apiUrl + url);
  }

  getSiegeList(key) {
    let url =  '/indexer/siegelist?key='+key;
    return this.http.get(apiUrl + url);
  }
}

@Component({
  selector: 'conquest-dialog',
  templateUrl: 'siege-details-dialog.html'
})
export class ConquestReportDialog {

  key: any;
  world: any;
  conquest: any;
  conquestId: any;
  getByUid: any;

  constructor(
    public dialogRef: MatDialogRef<ConquestReportDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.key = data.key;
    this.world = data.world;
    this.conquest = data.conquest;
    this.conquestId = data.conquest_id;
    this.getByUid = data.get_by_uid;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'siegelist-dialog',
  templateUrl: 'siege-list-dialog.html',
  providers: [SiegeService]
})
export class SiegeListDialog {

  key: any;
  world: any;
  loading: any  = true;
  error: any  = false;
  sieges: any  = [];
  objectKeys = Object.keys;

  constructor(
    public dialogRef: MatDialogRef<SiegeListDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public siegeService: SiegeService,
    public dialog: MatDialog
  ) {
    this.key = data.key;
    this.world = data.world;

    this.siegeService.getSiegeList(this.key).subscribe(
      (response) => this.renderSieges(response),
      (error) => {
        this.error = true;
        this.loading = false;
        console.log(error);
      });
  }

  renderSieges(data) {
    if (data.sieges) {
      this.sieges = data.sieges;
    } else {
      console.log(data);
      this.error = true;
    }
    this.loading = false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public loadConquestDetails(conquest): void {
    let dialogRef = this.dialog.open(ConquestReportDialog, {
      autoFocus: false,
      data: {
        key: this.key,
        world: this.world,
        conquest: conquest,
        conquest_is: conquest.conquest_id,
      }
    });
  }

}