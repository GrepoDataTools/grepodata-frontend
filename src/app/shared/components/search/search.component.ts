import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import { Router} from "@angular/router";
import { PageEvent } from "@angular/material/paginator";
import {Globals} from '../../../globals';
import {SearchService} from '../../services/search.service';
import {GoogleAnalyticsEventsService} from '../../services/google-analytics-events.service';
import {CompareService} from '../../services/compare.service';
import {LocalStorageService} from '../../services/local-storage.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [SearchService, CompareService, GoogleAnalyticsEventsService, LocalStorageService]
})
export class SearchComponent implements AfterViewInit {

  //TODO: recent searches

  players;
  alliances;
  form;
  num_results;
  playerInput = '';
  playerInputSearching = '';
  allianceInput = '';
  searching_players = false;
  searching_alliances = false;
  hide_results = false;
  hide_search = false;
  loading = false;
  from = 0;
  size = 30;
  pageEvent: PageEvent;

  // Styling
  @Input()
  secondary = false;
  @Input()
  compare = true;
  @Input()
  close : any;

  public mobile: boolean = true;

  // Filters
  filters_active = false;
  showFilter = true;
  showStopped = false;
  server = '';
  world = '';
  player_id:any = null;

  // Debounce
  typingTimer;
  debounceTime = 300;

  constructor(
    private globals: Globals,
    public cdr: ChangeDetectorRef,
    private searchService: SearchService,
    private router: Router,
    private elementRef: ElementRef,
    public compareService: CompareService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
    router.events.subscribe((params) => {
      let val: any = params;
      this.hide_results = true;
      if ('url' in val) {
        let path = val.url;
        if (path.includes('/indexer')) {
          this.hide_search = true;
        } else {
          this.hide_search = false;
        }
      }
      this.cdr.detectChanges();
    });

    compareService.doHideSearch$.subscribe((response)=>{
      this.searching_players = false;
      this.searching_alliances = false;
      this.cdr.detectChanges();
    });

    compareService.doSearchPlayerWorlds$.subscribe((response)=>{
      const element = this.elementRef.nativeElement;
      // Only if this instance is still the active search instance
      if(element.offsetParent !== null) {
        // console.log(response);
        if (response && response[0] != '' && response[1] != '') {
          this.playerInput = response[0]; // 0: name
          this.world = '';
          this.from = 0;
          this.server = response[2]; // 2: server
          this.cdr.detectChanges();
          this.doSearchPlayers(response[1]); // 1: id
        }
      }
    });
  }

  ngAfterViewInit() {
    this.isMobile();

    this.cdr.detach();
    this.cdr.detectChanges();

    setTimeout(_ => this.cdr.detectChanges(), 250);
  }

  isMobile() {
    if (window.screen.width > 768) { // 768px portrait
      this.mobile = false;
    } else {
      this.mobile = true;
      this.debounceTime = 600; // Larger debounce time on mobile
    }
    this.cdr.detectChanges();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile();
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
    if(this.showFilter) {
      try {
        this.googleAnalyticsEventsService.emitEvent("search", "showFilter", "showFilter", 1);
      } catch (e) {}
    }
    this.cdr.detectChanges();

    setTimeout(_ => this.cdr.detectChanges(), 250);
  }

  clearFilter() {
    this.server = '';
    this.world = '';
    this.cdr.detectChanges();
    this.doSearch();

    setTimeout(_ => this.cdr.detectChanges(), 250);
  }

  setServer(event) {
    this.server = event;
    this.world = '';
    this.from = 0;
    this.cdr.detectChanges();
    this.doSearch();

    setTimeout(_ => this.cdr.detectChanges(), 250);
  }

  setWorld(event) {
    this.world = event;
    this.from = 0;
    this.cdr.detectChanges();
    this.doSearch();

    setTimeout(_ => this.cdr.detectChanges(), 250);
  }

  setStoppedToggle(event) {
    if (event.checked) this.showStopped = true;
    else this.showStopped = false;
    this.cdr.detectChanges();
    this.doSearch();
  }

  doSearch() {
    if (this.searching_players) this.doSearchPlayers();
    if (this.searching_alliances) this.doSearchAlliances();
  }

  paginatorEvent($event) {
    this.pageEvent = $event;
    if (typeof this.pageEvent != 'undefined') {
      this.from = this.pageEvent.pageIndex * this.pageEvent.pageSize;
      this.size = this.pageEvent.pageSize;
      if (this.searching_players) this.doSearchPlayers();
      if (this.searching_alliances) this.doSearchAlliances();
    }

    this.cdr.detectChanges();
    setTimeout(_ => this.cdr.detectChanges(), 250);
  }

  searchPlayers($event) {
    if (typeof $event != 'undefined') this.playerInput = $event.target.value;

    clearTimeout(this.typingTimer);
    let that = this;
    this.typingTimer = setTimeout(function () {
      that.clearFilter();
      that.from = 0;
      that.doSearchPlayers();
    }, this.debounceTime);
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }

