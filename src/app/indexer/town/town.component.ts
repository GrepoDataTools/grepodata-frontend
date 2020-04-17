import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {IndexerService} from "../indexer.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ContactDialog} from "../../header/header.component";
import { MatDialog } from "@angular/material/dialog";
import {LocalCacheService} from "../../services/local-cache.service";

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
  err = '';
  world = '';
  key = '';
  id = '';
  build = [];
  allCities = [];
  notes = [];
  version = '';
  message = '';

	private csa = false;

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
      if (data.buildings != undefined) {
        for (let key in data.buildings) {
          this.build.push({
            'name':key,
            'val':data.buildings[key].level,
            'date':data.buildings[key].date
          })
        }
      }

      if (data.intel != undefined) {
        for (let key in data.intel) {
          let town = data.intel[key];
          this.allCities.push(town);
        }
      }

      if (data.notes != undefined) {
        for (let key in data.notes) {
          let note = data.notes[key];
          this.notes.push(note);
        }
      }
      console.log(this.notes);

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

	deleteIntel(id) {
		if (this.csa != false) {
			LocalCacheService.set('csa'+this.key, this.csa, (31 * 24 * 60));
			this.indexerService.deleteRecordById(this.csa, this.key, id).subscribe(_=>{});
		}
	}

	deleteIntelUndo(id) {
		if (this.csa != false) {
			LocalCacheService.set('csa'+this.key, this.csa, (31 * 24 * 60));
			this.indexerService.deleteRecordUndo(this.csa, this.key, id).subscribe(_=>{});
		}
	}

}
