import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ScoreboardService } from './scoreboard.service';
import { LocalCacheService } from '../services/local-cache.service';
import { WorldService } from '../services/world.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GoogleAnalyticsEventsService } from '../services/google-analytics-events.service';
import { Globals } from '../globals';
import { SearchService } from '../search/search.service';
import { ConquestService } from '../conquest/conquest.service';
import { environment } from '../../environments/environment';
import * as moment from 'moment';
import {MediaMatcher} from '@angular/cdk/layout';
import {DonateDialog} from '../shared/dialogs/donate/donate.component';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
  providers: [ScoreboardService, LocalCacheService, WorldService, SearchService, ConquestService],
})
export class ScoreboardComponent implements OnInit {
  @ViewChild('searchPlayerOff', { static: false, read: ElementRef }) searchPlayerOff: ElementRef;
  @ViewChild('searchPlayerDef', { static: false, read: ElementRef }) searchPlayerDef: ElementRef;
  @ViewChild('overviewContainer', { static: false }) overviewContainer: ElementRef;
  @ViewChild('worldMap', { static: false }) worldMap: ElementRef;
  @ViewChild('worldMapContainer', { static: false }) worldMapContainer: ElementRef;
  @ViewChild('mapTooltipContainer', { static: false }) mapTooltipContainer: ElementRef;
  @ViewChild('mapTip', { static: false }) mapTip: ElementRef;

  // API data
  playerData = '' as any;
  ghostsData = '' as any;
  playerDiffs = '' as any;
  allianceData = '' as any;
  allianceChangesData = [] as any;
  data_default: any[];
  worldData = '' as any;
  player_att_max = 0;
  player_def_max = 0;
  alliance_att_max = 0;
  alliance_def_max = 0;

  // Form vars
  server: any = 'nl';
  world: any = '';
  worldName = '';
  nextUpdate = '';
  playerInput = '';
  searchResults = [];
  servers = [];
  worlds = [];
  loadingPlayers = false;
  loadingDiffs = true;
  loadingAlliances = false;
  noAllianceData = false;
  noPlayerData = false;
  toggleMore = true;
  showSettings = false;
  hasOverview = true;
  searching = false;
  searchInputting = false;
  mobile = false;
  noticePlayer = '';
  noticeAlliance = '';
  conquestVisibleRows = 20;

  // Datepicker
  DATE_FORMAT = 'YYYY-MM-DD';
  minDate = moment().subtract(1, 'months').format(this.DATE_FORMAT);
  maxDate = moment().format(this.DATE_FORMAT);
  selectedDate = moment().format(this.DATE_FORMAT);
  scoreboardDateInfo = '';

  // Debounce
  typingTimer;
  debounceTime = 400;
  usedInput: any;

  // Map
  showMap = false;
  showTodaysMap = false;
  animated = false;
  mapCanvas: any = null;
  legend: any = {};
  tipTimer;
  tipTimout = 3000;
  maxZoom = 8;
  minZoom = 0;
  currentZoom = 1;
  zoomOriginX = 0;
  zoomOriginY = 0;

  // Other
  _mediaQueryListener: () => void;
  mobileQuery: MediaQueryList;

  // Sieges
  tmp_conquest = {
    "key": '1z7ay7s5',
    "is_admin": true,
    "published": true,
    "conquest_id": 180849,
    "town_id": 13676,
    "town_name": "Amarynthos",
    "player_id": 0,
    "player_name": "Temple",
    "alliance_id": 0,
    "alliance_name": "",
    "last_attack_date": "2023-11-03 23:59:58",
    "belligerent_player_id": 809238,
    "belligerent_player_name": "Brent1929",
    "belligerent_alliance_id": 475,
    "belligerent_alliance_name": "Miauw Miauw MFK",
    "new_owner_player_id": 809238,
    "cs_killed": 0,
    "conquest_uid": "3474dbd33205e193b5ccfce85f871815",
    "index_key": "1z7ay7s5",
    "num_attacks_counted": 116,
    "average_luck": 0,
    "total_losses_att": {
      "griffin": 1341,
      "spartoi": 0,
      "ladon": 62,
      "harpy": 108,
      "bireme": 185,
      "manticore": 1019,
      "attack_ship": 18777,
      "trireme": 537,
      "siren": 11,
      "big_transporter": 132,
      "slinger": 672,
      "sea_monster": 53,
      "rider": 897,
      "chariot": 56
    },
    "total_losses_def": {
      "sword": 41168,
      "slinger": 30,
      "archer": 22256,
      "hoplite": 17129,
      "rider": 212,
      "chariot": 346,
      "godsent": 73,
      "bireme": 8996,
      "attack_ship": 94,
      "trireme": 88
    },
    "belligerent_all": [
      {
        "alliance_id": 10,
        "alliance_name": "Crazy Clowns"
      },
      {
        "alliance_id": 2,
        "alliance_name": "Destroyer Clowns"
      },
      {
        "alliance_id": 282,
        "alliance_name": "I'm looking for my mommy"
      },
      {
        "alliance_id": 218,
        "alliance_name": "Crimi Clowns"
      }
    ],
    "hide_details": false,
    "total_bp_att": 305101,
    "total_bp_def": 157138
  };
  // sieges = [{...this.tmp_conquest}, {...this.tmp_conquest}, {...this.tmp_conquest}]
  sieges = []
  selectedSiege = 0;

