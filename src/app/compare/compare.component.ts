import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AllianceService} from "../alliance/alliance.service";
import {PlayerService} from "../player/player.service";
import {CompareService} from "./compare.service";
import {WorldService} from "../services/world.service";
import {Subject} from "rxjs";
import {GoogleAnalyticsEventsService} from "../services/google-analytics-events.service";

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss'],
  providers: [AllianceService, PlayerService, WorldService]
})
export class CompareComponent implements OnInit {

  // Chart vars
  view: any[] = [1200, 320];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = false;
  xAxisLabel = 'Score';
  showYAxisLabel = false;
  yAxisLabel = 'Date';
  colorScheme = {
    domain: [
      '#18bc9c',
      '#f07057',
      '#2686c3',
      '#4CAF50',
      '#FFEB3B',
      '#334254',
      '#673AB7',
      '#F44336']
  };
  autoScale = true;
  timeline = true;
  animations = false;

  onSelect(event) {
    console.log(event);
  }

  //data
  firstRun = true;
  infoData = [];

  loadingHistory = false;
  data_points: any[];
  data_att: any[];
  data_def: any[];
  data_towns: any[];
  pointsChart = [];
  attChart = [];
  defChart = [];
  townChart = [];

  loadingStats = false;
  fightGauge = [];
  attGauge = [];
  defGauge = [];
  polarGauge = [];
  polarGaugeAbs = [];
  data_fight_gauge: any[];
  data_att_gauge: any[];
  data_def_gauge: any[];
  polar_chart_data: any[];
  polar_chart_data_abs: any[];

  //private vars
  comparedPlayers : any = [];
  comparedAlliances : any = [];
  playerWorlds = [];
  allianceWorlds = [];
  comparingPlayers = false;
  comparingAlliances = false;

  realWorlds : any;
  playerWorld = '';
  allianceWorld = '';

  math = Math;

  public showSearch$: any = new Subject();

