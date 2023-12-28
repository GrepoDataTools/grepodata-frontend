import {AfterViewInit, Component, Input, OnDestroy, OnInit, Pipe, PipeTransform} from '@angular/core';
import {IndexerService} from "../indexer.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ContactDialog} from "../../header/header.component";
import { MatDialog } from "@angular/material/dialog";
import {LocalCacheService} from "../../services/local-cache.service";
import {ConquestReportDialog} from '../siege/siege.service';
import {JwtService} from '../../auth/services/jwt.service';
import {WorldService} from '../../services/world.service';
import {ShareIndexDialog} from '../../shared/dialogs/share-index/share-index.component';
import {IntelSourceDialog} from '../../shared/dialogs/intel-source/intel-source.component';
import {Globals} from '../../globals';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-index-town',
  templateUrl: './town.component.html',
  styleUrls: ['./town.component.scss'],
  providers: [IndexerService, WorldService, LocalCacheService]
})
export class IndexTownComponent implements AfterViewInit, OnDestroy, OnInit {
  paramsSubscription : Subscription;

  @Input() embedded: boolean;
  @Input() key: string;
  @Input() id: string;
  @Input() world: string;

  townName = '';
  playerId = '';
  playerName = '';
  allianceId = '';
  allianceName = '';
  loading = false;
  noIntel = false;
  copied = false;
  err = '';
  worldName = '';
  build = [];
  allCities = [];
  notes = [];
  version = '';
  message = '';
  breadcrumb_data: any = {};

  hasStonehail = false;
  hasSilver = false;
  hasGod = false;
  hasHero = false;
  hasWall = false;
  hasConquest = false;
  hasSharingDetails = false;
  hasOldIntel = false;

  routeParams: any;

  constructor(
    public dialog: MatDialog,
    private indexerService: IndexerService,
    private router: Router,
    private globals: Globals,
    private worldService: WorldService,
    private authService: JwtService,
    private route: ActivatedRoute
  ) {
    this.paramsSubscription = this.route.params.subscribe( params => {
      if ('activetab' in params && params.activetab == 'town') {
        console.log('load town intel: ', params);
        this.routeParams = params;
        this.load(this.routeParams);
      }
    } );

    this.worldService.getWorldInfo(this.world).then((response) => {
      if (response && 'name' in response) {
        this.worldName = response.name;
      }
    });
  }

  ngAfterViewInit() { }

  ngOnInit() {
    if (this.embedded) {
      this.load({
        key: this.key,
        id: this.id,
        world: this.world
      })
    }
  }

  ngOnDestroy() {
    console.log('destroy town component');
    this.paramsSubscription.unsubscribe();
  }

  private load(params) {
    // Save params
    this.key = '0';
    if ('key' in params) {
      this.key = params['key'];
    }
    this.world = params['world'];
    this.id = params['id'];

    // Reset
    this.townName = 'Loading..';
    this.loading = true;
    this.noIntel = false;
    this.allCities = [];
    this.notes = [];
    this.breadcrumb_data = {};
    this.hasOldIntel = false;

    // Load town intel
    if (this.id) {
      this.authService.accessToken().then(access_token => {
        this.indexerService.loadTownIntel(access_token, this.world, this.id)
          .subscribe(
            (response) => this.renderTownIntel(response),
            (error) => this.renderTownIntel(null)
          );
      });
    }
  }

  softNotification(message, title = '', lifetime=5000) {
    this.globals.showSnackbar(
      `<h4>`+message+`</h4>`,
      'success', title, true,lifetime);
  }

  copyBB() {
    this.copied = true;
    let text = `[town]${this.id}[/town]`;
    navigator.clipboard.writeText(text).then(() => {});
    this.softNotification(text+' copied to clipboard', '', 5000);
    window.setTimeout(()=>{this.copied = false;}, 5000);
  }

  private renderTownIntel(data) {
    if (data == null) {
      this.err = 'Town not found';
    } else if (data.valid_key != undefined) {
      this.err = data.message;
      this.noIntel = true;
    } else {
      this.err = '';
      this.version = data.latest_version || data.script_version;
      this.message = data.update_message;
      this.townName = data.name;
      this.playerId = data.player_id;
      this.playerName = data.player_name;
      this.allianceId = data.alliance_id;
      this.hasStonehail = data.has_stonehail;
      if (data.buildings != undefined) {
        for (let key in data.buildings) {
          let level = data.buildings[key].level;
          let date = data.buildings[key].date;

          try {
            if (typeof level == 'string' && level.indexOf(" (-") >= 0) {
              let parts = level.split(" (-");
              let base = parts[0];
              level = base;
              if (parts.length > 1) {
                let mod:any = parts[1].split(')');
                if (mod.length > 1 && !isNaN(mod[0])) {
                  level -= mod[0];
                }
              }
            }
          } catch (e) {
            console.log(e);
          }

          this.build.push({
            'name':key,
            'val':level,
            'date':date
          })
        }
      }

      if (data.intel != undefined) {
        for (let key in data.intel) {
          let town = data.intel[key];
          this.hasSilver = town.silver ? true : this.hasSilver;
          this.hasGod = town.god ? true : this.hasGod;
          this.hasHero = town.hero ? true : this.hasHero;
          this.hasWall = town.wall ? true : this.hasWall;
          this.hasSharingDetails = town.shared_via_indexes ? true : this.hasSharingDetails;
          this.hasConquest = town.conquest_id && town.conquest_id > 0 ? true : this.hasConquest;
          this.hasOldIntel = ('is_previous_owner_intel' in town && town.is_previous_owner_intel == true) ? true : this.hasOldIntel;
          this.allCities.push(town);
        }
      }

      if (data.notes != undefined) {
        for (let key in data.notes) {
          let note = data.notes[key];
          this.notes.push(note);
        }
      }

      this.allianceName = data.alliance_name || '';
      this.breadcrumb_data = {
        world: this.world,
        teams: data.teams || [],
        player: {
          name: this.playerName,
          id: this.playerId
        },
        alliance: {
          name: this.allianceName,
          id: this.allianceId,
        },
        town: {
          name: this.townName,
          id: this.id,
          active: true,
        }
      }

      if (this.embedded) {
        this.breadcrumb_data['hide_world'] = true;
        this.breadcrumb_data['hide_teams'] = true;
        this.breadcrumb_data['hide_backlink'] = true;
      }

      this.noIntel = false;
    }
    this.loading = false;
  }

  public showContactDialog(): void {
    let dialogRef = this.dialog.open(ContactDialog, {
      // width: '600px',
      // height: '90%'
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  public loadConquestDetails(conquest_id): void {
    let dialogRef = this.dialog.open(ConquestReportDialog, {
      panelClass: ['tight-dialog-container'],
      autoFocus: false,
      data: {
        key: this.key,
        world: this.world,
        conquest: null,
        conquest_id: conquest_id
      }
    });
  }

  openShareInfoDialog(town) {
    if ('shared_via_indexes' in town) {
      town['world'] = this.world;
      town['town_id'] = this.id;
      town['town_name'] = this.townName;
      town['player_id'] = this.playerId;
      town['player_name'] = this.playerName;
      town['alliance_id'] = this.allianceId;
      town['alliance_name'] = this.allianceName;
      let shared_list = town.shared_via_indexes || '';
      let indexes = shared_list.split(', ')
      if (shared_list.length > 0 && indexes.length > 0) {
        let dialogRef = this.dialog.open(IntelSourceDialog, {
          width: '70%',
          autoFocus: false,
          disableClose: false,
          data: {
            intel: town,
            index_list: indexes,
            intel_type: 'incoming'
          }
        });
      }
    }
  }

}
