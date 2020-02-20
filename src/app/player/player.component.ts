import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import { PlayerService } from "./player.service";
import {ActivatedRoute, Router} from "@angular/router";
import {data_default} from './data_default';
import * as moment from 'moment';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import {GoogleAnalyticsEventsService} from "../services/google-analytics-events.service";
import {CompareService} from "../compare/compare.service";
import { MatTabChangeEvent } from '@angular/material/tabs';
import {WorldService} from "../services/world.service";
import {Globals} from "../globals";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  providers: [PlayerService, WorldService]
})
export class PlayerComponent implements OnInit {
	@ViewChild("infoTabs", {static: false}) infoTabs: ElementRef;

  // Chart vars
  data_default: any[];
  view: any[] = [1200, 320];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  dayRange = '30';
  showXAxisLabel = false;
  xAxisLabel = 'Score';
  showYAxisLabel = false;
  yAxisLabel = 'Date';
  colorScheme = {
    domain: ['#18bc9c', '#f07057', '#2686c3', '#AAAAAA']
  };
  colorSchemeHeatmap = {
    selectable: true,
    group: 'Continuous',
    domain: [
      // '#e0f7fa',
      // // '#b3f2ed',
      // '#7eeadc',
      // // '#51e1c4',
      // '#32dabc',
      // // '#00d4b4',
      // // '#00c1a8',
      // // '#00a78f',
      // '#00b8a2',
      // // '#00806a'

      '#e0f7fa',
      '#7eeadc',
      '#32dabc',
      '#00b8a2',
    ]
  };
  autoScale = true;
  timeline = true;
  animations = false;
  bShowHistoryChart = true;
  bShowHeatmapChart = false;
  bShowHeatmapTab = false;
  bShowIntel = false;

  onSelect(event) {
    console.log(event);
  }

  onTabClick(event: MatTabChangeEvent) {
  	switch (event.index) {
			case 0:
				this.bShowHistoryChart = true;
				this.bShowHeatmapChart = false;
				break;
			case 1:
				this.bShowHistoryChart = false;
				this.bShowHeatmapChart = true;
				break;
			case 3:
				this.bShowIntel = true;
				break;
		}
    this.tabsIndex = event.index;
  }

  setActiveTab(type) {
    if (type === 'intel') {
      // this.tabsIndex = this.bShowHeatmapTab ? 3 : 2;
      this.tabsIndex = 3;
      this.bShowIntel = true;
    } else if (type === 'heatmap') {
      this.tabsIndex = 1;
    }
		if (this.infoTabs && this.showLegend==false) {
    	this.infoTabs.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
		}
  }

  // Component vars
  firstRun = true;
  playerInfoData = [];
  heatmapDay = {};
  heatmapHour = {};
  highestHeatmapHour = 0;
  highestIndex = 0;
  tabsIndex = 0;
  lowestIndex = null;
  playerHistoryLastDay = null
  playerHistoryJson = [];
  playerAllianceChanges = [];
  playerHistoryData = [];
  playerHistoryChart = [];
  playerName = '';
  points = '';
  rank = '';
  towns = '';
  att = '';
  def = '';
  world = '';
  worldName = '';
  id = '';
  alliance_id = '';
  alliance_name = '';

  // comparisons
  comparedPlayers = [];
  compareOpened = false;

  // Loading
  loadingHistory = false;
  loadingChanges = false;
  loadingInfo = false;
  notFound = false;
  selectionChanged = false;
  historyError = false;
  hasIndex: any = '';

  constructor(
    public dialog: MatDialog,
    private globals: Globals,
    private playerService: PlayerService,
    private worldService: WorldService,
    private router: Router,
    private route: ActivatedRoute,
    public compare: CompareService) {
    Object.assign(this, {data_default});
    if (window.innerWidth > 960) {
      this.showLegend = true;
    }

    this.route.queryParams.subscribe( params => {
      if (params.world != undefined && params.id != undefined) this.router.navigate(['/player/'+params.world+'/'+params.id]);
    });

    this.route.params.subscribe( params => this.load(params));
  }

