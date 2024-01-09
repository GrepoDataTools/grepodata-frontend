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
  @Input() isAdmin: boolean;
  @Input() isReader: boolean = true;
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
  publishing: any = false;
  isPublished: any = false;

  reports: any  = [];
  average_luck = null;
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
        this.isPublished = this.conquest?.published ?? false
        this.loading = false;
      }

      this.loadById();
    } else {
      // render conquest only
      this.loading = false;

      if ('average_luck' in this.conquest && this.conquest.average_luck != null) {
        this.average_luck = this.conquest.average_luck
        this.isPublished = this.conquest?.published ?? false
      }
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

    if ('average_luck' in this.conquest && this.conquest.average_luck != null) {
      this.average_luck = this.conquest.average_luck
    } else if (this.reports.length > 0) {
      this.average_luck = this.reports.reduce((sum, report) => sum + report?.attacker?.luck, 0) / this.reports.length
    }

    this.loading = false;
    this.loadingReports = false;
    this.isPublished = this.conquest?.published ?? false
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

  public publishConquest(): void {
    if (this.conquest.num_attacks_counted <= 3 || this.conquest.total_bp_att + this.conquest.total_bp_def <= 5000) {
      window.alert("Sorry, this siege is too small to be published. Total losses must be at least 5000 and there must be at least 4 attacks before you can publish a siege.");
    } else if (window.confirm("If you publish this siege, it will be visible on the daily scoreboard to all grepodata users. Only the belligerent alliances and total lost units will be made public; the individual attacks remains private to your team. Are you sure you want to publish this siege to the daily scoreboard?")) {
      this.doUpdateConquest('publish')
    }
  }

  public unpublishConquest(): void {
    if (window.confirm("If you unpublish this siege, the siege overview no longer be visible to the public. Only your team members can still see the siege. Are you sure you want to unpublish this siege?")) {
      this.doUpdateConquest('unpublish')
    }
  }

  private doUpdateConquest(action) {
    this.publishing = true;
    this.authService.accessToken().then(access_token => {
      this.siegeService.updateConquestDetailsByUid(access_token, this.conquest.conquest_uid, action).subscribe(
        (response) => {
          this.publishing = false;
          if ('published' in response) {
            this.isPublished = response?.published ?? false
            this.conquest.published = this.isPublished
          }
        },
        (error) => {
          this.publishing = false
          window.alert("Sorry, we were unable to update this conquest. Please try again later or contact us if this error persists.");
          console.log(error);
        });
    });
  }

}