  env = environment;
  constructor(
    private globals: Globals,
    private scoreboardService: ScoreboardService,
    private conquestService: ConquestService,
    private searchService: SearchService,
    private worldService: WorldService,
    private router: Router,
    private media: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private renderer: Renderer2
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 560px)');
    this._mediaQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', () => {
      this._mediaQueryListener();
      this.checkMobileQuery();
    });
    this.checkMobileQuery();

    this.server = worldService.getDefaultServer();

    let noQueryParams = false;
    let noRouteParams = false;

    // Load scoreboard using params. if no params are supplied, they will be generated by backend
    this.route.queryParams.subscribe((params) => {
      if (params.world != undefined || noRouteParams) {
        this.load(params);
      } else {
        noQueryParams = true;
      }
    });

    this.route.params.subscribe((params) => {
      if (params.world != undefined && params.date != undefined) {
        this.router.navigate(['/points'], { queryParams: { world: params.world, date: params.date } });
      } else if (params.world != undefined) {
        this.router.navigate(['/points'], { queryParams: { world: params.world } });
      } else {
        noRouteParams = true;
        if (noQueryParams) {
          this.load(params);
        }
      }
    });

    this.worldService.getWorlds().then((response) => this.loadWorlds(response));
  }

  ngOnInit() {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.clearTip();
    this.buildCanvas();
  }

  checkMobileQuery() {
    if (!this.mobileQuery.matches) {
      this.mobile = true;
      this.conquestVisibleRows = 10;
      this.debounceTime = 750;
    } else {
      this.mobile = false;
      this.conquestVisibleRows = 24;
      this.debounceTime = 400;
      if (this.sieges && this.sieges.length > 0) {
        this.conquestVisibleRows = 10;
      }
      let num_ghosts = this.ghostsData.length;
      if (num_ghosts > 0) {
        this.conquestVisibleRows = Math.max(10, this.conquestVisibleRows - num_ghosts - 3);
      }
    }
  }

  setInputValue(val) {
    this.playerInput = val;
    if (this.searchPlayerOff) this.searchPlayerOff.nativeElement.value = val;
    if (this.searchPlayerDef) this.searchPlayerDef.nativeElement.value = val;
  }

  clearSearch() {
    this.setInputValue('');
    this.searchResults = [];
  }

  filterKeyup($event) {
    if (typeof $event != 'undefined') {
      this.searchInputting = true;
      this.usedInput = $event.target;
      this.setInputValue($event.target.value);
    }

    clearTimeout(this.typingTimer);
    let that = this;
    this.typingTimer = setTimeout(function () {
      that.filterEvent();
    }, this.debounceTime);
  }

  filterEvent() {
    this.searchInputting = false;
    if (this.playerInput.length > 2) {
      this.searching = true;
      this.searchService
        .searchPlayers(this.playerInput, 0, 7, this.server, this.world, false, null, null, true, '', null)
        .subscribe(
          (response) => this.renderSearchResults(response),
          (error) => {
            this.searchResults = [];
            this.searching = false;
            if (this.usedInput) {
              setTimeout(() => this.usedInput.focus(), 0);
            }
          }
        );
    }
  }

  renderSearchResults(response) {
    if (response.success == true) {
      this.searchResults = response.results;
    } else {
      this.searchResults = [];
    }

    let that = this;
    this.searchResults.forEach(function (i) {
      Object.keys(that.playerData.att).forEach(function (j) {
        if (that.playerData.att[j].i == i.id) {
          i.att_rank_scoreboard = +j + 1;
        }
      });
      Object.keys(that.playerData.def).forEach(function (j) {
        if (that.playerData.def[j].i == i.id) {
          i.def_rank_scoreboard = +j + 1;
        }
      });
    });

    this.searching = false;
    if (this.usedInput) {
      setTimeout(() => this.usedInput.focus(), 10);
    }
  }

  refresh() {
    if (this.loadingPlayers) return;
    let params = { world: this.world };
    this.load(params);
  }

  animate(animated: boolean) {
    this.animated = animated;
    if (this.animated && this.showMap) {
      this.mapCanvas = null;
      let url = this.env.url + '/m/' + this.world + '/animated.gif';
      if (!this.env.production) {
        url = '../../assets/images/m/animated.gif';
      }
      this.worldMap.nativeElement.setAttribute('src', url);
    } else {
      this.reloadMap();
    }
    this.mapZoom(null, -100); // reset zoom
  }

  mapNav(event, modX, modY) {
    const mod = 40 - this.currentZoom * 3;
    this.zoomOriginX += modX * mod;
    this.zoomOriginY += modY * mod;
    this.renderer.setStyle(
      this.worldMapContainer.nativeElement,
      'transform-origin',
      this.zoomOriginX + 'px ' + this.zoomOriginY + 'px'
    );
    this.buildCanvas();
  }

  mapZoom(event, mod) {
    this.currentZoom += mod;
    if (this.currentZoom < this.minZoom) {
      this.currentZoom = this.minZoom;
    } else if (this.currentZoom > this.maxZoom) {
      this.currentZoom = this.maxZoom;
    }
    if (this.currentZoom == 0) {
      this.resetMapPivot();
    }

    //zoom
    let zoom = 1 + 0.4 * this.currentZoom;
    if (this.currentZoom == 1) {
      zoom = 1.5;
    }
    this.renderer.setStyle(this.worldMapContainer.nativeElement, 'transform', 'scale(' + zoom + ')');
    if (zoom > 1) {
      this.renderer.setStyle(
        this.worldMapContainer.nativeElement,
        'transform-origin',
        this.zoomOriginX + 'px ' + this.zoomOriginY + 'px'
      );
    }
  }

  dragStartJs(event) {
    event.preventDefault();
    let img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
    event.dataTransfer.setDragImage(img, 0, 0);
  }

  mapTooltip(event) {
    if (this.mapCanvas != null && !this.mobile && !this.animated) {
      let pixelData = this.mapCanvas.getContext('2d').getImageData(event.offsetX, event.offsetY, 1, 1).data;
      // console.log(pixelData);
      let colorId = pixelData.toString().replace(/,/g, '');
      let match = null;
      Object.keys(this.legend).forEach((k) => {
        if (k === colorId) {
          match = k;
        } else {
          let colorDistance =
            Math.abs(pixelData[0] - this.legend[k].pixel[0]) +
            Math.abs(pixelData[1] - this.legend[k].pixel[1]) +
            Math.abs(pixelData[2] - this.legend[k].pixel[2]);
          if (colorDistance <= 5) {
            match = k;
          }
          // else {
          // console.log("===");
          // console.log(colorDistance);
          // console.log(pixelData);
          // console.log(this.legend[k]);
          // }
        }
      });
      if (match != null) {
        let legendData = this.legend[match];
        // Create tooltip
        this.renderer.setStyle(
          this.mapTip.nativeElement,
          'background',
          'url(' +
          this.worldMap.nativeElement.src +
          ') -' +
          legendData.namex +
          'px -' +
          legendData.namey +
          'px no-repeat'
        );
        this.renderer.setStyle(this.mapTooltipContainer.nativeElement, 'top', event.clientY - 30 + 'px');
        this.renderer.setStyle(this.mapTooltipContainer.nativeElement, 'left', event.clientX + 5 + 'px');
        this.renderer.setStyle(this.mapTooltipContainer.nativeElement, 'display', 'block');

        // Hide after a while
        clearTimeout(this.tipTimer);
        let that = this;
        this.tipTimer = setTimeout(function () {
          that.renderer.setStyle(that.mapTooltipContainer.nativeElement, 'display', 'none');
        }, this.tipTimout);
      } else {
        this.renderer.setStyle(this.mapTooltipContainer.nativeElement, 'display', 'none');
      }
    }
  }

  clearTip() {
    if (!this.mobile && this.mapTooltipContainer) {
      this.renderer.setStyle(this.mapTooltipContainer.nativeElement, 'display', 'none');
    }
  }

  load(params) {
    // Save params
    // if (typeof params['date'] != 'undefined') {
    //   this.paramsDate = params['date'];
    // }
    if (typeof params['world'] != 'undefined') {
      this.world = params['world'];
      this.server = this.world.substr(0, 2);
      this.globals.set_active_world(this.world);
      this.globals.set_active_server(this.server);
    } else if (this.server != '' && this.world != '' && this.server != this.world.substr(0, 2)) {
      this.world = '';
    } else if (this.globals.get_active_world() != false) {
      this.world = this.globals.get_active_world();
      this.server = this.world.substr(0, 2);
    }
    this.loadingPlayers = true;
    this.loadingDiffs = true;
    this.playerDiffs = '';
    this.searchResults = [];
    // this.ghostsData = [];
    // this.sieges = [];
    this.searching = false;
    this.conquestVisibleRows = 24;
    // this.hasOverview = false;
    this.showMap = false;
    this.showTodaysMap = false;
    this.animated = false;
    this.currentZoom = 0;
    this.zoomOriginX = null;
    this.zoomOriginY = null;
    this.setInputValue('');
    this.scoreboardService.loadPlayerScoreboard(this.world, params['date'], this.server).subscribe(
      (response) => this.renderPlayerScoreboard(response, params['date']),
      (error) => this.renderPlayerScoreboard(null, params['date'])
    );

    this.loadingAlliances = true;
    this.scoreboardService.loadAllianceScoreboard(this.world, params['date'], this.server).subscribe(
      (response) => this.renderAllianceScoreboard(response, params['date']),
      (error) => this.renderAllianceScoreboard(null, params['date'])
    );

    this.scoreboardService.loadAllianceChanges(this.world, params['date'], this.server, 0, 22).subscribe(
      (response) => this.renderAllianceChanges(response, params['date']),
      (error) => this.renderAllianceChanges(null, params['date'])
    );

    this.scoreboardService.loadPlayerResets(this.world, params['date'], this.server).subscribe(
      (response) => this.renderPlayerResets(response),
      (error) => this.renderPlayerResets(null)
    );

    this.scoreboardService.loadSieges(this.world, params['date'], this.server).subscribe(
      (response) => this.renderSieges(response),
      (error) => this.renderSieges(null)
    );
  }

  loadWorlds(worldData) {
    this.worldData = worldData;
    this.servers = [];
    this.worlds = [];
    for (let i of this.worldData) {
      this.servers.push((<any>i).server);
      if ((<any>i).server == this.server) {
        for (let w of (<any>i).worlds) {
          this.worlds.push(w);
          if (w.id == this.world) this.worldName = w.name;
        }
      }
    }

    // Cache data
    // LocalCacheService.set('worlds', json);
  }

  /**
   * === Header controls
   */
  setWorld(event) {
    this.globals.set_active_world(event);
    this.globals.set_active_server(event.substr(0, 2));
    if (this.nextUpdate == '') {
      this.router.navigate(['/points'], { queryParams: { world: event, date: moment(this.selectedDate).format(this.DATE_FORMAT) } });
    } else {
      this.router.navigate(['/points'], { queryParams: { world: event } });
    }
  }
  setDate(event) {
    this.router.navigate(['/points'], { queryParams: { world: this.world, date: moment(event).format(this.DATE_FORMAT) } });
  }
  prevDay() {
    if (this.loadingPlayers) return;
    let yesterday = moment(this.selectedDate).subtract(1, 'days').format(this.DATE_FORMAT);
    this.router.navigate(['/points'], { queryParams: { world: this.world, date: yesterday } });
  }
  nextDay() {
    if (this.loadingPlayers) return;
    let tomorrow = moment(this.selectedDate).add(1, 'days').format(this.DATE_FORMAT);
    this.router.navigate(['/points'], { queryParams: { world: this.world, date: tomorrow } });
  }
  today() {
    if (this.loadingPlayers) return;
    this.router.navigate(['/points'], { queryParams: { world: this.world } });
  }

  /**
   * === Renderer functions
   */
  updateWorlds(event) {
    this.server = event;
    this.loadWorlds(this.worldData);
    this.load([]);
  }

  renderPlayerResets(json) {
    if ('items' in json && json.items.length > 0) {
      this.ghostsData = json.items.filter(ghost => ghost.num_towns > 3).sort((a, b) => b.num_towns - a.num_towns).slice(0, 12)
      let num_ghosts = this.ghostsData.length;
      if (num_ghosts > 0) {
        this.conquestVisibleRows = Math.max(10, this.conquestVisibleRows - num_ghosts - 3);
      }
    } else {
      this.ghostsData = [];
    }
  }

  renderSieges(json) {
    if ('items' in json && json.items.length > 0) {
      this.sieges = json.items
      this.selectedSiege = 0;
    } else {
      this.sieges = [];
    }

    // Soft check on permissions (these are also enforced by backend but this is just to give better UX)
    let localIndexes = this.globals.get_all_indexes();
    let admin_indexes = localIndexes.filter(index => index.role == 'owner' || index.role == 'admin').map(index => index.key)
    let read_indexes = localIndexes.map(index => index.key)
    let duplicates = {}
    this.sieges = this.sieges.map(siege => {
      if (siege.conquest_id in duplicates) {
        siege.duplicate_id = duplicates[siege.conquest_id]
        duplicates[siege.conquest_id] += 1
      } else {
        duplicates[siege.conquest_id] = 1
      }
      siege.is_admin = admin_indexes.includes(siege.index_key) ?? false;
      siege.is_reader = read_indexes.includes(siege.index_key) ?? false;
      return siege
    })

    // Show less conquests if sieges are available
    if (this.sieges && this.sieges.length > 0) {
      this.conquestVisibleRows = 10;
    }
  }

  renderPlayerScoreboard(json, date) {
    if (json == null) {
      this.noticePlayer = 'We found no player scoreboard for ' + this.world + ' on ' + date + '. Use the world selector above to select another world.';
      this.noPlayerData = true;
    } else {
      // Check response date
      if (date != undefined && date != json.date)
        this.noticePlayer =
          'Unable to find a player scoreboard for ' +
          this.world +
          ' on ' +
          date +
          "; showing today's scoreboard instead.";
      else this.noticePlayer = '';

      // Update scoreboard form and data
      this.playerData = json;
      this.noPlayerData = false;
      this.data_default = json.overview;
      this.selectedDate = json.date;
      this.world = json.world;
      this.server = json.world.substring(0, 2);
      this.globals.set_active_world(this.world);
      this.globals.set_active_server(this.server);
      if ('minDate' in json) {
        this.minDate = json.minDate;
      }
      if ('att' in this.playerData) {
        this.player_att_max = this.playerData.att.reduce((max, player) => player.s > max ? player.s : max, this.playerData.att[0].s);
      }
      if ('def' in this.playerData) {
        this.player_def_max = this.playerData.def.reduce((max, player) => player.s > max ? player.s : max, this.playerData.def[0].s);
      }

      if ('date' in json) {
        let date = new Date(json.date);
        let limit = new Date();
        limit.setMonth(limit.getMonth() - 1);
        this.hasOverview = limit <= date;
        let mapLim = new Date('2020-01-13');
        this.showMap = date >= mapLim;
      } else {
        this.hasOverview = false;
        this.showMap = false;
      }
      // Date status
      if (json.allowCache == false) {
        // Today!
        this.scoreboardDateInfo = 'today before ' + json.time;
        if (!json.nextUpdate.includes('after')) {
          this.nextUpdate = 'Next update expected in ' + json.nextUpdate;
        } else {
          this.nextUpdate = 'Next update imminent';
        }

        if (this.showMap) {
          this.showTodaysMap = true;
          // let today = new Date(this.selectedDate);
          // let utcMapTime = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 6));
          // if (new Date() < utcMapTime) {
          // 	console.log("Map for today is not yet available");
          // 	console.log(utcMapTime);
          // 	this.showMap = false;
          // }
        }

        this.loadPlayerDiffs();
      } else {
        this.scoreboardDateInfo = 'on ' + json.date;
        this.nextUpdate = '';
        this.showTodaysMap = false;
      }

      this.loadWorlds(this.worldData);
    }
    this.loadingPlayers = false;

    this.reloadMap();
  }

  formatTime(val) {
    return val
    if (+(val.replace(':00', '')) % 2 == 1) {
      return val;
    } else {
      return '';
    }
  }

  reloadMap() {
    console.log('Reloading map');
    setTimeout((_) => {
      if (this.showMap && this.worldMap && !this.mobile) {
        this.mapCanvas = null;

        let url =
          this.env.url +
          '/m/' +
          this.world +
          '/map_' +
          this.selectedDate.toString().replace(/-/g, '_') +
          '.png';
        if (this.env.production) {
          if (this.showTodaysMap) {
            url = this.env.url + '/m/' + this.world + '/map_today.png';
          }
        } else {
          url = '../../assets/images/m/map_2020_01_13.png';
        }

        this.worldMap.nativeElement.setAttribute('src', url);
        this.worldMap.nativeElement.style.display = 'block';
      }
    }, 100);
  }

  resetMapPivot() {
    console.log('resetting map pivot');
    let pivot = this.worldMap.nativeElement.height / 2;
    this.zoomOriginX = pivot;
    this.zoomOriginY = pivot;
  }

  buildCanvas() {
    if (!this.mobile && !this.animated) {
      // Check initial origin
      if (this.zoomOriginX == null) {
        this.resetMapPivot();
      }

      // Build canvas
      console.log('Building map canvas');
      let canvas = document.createElement('canvas');
      canvas.width = this.worldMap.nativeElement.width;
      canvas.height = this.worldMap.nativeElement.height;
      canvas
        .getContext('2d')
        .drawImage(
          this.worldMap.nativeElement,
          0,
          0,
          this.worldMap.nativeElement.width,
          this.worldMap.nativeElement.height
        );
      this.mapCanvas = canvas;

      // Build color legend
      let canvasTemp = document.createElement('canvas');
      canvasTemp.width = 1250;
      canvasTemp.height = 1000;
      canvasTemp.getContext('2d').drawImage(this.worldMap.nativeElement, 0, 0, 1250, 1000);

      let offset = 90;
      let legend = {};
      let i = 0;
      while (i < 30) {
        i++;
        let pixelData = canvasTemp.getContext('2d').getImageData(1015, offset, 1, 1).data;
        let colorId = pixelData.toString().replace(/,/g, '');
        if (colorId == '0000') {
          // end of legend
          i = 30;
        } else {
          legend[colorId] = {
            namex: 1070,
            namey: offset - 11,
            pixel: pixelData,
          };
        }
        offset += 20;
      }
      this.legend = legend;
    }
  }

  onOverviewSelect(event) {
    if (this.hasOverview) {
      this.openOverviewdialog(event.series);
    }
  }

  openPlayerOverview(id, name) {
    this.openPlayerOverviewdialog(id, name);
  }

  openAllianceOverview(id, name) {
    this.openAllianceOverviewdialog(id, name);
  }

  loadPlayerDiffs() {
    this.scoreboardService.loadPlayerDiffs(this.world).subscribe(
      (response) => {
        this.playerDiffs = response;
        this.loadingDiffs = false;
      },
      (error) => {
        this.loadingDiffs = true;
      }
    );
  }

  renderAllianceScoreboard(json, date) {
    if (json == null) {
      this.noticeAlliance = 'We found no alliance scoreboard for ' + this.world + ' on ' + date + '. Use the world selector above to select another world.';
      this.allianceData = '';
      this.noAllianceData = true;
    } else {
      if (date != undefined && date != json.date)
        this.noticeAlliance =
          'Unable to find an alliance scoreboard for ' +
          this.world +
          ' on ' +
          date +
          '; showing ' +
          json.date +
          ' instead.';
      else this.noticeAlliance = '';
      this.allianceData = json;
      this.noAllianceData = false;
      if ('att' in this.allianceData) {
        this.alliance_att_max = this.allianceData.att.reduce((max, ally) => ally.s > max ? ally.s : max, this.allianceData.att[0].s);
      }
      if ('def' in this.allianceData) {
        this.alliance_def_max = this.allianceData.def.reduce((max, ally) => ally.s > max ? ally.s : max, this.allianceData.def[0].s);
      }
    }
    this.loadingAlliances = false;
  }

  renderAllianceChanges(json, date) {
    if (json == null || json.items == undefined) {
      this.allianceChangesData = '';
    } else {
      this.allianceChangesData = json.items;
    }
  }

  public openBBdialog(type) {
    let dataBB = {
      data: {},
      world: this.world,
      worldName: this.worldName,
      date: this.selectedDate,
      dateInfo: this.scoreboardDateInfo,
    };
    if (type == 'players_att') {
      dataBB.data = this.playerData.att;
    } else if (type == 'players_def') {
      dataBB.data = this.playerData.def;
    } else if (type == 'players_con') {
      dataBB.data = this.playerData.con;
    } else if (type == 'players_los') {
      dataBB.data = this.playerData.los;
    } else if (type == 'alliances_att') {
      dataBB.data = this.allianceData.att;
    } else if (type == 'alliances_def') {
      dataBB.data = this.allianceData.def;
    } else if (type == 'alliances_con') {
      dataBB.data = this.allianceData.con;
    } else if (type == 'alliances_los') {
      dataBB.data = this.allianceData.los;
    } else {
      return false;
    }

    let dialogRef = this.dialog.open(BBScoreboardDialog, {
      // width: '90%',
      // height: '80%',
      autoFocus: false,
      data: {
        dataBB: dataBB,
        type: type,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  public openOverviewdialog(hour) {
    let dialogRef = this.dialog.open(OverviewDialog, {
      // width: '90%',
      // height: '80%',
      autoFocus: false,
      data: {
        world: this.world,
        date: this.selectedDate.toString(),
        hour: hour,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  public openPlayerOverviewdialog(id, name) {
    let dialogRef = this.dialog.open(PlayerOverviewDialog, {
      // width: '80%',
      // height: '70%',
      autoFocus: false,
      data: {
        world: this.world,
        date: this.selectedDate.toString(),
        id: id,
        name: name,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  public openAllianceOverviewdialog(id, name) {
    let dialogRef = this.dialog.open(AllianceOverviewDialog, {
      // width: '80%',
      // height: '70%',
      autoFocus: false,
      data: {
        world: this.world,
        date: this.selectedDate.toString(),
        id: id,
        name: name,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  showConquests(type, id, name) {
    this.conquestService.showConquestDialog(type, id, name, this.world, this.selectedDate);
  }

  donate() {
    const dialogRef = this.dialog.open(DonateDialog, {
      autoFocus: false,
    });
  }
}

@Component({
  selector: 'bb-scoreboard-dialog',
  templateUrl: 'bb.html',
  providers: [],
})
export class BBScoreboardDialog {
  type: any;
  typeDisplay: any;
  typeBB: any;
  dataBB: any;
  generated_at: any;
  copied = false;
  slider: any = 10;

  constructor(
    private globals: Globals,
    public dialogRef: MatDialogRef<BBScoreboardDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService
  ) {
    this.type = data.type;

    if (
      this.type == 'players_att' ||
      this.type == 'players_def' ||
      this.type == 'players_con' ||
      this.type == 'players_los'
    ) {
      this.typeDisplay = 'Player';
      this.typeBB = 'player';
    } else if (
      this.type == 'alliances_att' ||
      this.type == 'alliances_def' ||
      this.type == 'alliances_con' ||
      this.type == 'alliances_los'
    ) {
      this.typeDisplay = 'Alliance';
      this.typeBB = 'ally';
      this.slider = 15;
    }

    this.dataBB = data.dataBB;
    this.generated_at = new Date().toLocaleString();

    try {
      this.googleAnalyticsEventsService.emitEvent('BB_scoreboard', 'copyBBscore', 'copyBBscore', 1);
    } catch (e) {}
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  copyBB() {
    let selection = window.getSelection();
    let txt = document.getElementById('bb_code');
    let range = document.createRange();
    range.selectNodeContents(txt);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    selection.removeAllRanges();
    this.copied = true;
    this.globals.showSnackbar(
      `<h4>BB code table copied to clipboard!</h4>`,
      'success', '', true,5000);
  }
}

@Component({
  selector: 'overview-dialog',
  templateUrl: 'overview.html',
  styleUrls: ['./scoreboard.component.scss'],
  providers: [ScoreboardService],
})
export class OverviewDialog implements AfterViewInit {
  world;
  date;
  hour;
  hourRaw;
  hourStart;
  hourEnd;
  data = {
    att: [],
    def: []
  };
  data_raw;
  data_is_filtered;

  hours;
  att_colors = ['#ea6153', '#d7a49b', '#811d13'];
  att_colors_actual = this.att_colors;
  def_colors = ['#297fb9', '#7FAED5', '#1b588c'];
  def_colors_actual = this.def_colors;

  // filtering alliances
  filtering = false;
  alliances_att;
  alliances_def;
  att_all_selected = true;
  def_all_selected = true;

  error;
  loading = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    public dialogRef: MatDialogRef<OverviewDialog>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private scoreboardService: ScoreboardService,
    public dialog: MatDialog
  ) {
    this.world = dialogData.world;
    this.date = dialogData.date;
    this.hourRaw = dialogData.hour;
    this.hour = +this.hourRaw.replace(':00', '').replace(/^0+/, '');

    this.loadHour();
  }

  loadHour() {
    this.hourStart = (this.hour - 1 < 10 ? '0' : '') + (this.hour - 1) + ':00';
    this.hourEnd = (this.hour + 1 < 10 ? '0' : '') + (this.hour + 1) + ':00';

    this.att_all_selected = true;
    this.def_all_selected = true;
    this.loading = true;
    this.filtering = false;
    this.error = null;
    this.scoreboardService.loadHourDiffs(this.world, this.date, this.hour).subscribe(
      (response) => this.renderResults(response),
      (error) => {
        console.log(error);
        this.error = true;
        this.loading = false;
      }
    );
  }

  setHour(new_hour) {
    this.hour = new_hour % 24==0 ? 24 : Math.abs(new_hour % 24);

    this.loadHour();
  }

  toggleFilter() {
    this.filtering=!this.filtering;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngAfterViewInit() {
  }

  onDefSelect(event) {
    if (typeof event == 'string' && event.indexOf('±') !== -1) {
      this.filterResults(event);
    } else {
      let player = this.data.def.filter((obj) => obj.name === event.series);
      this.dialogRef.close('navigate');
      this.openPlayerOverviewdialog(player[0].id, player[0].name);
    }
  }

  onAttSelect(event) {
    if (typeof event == 'string' && event.indexOf('±') !== -1) {
      this.filterResults(event);
    } else {
      let player = this.data.att.filter((obj) => obj.name === event.series);
      this.dialogRef.close('navigate');
      this.openPlayerOverviewdialog(player[0].id, player[0].name);
    }
  }

  public openPlayerOverviewdialog(id, name) {
    let dialogRef = this.dialog.open(PlayerOverviewDialog, {
      autoFocus: false,
      data: {
        world: this.world,
        date: this.date,
        id: id,
        name: name,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  filterResults(hour) {
    if (this.data_is_filtered) {
      this.unfilter();
    } else {
      this.data_is_filtered = true;
      this.data = JSON.parse(this.data_raw);

      this.data.att = this.data.att.map(player => {
        let filtered_player = player;
        filtered_player.series = filtered_player.series.filter(series => series.name == hour);
        if (filtered_player.series.length > 0) {
          return filtered_player;
        }
      }).filter(player => player != undefined);

      this.data.def = this.data.def.map(player => {
        let filtered_player = player;
        filtered_player.series = filtered_player.series.filter(series => series.name == hour);
        if (filtered_player.series.length > 0) {
          return filtered_player;
        }
      }).filter(player => player != undefined);

      // get color
      let colorIndex = this.hours.indexOf(hour);
      this.att_colors_actual = [this.att_colors[colorIndex]];
      this.def_colors_actual = [this.def_colors[colorIndex]];
    }
  }

  unfilter() {
    this.data_is_filtered = false;
    this.data = JSON.parse(this.data_raw);
    this.att_colors_actual = this.att_colors;
    this.def_colors_actual = this.def_colors;
  }

  renderResults(json) {
    this.data_is_filtered = false;
    this.data_raw = JSON.stringify(json);
    this.data = json;
    this.loading = false;
    console.log(json);
    this.hours = [];
    this.alliances_att = {};
    this.alliances_def = {};
    json.att.forEach(player => {
      if (!(player.alliance_id in this.alliances_att)) {
        this.alliances_att[player.alliance_id] = {
          name: player.alliance_name,
          toggle: true,
          score: 0
        };
      }
      this.alliances_att[player.alliance_id].score += player.value;
      player.series.forEach(series => {
        this.hours.push(series.name);
      });
    });
    json.def.forEach(player => {
      if (!(player.alliance_id in this.alliances_def)) {
        this.alliances_def[player.alliance_id] = {
          name: player.alliance_name,
          toggle: true,
          score: 0
        };
      }
      this.alliances_def[player.alliance_id].score += player.value;
      player.series.forEach(series => {
        this.hours.push(series.name);
      });
    });
    this.hours = [...new Set(this.hours)];
    this.att_colors_actual = this.att_colors;
    this.def_colors_actual = this.def_colors;
    this.alliances_att = Object.values(this.alliances_att).sort((a:any, b:any) => a.score < b.score ? 1 : -1);
    this.alliances_def = Object.values(this.alliances_def).sort((a:any, b:any) => a.score < b.score ? 1 : -1);
  }

  doFilterAlliances() {
    // reset filter
    this.unfilter();

    // Check which alliances we need to include
    let included_alliances_att = [];
    let included_alliances_def = [];
    this.alliances_att.forEach(alliance => {
      if (alliance.toggle) {
        included_alliances_att.push(alliance.name);
      }
    });
    this.alliances_def.forEach(alliance => {
      if (alliance.toggle) {
        included_alliances_def.push(alliance.name);
      }
    });

    // Filter data
    this.data.att = this.data.att.filter(player => {
      return included_alliances_att.indexOf(player.alliance_name) > -1;
    });
    this.data.def = this.data.def.filter(player => {
      return included_alliances_def.indexOf(player.alliance_name) > -1;
    });
  }

  doSelectAllAtt(toggle) {
    this.alliances_att.forEach((alliance) => alliance.toggle = toggle);
    this.doFilterAlliances();
  }
  doSelectAllDef(toggle) {
    this.alliances_def.forEach((alliance) => alliance.toggle = toggle);
    this.doFilterAlliances();
  }
}

@Component({
  selector: 'player-overview-dialog',
  templateUrl: 'player-overview.html',
  styleUrls: ['./scoreboard.component.scss'],
  providers: [ScoreboardService],
})
export class PlayerOverviewDialog implements AfterViewInit {
  world;
  date;
  player_id;
  player_name;
  hourRaw;
  hourStart;
  data;

  error;
  loading = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    public dialogRef: MatDialogRef<PlayerOverviewDialog>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private scoreboardService: ScoreboardService,
    public dialog: MatDialog
  ) {
    this.world = dialogData.world;
    this.date = dialogData.date;
    this.player_id = dialogData.id;
    this.player_name = dialogData.name;

    this.loading = true;
    this.scoreboardService.loadDayDiffs(this.world, this.date, this.player_id).subscribe(
      (response) => this.renderResults(response),
      (error) => {
        console.log(error);
        this.error = true;
        this.loading = false;
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.cdr.detectChanges();
    setTimeout((_) => this.cdr.detectChanges(), 250);
  }

  ngAfterViewInit() {
    this.cdr.detach();
    this.cdr.detectChanges();
    setTimeout((_) => this.cdr.detectChanges(), 250);
  }

  public openOverviewDialog(hour) {
    let dialogRef = this.dialog.open(OverviewDialog, {
      // width: '90%',
      // height: '80%',
      autoFocus: false,
      data: {
        world: this.world,
        date: this.date,
        hour: hour,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'navigate') {
        this.onNoClick();
        this.cdr.detectChanges();
        setTimeout((_) => this.cdr.detectChanges(), 250);
      }
    });
    this.cdr.detectChanges();
    setTimeout((_) => this.cdr.detectChanges(), 250);
  }

  onSelect(event) {
    if ('series' in event) {
      let hour = event.series;
      this.dialogRef.close('navigate');
      this.openOverviewDialog(hour);
    }
  }

  renderResults(json) {
    this.data = json;
    this.loading = false;
    this.cdr.detectChanges();
    setTimeout((_) => this.cdr.detectChanges(), 250);
  }
}

@Component({
  selector: 'alliance-overview-dialog',
  templateUrl: 'alliance-overview.html',
  styleUrls: ['./scoreboard.component.scss'],
  providers: [ScoreboardService],
})
export class AllianceOverviewDialog implements AfterViewInit {
  world;
  date;
  alliance_id;
  alliance_name;
  hourRaw;
  hourStart;
  data;

  error;
  loading = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    public dialogRef: MatDialogRef<AllianceOverviewDialog>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private scoreboardService: ScoreboardService,
    public dialog: MatDialog
  ) {
    this.world = dialogData.world;
    this.date = dialogData.date;
    this.alliance_id = dialogData.id;
    this.alliance_name = dialogData.name;

    this.loading = true;
    this.scoreboardService.loadAllianceDayDiffs(this.world, this.date, this.alliance_id).subscribe(
      (response) => this.renderResults(response),
      (error) => {
        console.log(error);
        this.error = true;
        this.loading = false;
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.cdr.detectChanges();
    setTimeout((_) => this.cdr.detectChanges(), 250);
  }

  ngAfterViewInit() {
    this.cdr.detach();
    this.cdr.detectChanges();
    setTimeout((_) => this.cdr.detectChanges(), 250);
  }

  public openPlayerOverviewdialog(id, name) {
    let dialogRef = this.dialog.open(PlayerOverviewDialog, {
      autoFocus: false,
      data: {
        world: this.world,
        date: this.date,
        id: id,
        name: name,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  onSelect(event) {
    if ('series' in event) {
      let player = this.data.filter((obj) => obj.name === event.series)[0];
      this.dialogRef.close('navigate');
      this.openPlayerOverviewdialog(player.id, player.name);
    }
  }

  renderResults(json) {
    this.data = json;
    this.loading = false;
    this.cdr.detectChanges();
    setTimeout((_) => this.cdr.detectChanges(), 250);
  }
}
