import { Component, OnInit } from '@angular/core';
import { PlayerService } from "../../services/player.service";
import { faUser, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { Player } from '../../core/interfaces/player';
import { Alliance } from '../../core/interfaces/alliance';
import { AllianceService } from '../../services/alliance.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  players$: Player[] = [];
  alliances$: Alliance[] = [];
  searchingFor: string;

  hidden = false;
  faUser = faUser;
  faUserFriends = faUserFriends;

  constructor(
    private _playerService: PlayerService,
    private _allianceService: AllianceService,
    private router: Router
  ) {
    router.events.subscribe((params) => {
      let val: any = params;
      if ('url' in val) {
        let path = val.url;
        if (path.includes('/indexer')) {
          this.hidden = true;
        } else {
          this.hidden = false;
        }
      }
    });
  }

  ngOnInit(): void {
  }

  fetchPlayersByName(event: KeyboardEvent) {
    if ((event.target as HTMLInputElement).value.length < 2) return this.players$ = [];
    this.searchingFor = 'player';
    this._playerService.fetchPlayersByName((event.target as HTMLInputElement).value).subscribe((players) => this.players$ = players.slice(0, 20));
  }

  fetchAlliancesByName(event: KeyboardEvent) {
    if ((event.target as HTMLInputElement).value.length < 2) return this.alliances$ = [];
    this.searchingFor = 'alliance';
    this._allianceService.fetchAlliancesByName((event.target as HTMLInputElement).value).subscribe((alliances) => this.alliances$ = alliances.slice(0, 20));
  }
}
