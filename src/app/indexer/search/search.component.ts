

import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import { SearchService } from '../../search/search.service';
import { Router} from "@angular/router";
import {BBDialog} from '../utils';
import { MatDialog } from "@angular/material/dialog";
import {JwtService} from '../../auth/services/jwt.service';
import {WorldService} from '../../services/world.service';

@Component({
  selector: 'app-index-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [SearchService, WorldService]
})
export class IndexSearchComponent implements AfterViewInit {

  @ViewChild('searchContainer') searchContainer: ElementRef;

  @Input() preferredWorld: string;

  players;
  alliances;
  towns;
  num_results;
  playerInput = '';
  allianceInput = '';
  townInput = '';
  searching_players = false;
  searching_alliances = false;
  searching_towns = false;
  hide_results = true;
  loading = false;
  world = '';

  // Debounce
  typingTimer;
  debounceTime = 600;

  constructor(
    private cdr: ChangeDetectorRef,
    private searchService: SearchService,
    private authService: JwtService,
    private router: Router,
    private renderer: Renderer2,
    public dialog: MatDialog) {

    this.renderer.listen('window', 'click',(e:Event)=>{
      if(!this.searchContainer.nativeElement.contains(e.target)) {
        // hide results when clicking outside of the search container
        this.hide_results = true;
        this.cdr.detectChanges();
      }
    });

    router.events.subscribe((params) => {
      // hide results on navigation
      this.hide_results = true;
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {
    this.cdr.detach();
  }

  searching_false() {
    this.searching_players = false;
    this.searching_alliances = false;
    this.searching_towns = false;
  }

  searchPlayers($event) {
    if (typeof $event != 'undefined') {
      this.playerInput = $event.target.value;
      this.searching_false()
    }

    clearTimeout(this.typingTimer);
    let that = this;
    this.typingTimer = setTimeout(function () {
      that.doSearchPlayers();
    }, this.debounceTime);
  }

  doSearchPlayers() {
    this.num_results = 0;
    this.players = [];
    clearTimeout(this.typingTimer);
    if (this.playerInput.length > 1) {
      this.searching_players = true;
      this.searching_alliances = false;
      this.searching_towns = false;
      this.hide_results = false;
      this.loading = true;
      this.cdr.detectChanges();

      this.authService.accessToken().then(access_token => {
        this.searchService.searchPlayersIndexed(access_token, this.playerInput, this.world)
          .subscribe(
            (response) => this.renderPlayerOutput(response),
            (error) => this.renderPlayerOutput(null)
          );
      });
    } else {
      this.searching_players = false;
    }
  }

  clickedPlayerInput() {
    if (this.players.length > 0) {
      this.searching_players = true;
      this.searching_alliances = false;
      this.searching_towns = false;
      this.num_results = this.players.length;
      this.hide_results = false;
      this.cdr.detectChanges();
    }
  }

  clickedAllianceInput() {
    if (this.alliances.length > 0) {
      this.searching_players = false;
      this.searching_alliances = true;
      this.searching_towns = false;
      this.num_results = this.alliances.length;
      this.hide_results = false;
      this.cdr.detectChanges();
    }
  }

  clickedTownInput() {
    if (this.towns.length > 0) {
      this.searching_players = false;
      this.searching_alliances = false;
      this.searching_towns = true;
      this.num_results = this.towns.length;
      this.hide_results = false;
      this.cdr.detectChanges();
    }
  }

  searchTowns($event) {
    if (typeof $event != 'undefined') {
      this.townInput = $event.target.value;
      this.searching_false()
    }

    clearTimeout(this.typingTimer);
    let that = this;
    this.typingTimer = setTimeout(function () {
      that.doSearchTowns();
    }, this.debounceTime);
  }

  doSearchTowns() {
    this.num_results = 0;
    this.towns = [];
    clearTimeout(this.typingTimer);
    if (this.townInput.length > 1) {
      this.searching_players = false;
      this.searching_alliances = false;
      this.searching_towns = true;
      this.hide_results = false;
      this.loading = true;
      this.cdr.detectChanges();

      this.authService.accessToken().then(access_token => {
        // this.searchService.searchTownsIndexed(access_token, this.townInput)
        //   .subscribe(
        //     (response) => this.renderTownOutput(response),
        //     (error) => this.renderTownOutput(null)
        //   );
        this.searchService.searchTowns(this.townInput, null, access_token)
          .subscribe(
            (response) => this.renderTownOutput(response),
            (error) => this.renderTownOutput(null)
          );
      });
    } else {
      this.searching_towns = false;
    }
  }

  searchAlliances($event) {
    if (typeof $event != 'undefined') {
      this.allianceInput = $event.target.value;
      this.searching_false()
    }

    clearTimeout(this.typingTimer);
    let that = this;
    this.typingTimer = setTimeout(function () {
      that.doSearchAlliances();
    }, this.debounceTime);
  }

  doSearchAlliances() {
    this.num_results = 0;
    this.alliances = [];
    clearTimeout(this.typingTimer);
    if (this.allianceInput.length > 1) {
      this.searching_alliances = true;
      this.searching_players = false;
      this.searching_towns = false;
      this.hide_results = false;
      this.loading = true;
      this.cdr.detectChanges();

      this.searchService.searchAlliances(this.allianceInput, 0, 30)
        .subscribe(
          (response) => this.renderAllianceOutput(response),
          (error) => this.renderAllianceOutput(null)
        );
    } else {
      this.searching_alliances = false;
    }
  }

  renderTownOutput(towns) {
    if (towns != null) {
      this.towns = towns.results;
      if (this.num_results != towns.count) this.num_results = towns.count;
    }
    this.loading = false;
    this.hide_results = false;
    this.cdr.detectChanges();
  }

  renderPlayerOutput(players) {
    if (players != null) {
      this.players = players.results;
      if (this.num_results != players.count) this.num_results = players.count;
    }
    this.loading = false;
    this.hide_results = false;
    this.cdr.detectChanges();
  }

  renderAllianceOutput(alliances) {
    if (alliances != null) {
      this.alliances = alliances.results;
      if (this.num_results != alliances.count) this.num_results = alliances.count;
    }
    this.loading = false;
    this.hide_results = false;
    this.cdr.detectChanges();
  }

}
