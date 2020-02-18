import { AfterViewInit, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { AllianceService } from '../../shared/services/alliance.service';
import { IndexerService } from '../../shared/services/indexer.service';
import { WorldService } from '../../shared/services/world.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Component({
  selector: 'app-index-alliance',
  templateUrl: './alliance.component.html',
  styleUrls: ['./alliance.component.scss'],
  providers: [AllianceService, IndexerService, WorldService, LocalStorageService]
})
export class IndexAllianceComponent implements AfterViewInit {

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
  err = '';
  worldName = '';
  allPlayers = '';
  firePlayers = '';
  birPlayers = '';
  mythPlayers = '';
  offPlayers = '';
  defPlayers = '';
  version = '';
  message = '';
  playerNameFilter = '';
  tabsSeaIndex = 0;
  tabsLandIndex = 0;

  routeParams: any;

  constructor(
    public dialog: MatDialog,
    public cdr: ChangeDetectorRef,
    private worldService: WorldService,
    private allianceService: AllianceService,
    private indexerService: IndexerService,
    private router: Router,
    private route: ActivatedRoute) {
    this.route.params.subscribe(params => this.routeParams = params);
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
    if (filterType == 'sea') {
      this.playerNameFilter = this.playerNameFilterSea;
      this.playerNameFilterLand = '';
    } else {
      this.playerNameFilter = this.playerNameFilterLand;
      this.playerNameFilterSea = '';
    }
    this.hasMatch = false;
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
    let match = this.playerNameFilter == '' || name.toLowerCase().search(this.playerNameFilter.toLowerCase()) >= 0;
    if (match) {
      this.hasMatch = true;
    }
    return match;
  }
  clearFilter() {
    this.playerNameFilter = '';
    this.playerNameFilterSea = '';
    this.playerNameFilterLand = '';
    this.hasMatch = true;
    this.filterType = '';
    this.cdr.detectChanges();
  }

  private load(params) {
    if (params !== null) {
      // Save params
      this.key = params['key'];
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
    this.mythPlayers = '';
    this.offPlayers = '';
    this.defPlayers = '';
    this.playerNameFilter = '';
    this.hasMatch = true;
    this.showNoResults = false;
    this.filterType = '';

    // Load alliance info
    this.allianceService.loadInfo(this.world, this.id)
      .subscribe(
        (response) => this.renderAllianceInfo(response),
        (error) => this.allianceName = "Not found"
      );

    // Load player intel
    this.indexerService.loadAllianceIntel(this.key, this.id)
      .subscribe(
        (response) => this.renderAllianceIntel(response),
        (error) => this.renderAllianceIntel(null)
      );

    this.worldService.getWorldInfo(this.world).subscribe((response) => this.worldName = response.name);
  }

  private renderAllianceInfo(data) {
    this.members = data.members;
    this.rank = data.rank;
    this.allianceName = data.name;
    this.cdr.detectChanges();
  }

  private renderAllianceIntel(data) {
    if (data == null) {
      this.err = 'Alliance not found';
    } else if (data.valid_key != undefined) {
      this.err = data.message;
      this.noIntel = true;
    } else {
      this.version = data.latest_version;
      this.message = data.update_message;
      this.allPlayers = data.cities.players;
      this.firePlayers = data.fire.players;
      this.birPlayers = data.bir.players;
      this.mythPlayers = data.myth.players;
      this.offPlayers = data.off.players;
      this.defPlayers = data.def.players;
      this.noIntel = false;

      this.tabsSeaIndex = Object.keys(this.firePlayers).length > 0 ? 0 : (Object.keys(this.birPlayers).length > 0 ? 1 : 0);
      this.tabsLandIndex = Object.keys(this.mythPlayers).length > 0 ? 0 : (Object.keys(this.offPlayers).length > 0 ? 1 : (Object.keys(this.defPlayers).length > 0 ? 2 : 0));
    }
    this.loading = false;
    this.cdr.detectChanges();
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
    } else if (type == 'player_off') {
      dataBB.data = this.offPlayers[playerId]['towns']
    } else if (type == 'player_def') {
      dataBB.data = this.defPlayers[playerId]['towns']
    } else {
      return false;
    }

    // let dialogRef = this.dialog.open(BBDialog, {
    //   // width: '90%',
    //   // height: '80%',
    //   autoFocus: false,
    //   data: {
    //     dataBB: dataBB,
    //     type: type
    //   }
    // });
    //
    // dialogRef.afterClosed().subscribe(result => {});
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