  private load(params) {
    // Save params
    this.world = params['world'];
    this.worldService.getWorldInfo(this.world).then((response) => {
      this.worldName = response.name
    });
    this.id = params['id'];

    // Reset
    this.dayRange = '30';
    // this.showRangeSlider = false;
    this.playerName = 'Loading..';
    this.hasIndex = '';
    this.bShowIntel = false;

    this.notFound = false;
    this.historyError = false;
    this.loadingHistory = true;
    this.loadingChanges = true;
    this.loadingInfo = true;
    this.selectionChanged = false;

    this.compareOpened = false;
    this.comparedPlayers = this.compare.getComparedPlayers(this.world);
    this.checkCompared();

    // Load player info
    this.playerService.loadPlayerInfo(this.world, this.id, true)
      .subscribe(
        (response) => this.renderPlayerInfo(response),
        (error) => {this.notFound = true;}
      );

    // Load alliance changes info
    this.playerService.loadPlayerChanges(this.world, this.id)
      .subscribe(
        (response) => this.renderAllianceChanges(response),
        (error) => console.log(error)
      );

    // Check if intel is available
    let active_intel: any = this.globals.get_active_intel();
    if (active_intel !== false && this.world in active_intel) {
      this.hasIndex = active_intel[this.world];
    }
  }

  searchOtherWorlds() {
		this.compare.searchOtherWorlds(this.playerName, this.id, this.world.substring(0,2));
	}

  addToCompare() {
    this.compareOpened = true;
    this.compare.addPlayer(this.id, this.playerName, this.world);
    this.comparedPlayers = this.compare.getComparedPlayers(this.world);
  }

  checkCompared() {
    this.compareOpened = false;
    for (let i of this.comparedPlayers) {
      if (i.id === this.id) {
        this.compareOpened = true;
      }
    }
  }

  removeFromCompare(id, world){
    this.compare.removePlayer(id, world);
    this.checkCompared();
  }

  private renderPlayerInfo(json) {
    this.playerInfoData = json;
    this.playerName = json.name;
    this.alliance_id = json.alliance_id;
    this.alliance_name = json.alliance_name;
    this.points = json.points;
    this.rank = json.rank;
    this.towns = json.towns;
    this.att = json.att;
    this.def = json.def;
    this.loadingInfo = false;

    if (typeof json.heatmap.day !== 'undefined') {
      this.heatmapDay = [
        { name: 'Sunday',    value: json.heatmap.day['0'] || 0 },
        { name: 'Monday',    value: json.heatmap.day['1'] || 0 },
        { name: 'Tuesday',   value: json.heatmap.day['2'] || 0 },
        { name: 'Wednesday', value: json.heatmap.day['3'] || 0 },
        { name: 'Thursday',  value: json.heatmap.day['4'] || 0 },
        { name: 'Friday',    value: json.heatmap.day['5'] || 0 },
        { name: 'Saturday',  value: json.heatmap.day['6'] || 0 }
      ];
      let heatmapHour = [];
      let highest = 0;
      let lowest = 1000000;
      for (let i=0; i<24; i++) {
        if (typeof json.heatmap.hour[i] !== 'undefined') {
          json.heatmap.hour[i] += 1; // non-zero
          heatmapHour.push({
            name: '' + i + ':00',
            value: json.heatmap.hour[i]
          });
          if (json.heatmap.hour[i] > highest) {
            highest = json.heatmap.hour[i];
            this.highestIndex = i;
          }
          if (json.heatmap.hour[i]/i <= lowest) {
            lowest = json.heatmap.hour[i]/i;
            this.lowestIndex = i;
          }
        } else {
          if (1/i <= lowest) {
            lowest = 1/i;
            this.lowestIndex = i;
          }
          heatmapHour.push({
            name: '' + i + ':00',
            value: 0
          });
        }
      }
      this.heatmapHour = heatmapHour;
      this.highestHeatmapHour = highest;
    } else {
      this.heatmapDay = {};
      this.heatmapHour = {};
      this.highestHeatmapHour = 0;
      this.highestIndex = 0;
      this.tabsIndex = 0;
      this.lowestIndex = null;
    }
    if (this.lowestIndex!=null && this.highestHeatmapHour>2) {
      this.bShowHeatmapTab = true;
    }

    // Load history
    this.playerService.loadPlayerHistory(this.world, this.id)
      .subscribe(
        (response) => this.savePlayerHistory(response),
        (error) => {
          this.loadingHistory = false;
          this.historyError = true;
        }
      )
  }

