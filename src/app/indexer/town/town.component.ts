import {AfterViewInit, Component, OnDestroy, OnInit, Pipe, PipeTransform} from '@angular/core';
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

@Component({
  selector: 'app-index-town',
  templateUrl: './town.component.html',
  styleUrls: ['./town.component.scss'],
  providers: [IndexerService, WorldService]
})
export class IndexTownComponent implements AfterViewInit {

  townName = '';
  playerId = '';
  playerName = '';
  allianceId = '';
  loading = false;
  noIntel = false;
  copied = false;
  err = '';
  world = '';
  worldName = '';
  key = '';
  id = '';
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
    this.route.params.subscribe( params => this.routeParams = params );

    this.worldService.getWorldInfo(this.world).then((response) => {
      if (response && 'name' in response) {
        this.worldName = response.name;
      }
    });

  }

  ngAfterViewInit() {
    this.load(this.routeParams)
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

  public copyBB () {
    navigator.clipboard.writeText(`[town]${this.id}[/town]`).then(() => {});
    this.copied = true;
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
            if (level.indexOf(" (-") >= 0) {
              let parts = level.split(" (-");
              let base = parts[0];
              level = base;
              if (parts.length > 1) {
                let mod = parts[1].split(')');
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
          this.allCities.push(town);
        }
      }

      if (data.notes != undefined) {
        for (let key in data.notes) {
          let note = data.notes[key];
          this.notes.push(note);
        }
      }

      this.breadcrumb_data = {
        world: this.world,
        teams: data.teams || [],
        player: {
          name: this.playerName,
          id: this.id
        },
        alliance: {
          name: data.alliance_name || '',
          id: this.allianceId,
        },
        town: {
          name: this.townName,
          id: this.id,
        }
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
        conquest_id: conquest_id,
        get_by_uid: false,
      }
    });
  }

  // deleteIntel(id) {
  //   alert("TODO")
  //   // if (this.csa != false) {
  //   //   LocalCacheService.set('csa'+this.key, this.csa, (31 * 24 * 60));
  //   //   this.indexerService.deleteRecordById(this.csa, this.key, id).subscribe(_=>{});
  //   // }
  // }
  //
  // deleteNote(id) {
  //   alert("TODO")
  //   // if (this.csa != false) {
  //   //   LocalCacheService.set('csa'+this.key, this.csa, (31 * 24 * 60));
  //   //   this.indexerService.deleteNoteById(this.csa, this.key, id).subscribe(_=>{});
  //   // }
  // }
  //
  // deleteIntelUndo(id) {
  //   alert("TODO")
  //   // if (this.csa != false) {
  //   //   LocalCacheService.set('csa'+this.key, this.csa, (31 * 24 * 60));
  //   //   this.indexerService.deleteRecordUndo(this.csa, this.key, id).subscribe(_=>{});
  //   // }
  // }

  openShareInfoDialog(town) {
    if ('shared_via_indexes' in town) {
      let shared_list = town.shared_via_indexes || '';
      let indexes = shared_list.split(', ')
      if (shared_list.length > 0 && indexes.length > 0) {
        let dialogRef = this.dialog.open(IntelSourceDialog, {
          autoFocus: false,
          disableClose: false,
          data: {
            index_list: indexes,
            intel_type: 'incoming'
          }
        });
      }
    }
  }

}
