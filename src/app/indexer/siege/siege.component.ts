import {AfterViewInit, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConquestReportDialog, SiegeService} from './siege.service';
import {MatDialog} from '@angular/material/dialog';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-siege',
  templateUrl: './siege.component.html',
  styleUrls: ['./siege.component.scss'],
  providers: [SiegeService]
})
export class SiegeComponent implements AfterViewInit, OnChanges {
  @Input() isCard: boolean;
  @Input() embedded: boolean;
  @Input() hideKey: boolean;
  @Input() getByUid: boolean;
  @Input() key: any;
  @Input() world: any;
  @Input() conquestId: any;
  @Input() conquest: any;

  mobile: boolean = true;
  loading: any = true;
  loadingReports: any = true;
  error: any = false;
  errorReports: any = false;
  copied: any = false;

  reports: any  = [];
  objectKeys = Object.keys;
  allianceNames = {};

  constructor(
    public siegeService : SiegeService,
    public router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    if (window.screen.width > 768) { // 768px portrait
      this.mobile = false;
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    // Act on Input changes
    if (!this.isCard || this.conquest == null || this.conquest.conquest_id == null) {
      if (this.conquest != null && this.conquest.conquest_id != null) {
        this.loading = false;
      }
      if (this.getByUid) {
        this.loadByUid();
      } else {
        this.loadByKey();
      }
    } else {
      // render conquest only
      this.loading = false;
    }
  }

  ngAfterViewInit(): void {
    // Routed loading
    this.route.params.subscribe( params => {
      if (this.route.routeConfig && this.route.routeConfig.path.search('siege/') >= 0) {
        this.isCard = false;
        this.embedded = false;
        this.hideKey = true;
        this.conquest = {};
        if (params.key && params.id) {
          this.conquestId = params.id;
          this.key = params.key;
          this.hideKey = false;
          this.loadByKey();
        } else if (params.uid) {
          this.conquestId = params.uid;
          this.loadByUid();
        }
      }
    });
  }

  loadByUid(): void {
    this.siegeService.getConquestDetailsByUid(this.conquestId).subscribe(
      (response) => this.renderResult(response),
      (error) => {
        this.error = this.conquest == null || this.conquest.conquest_id == null;
        this.errorReports = true;
        this.loading = false;
        this.loadingReports = false;
        console.log(error);
      });
  }

  loadByKey(): void {
    this.siegeService.getConquestDetailsByKey(this.key, this.conquestId).subscribe(
      (response) => this.renderResult(response),
      (error) => {
        this.error = this.conquest == null || this.conquest.conquest_id == null;
        this.errorReports = true;
        this.loading = false;
        this.loadingReports = false;
        console.log(error);
      });
  }

  renderResult(data) {
    if (data.conquest && data.intel && data.world) {
      this.reports = data.intel;
      this.world = data.world;
      if (this.conquest == null || this.conquest.conquest_id == null) {
        this.conquest = data.conquest;
        this.conquestId = data.conquest.conquest_id;
      }
      if (this.conquest.belligerent_all) {
        Object.keys(this.conquest.belligerent_all).forEach(key => {
          this.allianceNames[this.conquest.belligerent_all[key].alliance_id] = this.conquest.belligerent_all[key].alliance_name
        });
      }
    } else {
      console.log(data);
      this.error = this.conquest == null || this.conquest.conquest_id == null;
      this.errorReports = true;
    }
    this.loading = false;
    this.loadingReports = false;
  }

  public loadConquestDetails(): void {
    let dialogRef = this.dialog.open(ConquestReportDialog, {
      panelClass: 'tight-dialog-container',
      autoFocus: false,
      data: {
        key: this.key,
        world: this.world,
        conquest: this.conquest,
        conquest_id: this.conquestId,
        get_by_uid: true,
      }
    });
  }

  copyLink(inputElement) {
    let url = environment.url + '/siege/' + this.conquestId;
    navigator.clipboard.writeText(url).then(() => {});
    // let selection = window.getSelection();
    // let txt = document.getElementById('siegeShareUrl');
    // let range = document.createRange();
    // range.selectNodeContents(txt);
    // console.log(range);
    // selection.removeAllRanges();
    // selection.addRange(range);
    // document.execCommand("copy");
    // selection.removeAllRanges();
    // inputElement.select();
    // document.execCommand('copy');
    // inputElement.setSelectionRange(0, 0);
    this.copied = true;
    window.setTimeout(()=>{this.copied = false;}, 4000);
  }

}