import {AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy} from '@angular/core';
import {IndexerService} from "../indexer.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ContactDialog} from "../../header/header.component";
import { MatDialog } from "@angular/material/dialog";
import {AllianceService} from "../../alliance/alliance.service";
import {BBDialog} from '../utils';
import {WorldService} from "../../services/world.service";
import {JwtService} from '../../auth/services/jwt.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-index-alliance',
  templateUrl: './alliance.component.html',
  styleUrls: ['./alliance.component.scss'],
  providers: [AllianceService, IndexerService, WorldService]
})
export class IndexAllianceComponent implements AfterViewInit, OnDestroy {
  paramsSubscription : Subscription;

  @Input() embedded: boolean;
  @Input() key: string;
  @Input() id: string;
  @Input() world: string;

	public mobile: boolean = true;

  allianceName = '';
  members = 0;
  rank = 0;
  loading = true;
  noIntel = false;
  allianceFound = false;
  err = '';
  worldName = '';
  allPlayers = '';
  firePlayers = '';
  birPlayers = '';
  trirPlayers = '';
  mythPlayers = '';
  offPlayers = '';
  defPlayers = '';
  version = '';
  message = '';
	playerNameFilter = '';
  tabsSeaIndex = 0;
  tabsLandIndex = 0;
  viewIsLimited = false;

  routeParams: any;
  breadcrumb_data: any = {};

  constructor(
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private worldService: WorldService,
    private authService: JwtService,
    private allianceService: AllianceService,
    private indexerService: IndexerService,
    private router: Router,
    private route: ActivatedRoute) {
    this.paramsSubscription = this.route.params.subscribe( params => {
      if ('activetab' in params && params.activetab == 'alliance') {
        console.log('Construct alliance intel: ', params);
        this.routeParams = params;
      }
    });
  }

  ngOnDestroy() {
    console.log('destroy alliance component');
    this.paramsSubscription.unsubscribe();
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

	hasMatch = true;
  showNoResults = false;
  filterType = '';
  playerNameFilterSea = '';
  playerNameFilterLand = '';
  filterPlayers(filterType) {
  	if (filterType=='sea') {
			this.playerNameFilter = this.playerNameFilterSea;
			this.playerNameFilterLand = '';
		} else {
			this.playerNameFilter = this.playerNameFilterLand;
			this.playerNameFilterSea = '';
		}
		this.hasMatch=false;
		this.filterType = filterType;
		this.cdr.detectChanges();
		setTimeout(_ => {
			this.showNoResults = !this.hasMatch;
			this.cdr.detectChanges();
		}, 300);
	}
  filterMatch(name, type) {
  	if (type != this.filterType) {
  		return true;
		}
  	let match = this.playerNameFilter==''||name.toLowerCase().search(this.playerNameFilter.toLowerCase())>=0;
  	if (match) {
  		this.hasMatch = true;
		}
		return match;
	}
	clearFilter() {
		this.playerNameFilter='';
		this.playerNameFilterSea='';
		this.playerNameFilterLand='';
		this.hasMatch=true;
		this.filterType = '';
		this.cdr.detectChanges();
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
    this.allianceName = 'Loading..';
    this.loading = true;
    this.noIntel = false;
    this.allPlayers = '';
    this.firePlayers = '';
    this.birPlayers = '';
    this.trirPlayers = '';
    this.mythPlayers = '';
    this.offPlayers = '';
    this.defPlayers = '';
		this.playerNameFilter = '';
		this.hasMatch = true;
		this.showNoResults = false;
		this.viewIsLimited = false;
		this.filterType = '';
    this.breadcrumb_data = {};
    this.cdr.detectChanges();

    // Load alliance info
    this.allianceFound = false;
    // Optional call for faster loading team of basic alliance info, but info is also returned by intel route
    this.allianceService.loadAllianceInfo(this.world, this.id)
      .subscribe(
        (response) => this.renderAllianceInfo(response),
        (error) => {console.log("Unable to find alliance details")}
      );

    // Load alliance intel
    this.authService.accessToken().then(access_token => {
      this.indexerService.loadAllianceIntel(access_token, this.world, this.id)
        .subscribe(
          (response) => this.renderAllianceIntel(response),
          (error) => this.renderAllianceIntel(null)
        );
    });

    this.worldService.getWorldInfo(this.world).then((response) => {
      this.worldName = response.name
    });
  }

  private renderAllianceInfo(data) {
    this.allianceFound = true;
    this.members = data.members;
    this.rank = data.rank;
    this.allianceName = data.name;
    this.buildBreadcrumbData();
    this.cdr.detectChanges();
  }

  private buildBreadcrumbData() {
    this.breadcrumb_data = {
      world: this.world,
      alliance: {
        name: this.allianceName,
        id: this.id,
        active: true
      }
    }
    this.cdr.detectChanges();
  }

  private renderAllianceIntel(data) {
    if (data == null) {
      this.err = 'Alliance not found';
    } else if (data.valid_key != undefined) {
      this.err = data.message;
      this.noIntel = true;
    } else {
      this.version = data.latest_version || data.script_version;
      this.message = data.update_message;
      console.log(this.version);
      this.allPlayers = data.cities.players;
      this.firePlayers = data.fire.players;
      this.birPlayers = data.bir.players;
      this.trirPlayers = data.trir.players;
      this.mythPlayers = data.myth.players;
      this.offPlayers = data.off.players;
      this.defPlayers = data.def.players;
      this.noIntel = false;
      if ('view_is_limited' in data && data.view_is_limited == true) {
        this.viewIsLimited = true;
      }

      this.tabsSeaIndex = Object.keys(this.firePlayers).length>0?0:(Object.keys(this.birPlayers).length>0?1:(Object.keys(this.trirPlayers).length>0?2:0));
      this.tabsLandIndex = Object.keys(this.mythPlayers).length>0?0:(Object.keys(this.offPlayers).length>0?1:(Object.keys(this.defPlayers).length>0?2:0));

      if (!this.allianceFound && 'info' in data) {
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

  public openBBdialog(type, playerName, playerId) {
    let dataBB = {
      data: {},
      key: this.key,
      world: this.world,
      id: playerId,
      name: playerName,
      a_name: this.allianceName
    };
    if (type == 'player_fire') {
      dataBB.data = this.firePlayers[playerId]['towns']
    } else if (type == 'player_myth') {
      dataBB.data = this.mythPlayers[playerId]['towns']
    } else if (type == 'player_bir') {
      dataBB.data = this.birPlayers[playerId]['towns']
    } else if (type == 'player_trir') {
      dataBB.data = this.trirPlayers[playerId]['towns']
    } else if (type == 'player_off') {
      dataBB.data = this.offPlayers[playerId]['towns']
    } else if (type == 'player_def') {
      dataBB.data = this.defPlayers[playerId]['towns']
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
    this.clearFilter();
    this.cdr.detectChanges();
  }

  setLandIndex(number: number) {
    this.tabsLandIndex = number;
		this.clearFilter();
    this.cdr.detectChanges();
  }
}
