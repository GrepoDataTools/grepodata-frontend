import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {IndexerService} from "../indexer.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ContactDialog} from "../../header/header.component";
import { MatDialog } from "@angular/material/dialog";
import {LocalCacheService} from "../../services/local-cache.service";
import {ConquestReportDialog} from '../indexer.component';

@Component({
  selector: 'app-index-town',
  templateUrl: './town.component.html',
  styleUrls: ['./town.component.scss'],
  providers: [IndexerService]
})
export class IndexTownComponent implements OnInit {

  townName = '';
  playerId = '';
  playerName = '';
  allianceId = '';
  loading = false;
  noIntel = false;
  copied = false;
  err = '';
  world = '';
  key = '';
  id = '';
  build = [];
  allCities = [];
  notes = [];
  version = '';
  message = '';

  hasStonehail = false;
  hasSilver = false;
  hasGod = false;
  hasHero = false;
  hasWall = false;
  hasConquest = false;

  private csa : any = false;

  constructor(public dialog: MatDialog, private indexerService: IndexerService, private router: Router, private route: ActivatedRoute) {
    this.route.params.subscribe( params => this.load(params));
  }

  ngOnInit() {
  }

  private load(params) {
    // Save params
    this.key = params['key'];
    this.world = params['world'];
    this.id = params['id'];

    // Reset
    this.townName = 'Loading..';
    this.loading = true;
    this.noIntel = false;
    this.allCities = [];
    this.notes = [];

    // Check cleanup token
    this.csa = LocalCacheService.get('csa'+this.key);

    // Load town intel
    this.indexerService.loadTownIntel(this.key, this.id)
      .subscribe(
        (response) => this.renderTownIntel(response),
        (error) => this.renderTownIntel(null)
      );
  }

  public copyBB () {
    var selection = window.getSelection();
    var txt = document.getElementById('bbcode');
    var range = document.createRange();
    range.selectNodeContents(txt);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();
    this.copied = true;
    window.setTimeout(()=>{this.copied = false;}, 2000)
  }

  private renderTownIntel(data) {
    if (data == null) {
      this.err = 'Town not found';
    } else if (data.valid_key != undefined) {
      this.err = data.message;
      this.noIntel = true;
    } else {
      this.err = '';
      this.version = data.latest_version;
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
      autoFocus: false,
      data: {
        key: this.key,
        world: this.world,
        conquest: {conquest_id: conquest_id},
        get_by_id: true,
      }
    });
  }

  deleteIntel(id) {
    if (this.csa != false) {
      LocalCacheService.set('csa'+this.key, this.csa, (31 * 24 * 60));
      this.indexerService.deleteRecordById(this.csa, this.key, id).subscribe(_=>{});
    }
  }

  deleteNote(id) {
    if (this.csa != false) {
      LocalCacheService.set('csa'+this.key, this.csa, (31 * 24 * 60));
      this.indexerService.deleteNoteById(this.csa, this.key, id).subscribe(_=>{});
    }
  }

  deleteIntelUndo(id) {
    if (this.csa != false) {
      LocalCacheService.set('csa'+this.key, this.csa, (31 * 24 * 60));
      this.indexerService.deleteRecordUndo(this.csa, this.key, id).subscribe(_=>{});
    }
  }

}
