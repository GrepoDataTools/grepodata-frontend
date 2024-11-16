import { Component, Input, OnInit } from '@angular/core';
import { Globals } from '../../globals';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-ghost-towns',
  templateUrl: './ghost-towns.component.html',
  styleUrls: ['./ghost-towns.component.scss']
})
export class GhostTownsComponent implements OnInit {

  @Input()
  id: string;
  @Input()
  town: any;
  @Input()
  world: string;

  copied = false;
  generated_at : string;
  ghost_town_data: any[] = [];
  ghost_time = null;
  ghost_alliance: string;
  has_ghost_details = false;
  loading_ghost_towns = true;

  constructor(
    private globals: Globals,
    private playerService: PlayerService,
  ) {
    this.generated_at = new Date().toLocaleString();
  }

  ngOnInit(): void {
    this.loadGhostTowns();
  }

  public copyBB(): void {
    let selection = window.getSelection();
    let txt = document.getElementById('bb_code');
    let range = document.createRange();
    range.selectNodeContents(txt);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();
    this.copied = true;
    this.globals.showSnackbar(
      `<h4>BB code table copied to clipboard!</h4>`,
      'success', '', true, 5000);
  }

  private loadGhostTowns(): void {
    this.playerService.loadGhostTowns(this.world, this.id)
      .subscribe((response : any) => {
        if ('items' in response) {
          this.ghost_town_data = response?.items ?? [];
          this.ghost_town_data.forEach(town => town.ocean = `${Math.floor(town.island_x / 100)}${Math.floor(town.island_y / 100)}`);
          this.ghost_town_data = this.ghost_town_data.sort((a, b) => (a.town_name > b.town_name ? 1 : -1));

          if ('has_ghost_details' in response && response.has_ghost_details === true) {
            this.has_ghost_details = true;
            if ('ghost_alliance' in response) {
              this.ghost_alliance = response.ghost_alliance;
            }
            if ('ghost_time' in response) {
              this.ghost_time = response.ghost_time;
            }
          } else {
            this.has_ghost_details = false;
            this.ghost_alliance = null;
            this.ghost_time = null;
          }
        } else {
          this.ghost_town_data = [];
        }
        this.loading_ghost_towns = false;
      },
      (error) => {
        this.ghost_town_data = [];
        this.loading_ghost_towns = false;
      });
  }

}