  constructor(
    private allianceService: AllianceService,
    private playerService: PlayerService,
    public compare: CompareService,
    private worldService: WorldService,
    private router: Router,
    private route: ActivatedRoute,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {

    this.comparedPlayers = this.compare.getAllPlayers();
    this.comparedAlliances = this.compare.getAllAlliances();

    this.loadWorlds(true);

    compare.update$.subscribe(value => this.loadWorlds(false));
    compare.doComparePlayer$.subscribe(value => this.doComparePlayers(this.playerWorld));
    compare.doCompareAlliance$.subscribe(value => this.doCompareAlliances(this.playerWorld));

    this.route.params.subscribe( params => {
      if (
        params['type']!==undefined && params['type']!==null &&
        params['world']!==undefined && params['world']!==null) {
        if (params['type'] == 'player' && this.comparedPlayers !== undefined && Object.keys(this.comparedPlayers).length > 0) {
          this.playerWorld = params['world'];
          this.doComparePlayers(this.playerWorld);
        } else if (params['type'] == 'alliance' && this.comparedAlliances !== undefined && Object.keys(this.comparedAlliances).length > 0) {
          this.allianceWorld = params['world'];
          this.doCompareAlliances(this.allianceWorld);
        }
      } else {
        if (this.playerWorld != undefined && this.playerWorld != '') {
          this.doComparePlayers(this.playerWorld);
        } else if (this.allianceWorld != undefined && this.allianceWorld != '') {
          this.doCompareAlliances(this.allianceWorld);
        }
      }
    });
  }

  ngOnInit() {
  }

  loadWorlds(doCompare) {
    this.worldService.getWorlds().then(response => {
      this.playerWorlds = [];
      this.allianceWorlds = [];
      this.realWorlds = response;
      let playerWorldExists = false;
      Object.keys(this.comparedPlayers).forEach(key => {
        if (this.playerWorld === key) playerWorldExists = true;
        Object.keys(this.realWorlds).forEach(server => {
          Object.keys(this.realWorlds[server].worlds).forEach(world => {
            if (key === this.realWorlds[server].worlds[world].id) {
              this.playerWorlds.push(this.realWorlds[server].worlds[world]);
            }
          })
        })
      });
      let allianceWorldExists = false;
      Object.keys(this.comparedAlliances).forEach(key => {
        if (this.allianceWorld === key) allianceWorldExists = true;
        Object.keys(this.realWorlds).forEach(server => {
          Object.keys(this.realWorlds[server].worlds).forEach(world => {
            if (key === this.realWorlds[server].worlds[world].id) {
              this.allianceWorlds.push(this.realWorlds[server].worlds[world]);
            }
          })
        })
      });
      if (this.playerWorlds.length > 0 && (this.playerWorld == ''||!playerWorldExists)) {
        this.playerWorld = this.playerWorlds[0].id;
      }
      if (this.allianceWorlds.length > 0 && (this.allianceWorld == ''||!allianceWorldExists)) {
        this.allianceWorld = this.allianceWorlds[0].id;
      }

      if (doCompare && this.firstRun && !this.comparingPlayers && !this.comparingAlliances) {
        if (this.playerWorld != undefined && this.playerWorld != '') {
          this.doComparePlayers(this.playerWorld);
        } else if (this.allianceWorld != undefined && this.allianceWorld != '') {
          this.doCompareAlliances(this.allianceWorld);
        }
      }
    });
  }

  doComparePlayers(world) {
    this.compare.doHideSearch$.next();
    if (world != undefined && world != '') {
      this.playerWorld = world;
    }
    if (this.playerWorld != undefined && this.playerWorld != '' && this.comparedPlayers[this.playerWorld] != undefined) {
      this.comparingPlayers = true;
      this.comparingAlliances = false;
      this.loadingStats = true;
      this.loadingHistory = true;
      this.infoData = [];
      this.pointsChart = [];
      this.attChart = [];
      this.defChart = [];
      this.townChart = [];
      this.fightGauge = [];
      this.attGauge = [];
      this.defGauge = [];

      Object.keys(this.comparedPlayers[this.playerWorld]).forEach(player => {
        this.playerService.loadPlayerHistory(this.playerWorld, this.comparedPlayers[this.playerWorld][player].id)
          .subscribe(
            (response) => this.renderHistoryData(response, this.comparedPlayers[this.playerWorld][player].name),
            (error) => console.log(error)
          )
        this.playerService.loadPlayerInfo(this.playerWorld, this.comparedPlayers[this.playerWorld][player].id, true)
          .subscribe(
            (response) => this.renderInfoData(response, this.comparedPlayers[this.playerWorld][player].name),
            (error) => console.log(error)
          )
      });

      try {
        this.googleAnalyticsEventsService.emitEvent("compare", "doCompPlayers", "doCompPlayers", 1);
      } catch (e) {}
    }
  }

  doCompareAlliances(world) {
    this.compare.doHideSearch$.next();
    if (world != undefined && world != '') {
      this.allianceWorld = world;
    }
    if (this.allianceWorld != undefined && this.allianceWorld != '' && this.comparedAlliances[this.allianceWorld] != undefined) {
      this.comparingAlliances = true;
      this.comparingPlayers = false;
      this.loadingStats = true;
      this.loadingHistory = true;
      this.infoData = [];
      this.pointsChart = [];
      this.attChart = [];
      this.defChart = [];
      this.townChart = [];
      this.fightGauge = [];
      this.attGauge = [];
      this.defGauge = [];

      Object.keys(this.comparedAlliances[this.allianceWorld]).forEach(alliance => {
        this.allianceService.loadAllianceHistory(this.allianceWorld, this.comparedAlliances[this.allianceWorld][alliance].id)
          .subscribe(
            (response) => this.renderHistoryData(response, this.comparedAlliances[this.allianceWorld][alliance].name),
            (error) => console.log(error)
          )
        this.allianceService.loadAllianceInfo(this.allianceWorld, this.comparedAlliances[this.allianceWorld][alliance].id)
          .subscribe(
            (response) => this.renderInfoData(response, this.comparedAlliances[this.allianceWorld][alliance].name),
            (error) => console.log(error)
          )
      });

      try {
        this.googleAnalyticsEventsService.emitEvent("compare", "doCompAlliances", "doCompAlliances", 1);
      } catch (e) {}
    }
  }

  private renderHistoryData(json, unit) {
    let unitHistoryData = json;

    // Build chart data
    let chartAtt = [];
    let chartDef = [];
    let chartPoints = [];
    let chartTowns = [];
    for(var record in unitHistoryData) {
      let date = new Date(unitHistoryData[record].date);
      chartAtt.unshift({
        'name' : date,
        'value' : unitHistoryData[record].att,
      });
      chartDef.unshift({
        'name' : date,
        'value' : unitHistoryData[record].def,
      });
      chartPoints.unshift({
        'name' : date,
        'value' : unitHistoryData[record].points,
      });
      chartTowns.unshift({
        'name' : date,
        'value' : unitHistoryData[record].towns,
      });
    }
    this.pointsChart.push({
        'name': unit,
        'series': chartPoints,
      });
    this.pointsChart.sort(this.sortCompare);
    this.data_points = this.pointsChart;
    this.data_points = [...this.data_points];

    this.attChart.push({
      'name': unit,
      'series': chartAtt,
    });
    this.attChart.sort(this.sortCompare);
    this.data_att = this.attChart;
    this.data_att = [...this.data_att];

    this.defChart.push({
      'name': unit,
      'series': chartDef,
    });
    this.defChart.sort(this.sortCompare);
    this.data_def = this.defChart;
    this.data_def = [...this.data_def];

    this.townChart.push({
      'name': unit,
      'series': chartTowns,
    });
    this.townChart.sort(this.sortCompare);
    this.data_towns = this.townChart;
    this.data_towns = [...this.data_towns];

    this.firstRun = false;
    this.loadingHistory = false;
  }

  renderInfoData(json, unit){
    this.infoData.push(json);

    this.fightGauge.push({
      'name': unit,
      'value': json.att + json.def
    });
    this.fightGauge.sort(this.sortCompare);
    this.data_fight_gauge = this.fightGauge;
    this.data_fight_gauge = [...this.data_fight_gauge];

    this.attGauge.push({
      'name': unit,
      'value': json.att
    });
    this.attGauge.sort(this.sortCompare);
    this.data_att_gauge = this.attGauge;
    this.data_att_gauge = [...this.data_att_gauge];

    this.defGauge.push({
      'name': unit,
      'value': json.def
    });
    this.defGauge.sort(this.sortCompare);
    this.data_def_gauge = this.defGauge;
    this.data_def_gauge = [...this.data_def_gauge];

    this.polarGauge.push(
      {
        'name': unit,
        'series': [
          {
            'name': ' APPT',
            'value': Math.floor(json.att / json.towns)
          },
          {
            'name': ' DPPT',
            'value': Math.floor(json.def / json.towns)
          },
          {
            'name': ' TPPT',
            'value': Math.floor(json.points / json.towns)
          }
        ]
      }
    );
    this.polarGauge.sort(this.sortCompare);
    this.polar_chart_data = this.polarGauge;
    this.polar_chart_data = [...this.polar_chart_data];


    this.polarGaugeAbs.push(
      {
        'name': unit,
        'series': [
          {
            'name': ' Attacking',
            'value': json.att
          },
          {
            'name': ' Defending',
            'value': json.def
          },
          {
            'name': ' Town Points',
            'value': json.points
          }
        ]
      }
    );
    this.polarGaugeAbs.sort(this.sortCompare);
    this.polar_chart_data_abs = this.polarGaugeAbs;
    this.polar_chart_data_abs = [...this.polar_chart_data_abs];

    this.loadingStats = false;
  }

  sortCompare = function (a, b) {
    return a.name.localeCompare(b.name);
  }

  removePlayer(id, world){
    this.compare.removePlayer(id, world);
    this.doComparePlayers(world);
  }

  removeAlliance(id, world){
    this.compare.removeAlliance(id, world);
    this.doCompareAlliances(world);
  }

}
