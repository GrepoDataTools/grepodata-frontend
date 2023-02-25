import {AfterViewInit, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConquestReportDialog, SiegeService} from './siege.service';
import {MatDialog} from '@angular/material/dialog';
import {environment} from '../../../environments/environment';
import {JwtService} from '../../auth/services/jwt.service';

@Component({
  selector: 'app-siege',
  templateUrl: './siege.component.html',
  styleUrls: ['./siege.component.scss'],
  providers: [SiegeService]
})
export class SiegeComponent implements AfterViewInit, OnChanges {
  @Input() isCard: boolean;
  @Input() embedded: boolean;
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
    private authService: JwtService,
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

      this.loadById();
    } else {
      // render conquest only
      this.loading = false;
    }
  }

  ngAfterViewInit(): void {}

  loadById(): void {
    this.authService.accessToken().then(access_token => {
      this.siegeService.getConquestDetailsById(access_token, this.conquestId).subscribe(
        (response) => this.renderResult(response),
        (error) => {
          this.error = this.conquest == null || this.conquest.conquest_id == null;
          this.errorReports = true;
          this.loading = false;
          this.loadingReports = false;
          console.log(error);
        });
    });
  }

  renderResult(data) {
    if (data.conquest && data.intel && data.world) {
      this.reports = data.intel;
      this.world = data.world;
      if (this.conquest == null || this.conquest.conquest_id == null) {
        // if coming from player, town or alliance intel, then conquest overview needs to be loaded
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
      panelClass: ['tight-dialog-container'],
      autoFocus: false,
      data: {
        key: this.key,
        world: this.world,
        conquest: this.conquest,
        conquest_id: this.conquestId
      }
    });
  }

}