  private savePlayerHistory(history) {
    if (history.length == 0) {
      this.loadingHistory = false;
      this.historyError = true;
      return true;
    } else if (history.length > 30) {
      this.dayRange = '90';
    }
    this.playerHistoryJson = history;
    this.playerHistoryLastDay = this.getDateDiff(new Date(history[history.length-1].date), new Date());
    this.renderPlayerHistory();
  }
  
  private getDateDiff(dt1, dt2) {
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
  }

  private selectDayRange(val) {
    let from = 0;
    let to = 0;
    let max = this.playerHistoryLastDay;
    this.dayRange = val;
    if (val !== 'cust') {
      this.renderPlayerHistory(from, to);
    }
  }

  private renderPlayerHistory(from = null, to = null, addToday = false) {
    let json = this.playerHistoryJson;
    if (addToday || this.dayRange !== 'cust') {
    	let lastDay = new Date(json[0].date); // Last known history record
			lastDay.setDate(lastDay.getDate() + 1); // last day + 1 day = current points on record
      var playerData = [
        {
          'date' : moment(lastDay).format('YYYY-MM-DD'),
          'alliance_id' : this.alliance_id,
          'alliance_name' : this.alliance_name,
          'points' : this.points,
          'rank' : this.rank,
          'towns' : this.towns,
          'att' : this.att,
          'def' : this.def,
        }
      ];
      playerData = playerData.concat(json);
    } else {
      playerData = json;
    }

    switch (this.dayRange) {
      case '30':
        playerData = playerData.slice(0, 30);
        break;
      case '90':
        playerData = playerData.slice(0, 90);
        break;
      case 'cust':
        if (to > 0) {
          playerData = playerData.slice(from, (addToday ? to+1 : to));
        }
        break;
      case 'all':
      default:
        break;
    }

    this.playerHistoryData = playerData;

    // Build chart data
    let chartSeriesAtt = [];
    let chartSeriesDef = [];
    let chartSeriesPoints = [];
    for(var record in this.playerHistoryData) {
      // let date = moment(this.playerHistoryData[record].date).toDate();
      // let date = moment(this.playerHistoryData[record].date).format('D MMM');
      // let date = moment(this.playerHistoryData[record].date).format('YYYY-MM-DD');
      let date = new Date(this.playerHistoryData[record].date);
      chartSeriesAtt.unshift({
        'name' : date,
        'value' : this.playerHistoryData[record].att,
      });
      chartSeriesDef.unshift({
        'name' : date,
        'value' : this.playerHistoryData[record].def,
      });
      chartSeriesPoints.unshift({
        'name' : date,
        'value' : this.playerHistoryData[record].points,
      });
    }
    this.playerHistoryChart = [
      {
        'name': 'Points',
        'series': chartSeriesPoints,
      },
      {
        'name': 'Attack points',
        'series': chartSeriesAtt,
      },
      {
        'name': 'Defence points',
        'series': chartSeriesDef,
      },
    ];

    this.data_default = this.playerHistoryChart;
    this.data_default = [...this.data_default];

    this.loadingHistory = false;
    this.firstRun = false;
  }

  private renderAllianceChanges(json) {
    this.playerAllianceChanges = json.items;
    this.loadingChanges = false;
  }

  public showTownDialog(): void {
    let dialogRef = this.dialog.open(TownDialog, {
      // width: '70%',
      // height: '90%',
      autoFocus: false,
      data: {
        id: this.id,
        name: this.playerName,
        world: this.world
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  ngOnInit() {
  }

}

@Component({
  selector: 'town-dialog',
  templateUrl: 'town-dialog.html',
  providers: [PlayerService]
})
export class TownDialog {

  name: string;
  world: string;
  townData: any;
  loading: boolean = true;

  constructor(
    private playerService: PlayerService,
    public dialogRef: MatDialogRef<TownDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.name = data.name;
    this.world = data.world;
    this.playerService.getTowns(data.world, data.id)
      .subscribe(
        (response) => this.renderTownOutput(response),
        (error) => console.log(error)
      );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  renderTownOutput(json) {
    this.townData = json;
    this.loading = false;
  }

}
