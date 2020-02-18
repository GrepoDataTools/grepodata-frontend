import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { Router} from "@angular/router";
// import {BBDialog} from "../indexer.component";
import { MatDialog } from "@angular/material/dialog";
import {SearchService} from '../../shared/services/search.service';

@Component({
  selector: 'index-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [SearchService]
})
export class IndexSearchComponent implements AfterViewInit {

  @Input() indexKey: string;

  players;
  alliances;
  towns;
  num_results;
  playerInput = '';
  allianceInput = '';
  townInput = '';
  islandInput = '';
  searching_players = false;
  searching_alliances = false;
  searching_towns = false;
  searching_islands = false;
  invalid_island = false;
  hide_results = false;
  loading = false;
  world = '';

  // Debounce
  typingTimer;
  debounceTime = 300;

  constructor(
    private searchService: SearchService,
    private router: Router,
    public cdr: ChangeDetectorRef,
    public dialog: MatDialog) {
  }

  ngAfterViewInit() {
    this.cdr.detach();
  }

  searching_false() {
    this.searching_players = false;
    this.searching_alliances = false;
    this.searching_islands = false;
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
      this.searching_islands = false;
      this.searching_towns = false;
      this.hide_results = false;
      this.loading = true;

      this.searchService.searchPlayersIndexed(this.playerInput, this.indexKey)
        .subscribe(
          (response) => this.renderPlayerOutput(response),
          (error) => this.renderPlayerOutput(null)
        );
    } else {
      this.searching_players = false;
    }
  }

  searchTowns($event) {
    console.log($event)
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
      this.searching_islands = false;
      this.searching_towns = true;
      this.hide_results = false;
      this.loading = true;

      this.searchService.searchTownsIndexed(this.townInput, this.indexKey)
        .subscribe(
          (response) => this.renderTownOutput(response),
          (error) => this.renderTownOutput(null)
        );
    } else {
      this.searching_towns = false;
    }
  }

  searchIslands($event) {
    if (typeof $event != 'undefined') {
      this.islandInput = $event.target.value;
      this.islandInput = this.islandInput.replace(/\D/g,'');
      this.searching_false()
    }

    clearTimeout(this.typingTimer);
    let that = this;
    this.typingTimer = setTimeout(function () {
      that.doSearchIslands();
    }, this.debounceTime);
  }

  doSearchIslands() {
    this.num_results = 0;
    this.towns = [];
    clearTimeout(this.typingTimer);
    if (this.islandInput.length > 1) {
      this.searching_players = false;
      this.searching_alliances = false;
      this.searching_towns = false;
      this.searching_islands = true;
      this.invalid_island = false;
      this.hide_results = false;
      this.loading = true;

      this.searchService.searchIslandsIndexed(this.islandInput, this.indexKey)
        .subscribe(
          (response) => this.renderIslandOutput(response),
          (error) => this.renderIslandOutput(null)
        );
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
      this.searching_islands = false;
      this.searching_towns = false;
      this.hide_results = false;
      this.loading = true;
      this.searchService.searchAlliances(this.allianceInput, 0, 30, this.indexKey)
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
      this.world = towns.world;
      this.towns = towns.results;
      if (this.num_results != towns.count) this.num_results = towns.count;
    }
    this.loading = false;
    this.cdr.detectChanges();
  }

  renderIslandOutput(towns) {
    if (towns != null) {
      if (towns.message && towns.message == "No island found") {
        this.invalid_island = true;
      } else {
        this.invalid_island = false;
        this.world = towns.world;
        this.towns = towns.results;
        if (this.num_results != towns.count) this.num_results = towns.count;
      }
    }
    this.loading = false;
    this.cdr.detectChanges();
  }

  renderPlayerOutput(players) {
    if (players != null) {
      this.world = players.world;
      this.players = players.results;
      if (this.num_results != players.count) this.num_results = players.count;
    }
    this.loading = false;
    this.cdr.detectChanges();
  }

  renderAllianceOutput(alliances) {
    if (alliances != null) {
      this.world = alliances.world;
      this.alliances = alliances.results;
      if (this.num_results != alliances.count) this.num_results = alliances.count;
    }
    this.loading = false;
    this.cdr.detectChanges();
  }

  public openBBdialog(type) {
    let dataBB = {
      data: {},
      key: this.indexKey,
      world: this.world
    };
    if (type == 'island') {
      let towns = this.towns;
      dataBB.data = {
        towns: towns,
        island: this.islandInput
      }
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

    this.cdr.detectChanges();
  }
}