  doSearchPlayers(id = null) {
    this.player_id = id;
    this.scrollTop();
    clearTimeout(this.typingTimer);
    if (this.playerInput.length > 1) {
      this.searching_players = true;
      this.searching_alliances = false;
      this.hide_results = false;
      this.loading = true;

      if (this.mobile == true) {
        this.from = 0;
        this.size = 50;
      }

      let preferred_server = this.globals.get_active_server();
      if (preferred_server==null || preferred_server==false) {
        preferred_server = '';
      }

      this.searchService.searchPlayers(id!=null?null:this.playerInput, this.from, this.size, this.server, this.world, this.showStopped, null, id, false, preferred_server)
        .subscribe(
          (response) => this.renderPlayerOutput(response),
          (error) => this.renderPlayerOutput(null)
        );

      try {
        this.googleAnalyticsEventsService.emitEvent("search", "searchPlayer", "searchPlayer", 1);
      } catch (e) {}
    } else {
      this.searching_players = false;
    }
    this.cdr.detectChanges();
  }

  searchAlliances($event) {
    if (typeof $event != 'undefined') this.allianceInput = $event.target.value;

    clearTimeout(this.typingTimer);
    let that = this;
    this.typingTimer = setTimeout(function () {
      that.doSearchAlliances();
    }, this.debounceTime);
  }

  doSearchAlliances() {
    window.scrollTo(0, 0);
    this.num_results = 0;
    this.alliances = [];
    clearTimeout(this.typingTimer);
    if (this.allianceInput.length > 1) {
      this.searching_alliances = true;
      this.searching_players = false;
      this.hide_results = false;
      this.loading = true;
      this.searchService.searchAlliances(this.allianceInput, this.from, this.size, null)
        .subscribe(
          (response) => this.renderAllianceOutput(response),
          (error) => this.renderAllianceOutput(null)
        );

      try {
        this.googleAnalyticsEventsService.emitEvent("search", "searchAlliance", "searchAlliance", 1);
      } catch (e) {}
    } else {
      this.searching_alliances = false;
    }
    this.cdr.detectChanges();
  }

  renderPlayerOutput(players) {
    if (players != null) {
      this.players = players.results;

      // form
      let form = players.form;
      if (this.server != '') {
        let worlds = [];
        for(var record in form.worlds) {
          if (form.worlds[record].key.indexOf(this.server) === 0) {
            worlds.push(form.worlds[record]);
          }
        }
        form.worlds = worlds;
      }
      this.form = form;

      if (this.num_results != players.count) {
        this.num_results = players.count;
      }
      this.playerInputSearching = this.playerInput;

      if (this.player_id==null && (this.num_results > 30 || (this.world != '' || this.server != ''))) {
        this.filters_active = true;
      } else {
        this.filters_active = false;
      }

      this.cdr.detectChanges();
    } else {
      this.playerInputSearching = '';
      this.num_results = 0;
      this.players = [];
      this.form = [];
    }
    this.loading = false;
    this.cdr.detectChanges();

    setTimeout(_ => this.cdr.detectChanges(), 250);
  }

  renderAllianceOutput(alliances) {
    if (alliances != null) {
      this.alliances = alliances.results;
      this.form = alliances.form;
      if (this.num_results != alliances.count) this.num_results = alliances.count;
    }
    this.loading = false;
    this.cdr.detectChanges();

    setTimeout(_ => this.cdr.detectChanges(), 250);
  }

  hideMobileResults() {
    this.hide_results = true;
    this.searching_players = false;
    this.searching_alliances = false;
    window.scroll(0, 0);
    this.cdr.detectChanges();
  }

  showSearch() {
    this.hide_search = !this.hide_search;
    this.cdr.detectChanges();
  }

  // players$: Player[] = [];
  // alliances$: Alliance[] = [];
  // searchingFor: string;
  // hidden = false;
  // faUser = faUser;
  // faUserFriends = faUserFriends;
  // constructor(
  //   private _playerService: PlayerService,
  //   private _allianceService: AllianceService,
  //   private router: Router
  // ) {
  //   router.events.subscribe((params) => {
  //     let val: any = params;
  //     if ('url' in val) {
  //       let path = val.url;
  //       if (path.includes('/indexer')) {
  //         this.hidden = true;
  //       } else {
  //         this.hidden = false;
  //       }
  //     }
  //   });
  // }
  // ngOnInit(): void { }
  // fetchPlayersByName(event: KeyboardEvent) {
  //   if ((event.target as HTMLInputElement).value.length < 2) return this.players$ = [];
  //   this.searchingFor = 'player';
  //   this._playerService.searchByName((event.target as HTMLInputElement).value).subscribe((players) => this.players$ = players.slice(0, 20));
  // }
  //
  // fetchAlliancesByName(event: KeyboardEvent) {
  //   if ((event.target as HTMLInputElement).value.length < 2) return this.alliances$ = [];
  //   this.searchingFor = 'alliance';
  //   this._allianceService.searchByName((event.target as HTMLInputElement).value).subscribe((alliances) => this.alliances$ = alliances.slice(0, 20));
  // }
}
