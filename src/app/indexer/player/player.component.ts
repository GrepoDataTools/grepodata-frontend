import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {IndexerService} from "../indexer.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PlayerService} from "../../player/player.service";
import {ContactDialog} from "../../header/header.component";
import { MatDialog } from "@angular/material/dialog";
import {BBDialog} from '../utils';
import {WorldService} from "../../services/world.service";
import {LocalCacheService} from "../../services/local-cache.service";
import {JwtService} from '../../auth/services/jwt.service';

@Component({
  selector: 'app-index-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  providers: [PlayerService, IndexerService, WorldService, LocalCacheService]
})
export class IndexPlayerComponent implements AfterViewInit {

  @Input() embedded: boolean;
  @Input() key: string;
  @Input() id: string;
  @Input() world: string;

	public mobile: boolean = true;

  playerName = '';
  allianceId = '';
  allianceName = '';
  loading = true;
  noIntel = false;
  playerFound = false;
  err = '';
  worldName = '';
  allCities: any = [];
  fireCities: any = [];
  birCities: any = [];
  trirCities: any = [];
  offCities: any = [];
  defCities: any = [];
  mythCities: any = [];
	totalCount = 0;
  version = '';
  message = '';
  tabsSeaIndex = 0;
  tabsLandIndex = 0;

  routeParams: any;
  breadcrumb_data: any = {};

  constructor(
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private worldService: WorldService,
    private authService: JwtService,
    private playerService: PlayerService,
    private indexerService: IndexerService,
    private router: Router,
    private route: ActivatedRoute) {
    this.route.params.subscribe( params => this.routeParams = params );
  }

  ngAfterViewInit() {
		if (window.screen.width > 768) { // 768px portrait
			this.mobile = false;
		}

    this.cdr.detach();

    if (this.embedded === true) {
      this.load(null);
    } else {
      this.load(this.routeParams)
    }
  }

  private load(params) {
    if (params !== null) {
      // Save params
      this.key = '0';
      if ('key' in params) {
        this.key = params['key'];
      }
      this.world = params['world'];
      this.id = params['id'];
    }

    // Reset
    this.playerName = 'Loading..';
    this.loading = true;
    this.noIntel = false;
    this.allCities = [];
    this.fireCities = [];
    this.trirCities = [];
    this.mythCities = [];
    this.birCities = [];
    this.defCities = [];
    this.offCities = [];
    this.totalCount = 0;
    this.breadcrumb_data = {};
    this.cdr.detectChanges();

    // Load player info
    this.playerFound = false;
    // Optional call for faster loading team of basic player info, but info is also returned by intel route
    this.playerService.loadPlayerInfo(this.world, this.id, true)
      .subscribe(
        (response) => this.renderPlayerInfo(response),
        (error) => {console.log("Unable to find player details")}
      );

    // Load player intel
    this.authService.accessToken(false).then(access_token => {
      this.indexerService.loadPlayerIntel(access_token, this.world, this.id)
        .subscribe(
          (response) => this.renderPlayerIntel(response),
          (error) => this.renderPlayerIntel(null)
        );
    });

    this.worldService.getWorldInfo(this.world).then((response) => {
      this.worldName = response.name
    });
  }

  private renderPlayerInfo(data) {
    this.playerFound = true;
    this.playerName = data.name;
    this.allianceId = data.alliance_id;
    this.allianceName = data.alliance_name;
    this.buildBreadcrumbData();
    this.cdr.detectChanges();
  }

  private buildBreadcrumbData() {
    this.breadcrumb_data = {
      world: this.world,
      player: {
        name: this.playerName,
        id: this.id,
        active: true
      },
      alliance: {
        name: this.allianceName,
        id: this.allianceId,
      }
    }
    this.cdr.detectChanges();
  }

  private renderPlayerIntel(data) {
    if (data == null) {
      this.err = 'Player not found';
    } else if (data.valid_key != undefined) {
      this.err = data.message;
      this.noIntel = true;
    } else {
      this.err = '';
      this.version = data.latest_version || data.script_version;
      this.message = data.update_message;
      if (data.cities.players[this.id] != undefined) this.allCities  = data.cities.players[this.id].towns || [];
      if (data.fire.players[this.id] != undefined) this.fireCities = data.fire.players[this.id] || [];
      if (data.bir.players[this.id] != undefined) this.birCities = data.bir.players[this.id] || [];
      if (data.trir.players[this.id] != undefined) this.trirCities = data.trir.players[this.id] || [];
      if (data.myth.players[this.id] != undefined) this.mythCities = data.myth.players[this.id] || [];
      if (data.off.players[this.id] != undefined) this.offCities = data.off.players[this.id] || [];
      if (data.def.players[this.id] != undefined) this.defCities = data.def.players[this.id] || [];
      this.noIntel = false;

      this.totalCount = this.fireCities.towns?this.fireCities.towns.length:0
        + this.birCities.towns?this.birCities.towns.length:0
        + this.trirCities.towns?this.trirCities.towns.length:0
				+ this.mythCities.towns?this.mythCities.towns.length:0
				+ this.offCities.towns?this.offCities.towns.length:0
				+ this.defCities.towns?this.defCities.towns.length:0;

      this.tabsSeaIndex = this.fireCities.towns&&this.fireCities.towns.length>0?0:(this.birCities.towns&&this.birCities.towns.length>0?1:(this.trirCities.towns&&this.trirCities.towns.length>0?2:0));
      this.tabsLandIndex = this.mythCities.towns&&this.mythCities.towns.length>0?0:(this.offCities.towns&&this.offCities.towns.length>0?1:(this.defCities.towns&&this.defCities.towns.length>0?2:0));
      // console.log(this.mythCities.length);
      // console.log(this.offCities);
      // console.log(this.defCities);
      // console.log(this.tabsLandIndex);

      if (!this.playerFound && 'info' in data) {
        this.playerName = data.info.player_name;
        this.allianceId = data.info.alliance_id;
        this.allianceName = data.info.alliance_name;
        this.buildBreadcrumbData();
      }

      if ('teams' in data && data.teams) {
        this.breadcrumb_data['teams'] = data.teams;
      }

    }
    this.loading = false;

    this.cdr.detectChanges();
  }

  public showContactDialog(): void {
    let dialogRef = this.dialog.open(ContactDialog, {
      // width: '600px',
      // height: '90%'
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  public openBBdialog(type) {
    let dataBB = {
      data: {},
      key: this.key,
      world: this.world,
      id: this.id,
      name: this.playerName,
      a_name: this.allianceName
    };
    if (type == 'player_fire') {
      dataBB.data = this.fireCities
    } else if (type == 'player_myth') {
      dataBB.data = this.mythCities
    } else if (type == 'player_bir') {
      dataBB.data = this.birCities
    } else if (type == 'player_trir') {
      dataBB.data = this.trirCities
    } else if (type == 'player_def') {
      dataBB.data = this.defCities
    } else if (type == 'player_off') {
      dataBB.data = this.offCities
    } else {
      return false;
    }

    let dialogRef = this.dialog.open(BBDialog, {
      // width: '90%',
      // height: '80%',
      autoFocus: false,
      data: {
        dataBB: dataBB,
        type: type
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  setSeaIndex(number: number) {
    this.tabsSeaIndex = number;
    this.cdr.detectChanges();
  }

  setLandIndex(number: number) {
    this.tabsLandIndex = number;
    this.cdr.detectChanges();
  }
}
