import {Component, Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {JwtService} from '../../auth/services/jwt.service';
import {PageEvent} from '@angular/material/paginator';

const apiUrl = environment.apiUrl;

@Injectable()
export class SiegeService {

  constructor(
    private dialog: MatDialog,
    private http: HttpClient) {

  }

  getConquestDetailsById(access_token, id) {
    let data = new HttpParams()
      .set('conquest_id', id);
    return this.http.get<any>(apiUrl + '/indexer/v2/conquest', {
      params: data,
      headers: new HttpHeaders({'access_token': access_token})
    });
  }

  updateConquestDetailsByUid(access_token, conquest_uid, action) {
    let data = new HttpParams()
      .set('conquest_uid', conquest_uid)
      .set('action', action);
    return this.http.post<any>(apiUrl + '/indexer/v2/updateconquest', data, {
      headers: new HttpHeaders({'access_token': access_token})
    });
  }

  getSiegeList(access_token, index_key, from = 0, size = 20) {
    let data = new HttpParams()
      .set('index_key', index_key)
      .set('from', from.toString())
      .set('size', size.toString());
    return this.http.get<any>(apiUrl + '/indexer/v2/siegelist', {
      params: data,
      headers: new HttpHeaders({'access_token': access_token})
    });
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

  constructor(
    public dialogRef: MatDialogRef<ConquestReportDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.key = data.key;
    this.world = data.world;
    this.conquest = data.conquest;
    this.conquestId = data.conquest_id;
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
  index_name: any;
  loading: any  = true;
  error: any  = false;
  sieges: any  = [];
  objectKeys = Object.keys;

  from = 0;
  size = 20;
  num_results = 20;
  pageEvent: PageEvent;
  paging = true;

  constructor(
    public dialogRef: MatDialogRef<SiegeListDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: JwtService,
    public siegeService: SiegeService,
    public dialog: MatDialog
  ) {
    this.key = data.key;
    this.world = data.world;
    this.index_name = data.index_name;

    this.getSieges();
  }

  getSieges() {
    this.paging = true;
    this.authService.accessToken().then(access_token => {
      this.siegeService.getSiegeList(access_token, this.key, this.from, this.size).subscribe(
        (response) => this.renderSieges(response),
        (error) => {
          this.error = true;
          this.loading = false;
          console.log(error);
        });
    });
  }

  renderSieges(data) {
    if (data.items) {
      this.sieges = data.items;
      if ('total_items' in data && data.total_items!=null && data.total_items >= 0) {
        this.num_results = data.total_items;
      }
    } else {
      console.log(data);
      this.error = true;
    }
    this.loading = false;
    this.paging = false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // public loadConquestDetails(conquest): void {
  //   let dialogRef = this.dialog.open(ConquestReportDialog, {
  //     autoFocus: false,
  //     data: {
  //       key: this.key,
  //       world: this.world,
  //       conquest: conquest,
  //       conquest_is: conquest.conquest_id,
  //     }
  //   });
  // }

  paginatorEvent($event) {
    this.pageEvent = $event;
    if (typeof this.pageEvent != 'undefined') {
      this.from = this.pageEvent.pageIndex * this.pageEvent.pageSize;
      this.size = this.pageEvent.pageSize;
    }
    this.getSieges();
  }

}
