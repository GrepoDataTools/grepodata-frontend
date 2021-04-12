import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import {AllianceService, MailListDialog} from './alliance.service';
import { ActivatedRoute, Router } from '@angular/router';
import { data_default } from '../player/data_default';
import { GoogleAnalyticsEventsService } from '../services/google-analytics-events.service';
import { CompareService } from '../compare/compare.service';
import { WorldService } from '../services/world.service';
import { Globals } from '../globals';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-alliance',
    templateUrl: './alliance.component.html',
    styleUrls: ['./alliance.component.scss'],
    providers: [AllianceService, WorldService],
})
export class AllianceComponent implements AfterViewInit {
    @ViewChild('infoTabs', { static: false }) infoTabs: ElementRef;

    // Chart vars
    data_default: any[];
    view: any[] = [1200, 320];
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = false;
    dayRange = 'all';
    animations = false;
    showXAxisLabel = false;
    xAxisLabel = 'Score';
    showYAxisLabel = false;
    yAxisLabel = 'Date';
    colorScheme = {
        domain: ['#18bc9c', '#f07057', '#2686c3', '#AAAAAA'],
    };
    autoScale = true;

    // Component vars
    allianceWars = [] as any;
    allianceInfoData = [] as any;
    allianceHistoryJson = [] as any;
    allianceHistoryData = [] as any;
    allianceHistoryChart = [] as any;
    allianceMembersData = [] as any;
    playerAllianceChanges = [] as any;
    allianceName = '';
    members = '';
    points = '';
    rank = '';
    towns = '';
    att = '';
    def = '';
    world = '';
    worldName = '';
    id = '';
    tabsIndex = 0;
    allianceHistoryLastDay = null;

    // Activity
    daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    hoursOfDay = Array(24);
    selectedDay = new Date().getDay();
    selectedHour = new Date().getHours();
    leastActiveDay = [];
    leastActiveHour = [];

    // comparisons
    comparedAlliances = [];
    compareOpened = false;

    // Loading
    firstRun = true;
    loadingWars = false;
    loadingMembers = false;
    loadingHistory = false;
    loadingInfo = false;
    notFound = false;
    historyError = false;
    membersError = false;
    selectionChanged = false;

    // Intel
    bShowIntel = false;
    hasIndex = false;

    constructor(
        private dialog: MatDialog,
        private elementRef: ElementRef,
        private cdr: ChangeDetectorRef,
        private globals: Globals,
        private allianceService: AllianceService,
        private worldService: WorldService,
        private router: Router,
        private route: ActivatedRoute,
        private compare: CompareService,
        public googleAnalyticsEventsService: GoogleAnalyticsEventsService
    ) {
        Object.assign(this, { data_default });
        if (window.innerWidth > 1000) {
            this.showLegend = true;
        }

        let noQueryParams = false;
        let noRouteParams = false;

        this.route.queryParams.subscribe((params) => {
            if (params.world != undefined && params.id != undefined) {
                this.load(params);
            } else {
                noQueryParams = true;
                if (noRouteParams) {
                    this.notFound = true;
                }
            }
        });

        this.route.params.subscribe((params) => {
            if (params.world != undefined && params.id != undefined) {
                this.router.navigate(['/alliance'], { queryParams: { world: params.world, id: params.id } });
            } else {
                noRouteParams = true;
                if (noQueryParams) {
                    this.notFound = true;
                }
            }
        });
    }

    ngAfterViewInit() {
        this.cdr.detach();
    }

    private load(params) {
        // Save params
        this.world = params['world'];
        this.worldService.getWorldInfo(this.world).then((response) => {
            this.worldName = response.name;
        });
        this.id = params['id'];

        // Reset
        this.allianceName = 'Loading..';
        this.notFound = false;
        this.historyError = false;
        this.membersError = false;
        this.selectionChanged = false;

        this.loadingWars = true;
        this.loadingMembers = true;
        this.loadingHistory = true;
        this.loadingInfo = true;
        this.hasIndex = false;
        this.bShowIntel = false;

        this.compareOpened = false;
        this.comparedAlliances = this.compare.getComparedAlliances(this.world);
        this.checkCompared();

        let that = this;
        setTimeout(function () {
            that.cdr.detectChanges();
            if (that.tabsIndex == 3) {
                that.bShowIntel = true;
            }
        }, 1);

        this.allianceService.loadAllianceInfo(params['world'], params['id']).subscribe(
            (response) => this.renderAllianceInfo(response, params['world'], params['id']),
            (error) => {
                this.notFound = true;
                this.cdr.detectChanges();
            },
            () => {
                // Load history
                this.allianceService.loadAllianceHistory(params['world'], params['id']).subscribe(
                    (response) => {
                        this.saveAllianceHistory(response);
                        this.loadMembers();
                    },
                    (error) => {
                        this.loadingHistory = false;
                        this.historyError = true;
                        this.loadMembers();
                    }
                );
            }
        );

        // this.allianceService.loadAllianceWars(params['world'], params['id']).subscribe(
        //   (response) => {
        //     this.allianceWars = response.data;
        //     this.loadingWars = false;
        //   },
        //   (error) => {
        //     this.loadingWars = false;
        //   }
        // );

        // Check if intel is available
        let active_intel: any = this.globals.get_active_intel();
        if (active_intel !== false && this.world in active_intel) {
            this.hasIndex = true;
        }
    }

    activeMemberTabChange(event) {
        switch (event.index) {
            case 1:
                this.allianceMembersData.members.sort((a, b) => (a.att_rank > b.att_rank ? 1 : -1));
                break;
            case 2:
                this.allianceMembersData.members.sort((a, b) => (a.def_rank > b.def_rank ? 1 : -1));
                break;
            default:
                this.allianceMembersData.members.sort((a, b) => (a.rank > b.rank ? 1 : -1));
        }
        this.cdr.detectChanges();
        setTimeout((_) => this.cdr.detectChanges(), 250);
    }

    onTabClick(event: MatTabChangeEvent) {
        if (event.index == 3) {
            this.bShowIntel = true;
        }
        this.tabsIndex = event.index;
        this.cdr.detectChanges();
        setTimeout((_) => this.cdr.detectChanges(), 250);
        setTimeout((_) => this.cdr.detectChanges(), 500);
    }

    openIntelTab() {
        this.tabsIndex = 3;
        this.bShowIntel = true;
        this.cdr.detectChanges();
        if (this.infoTabs && this.showLegend == false) {
            this.infoTabs.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    addToCompare() {
        this.compareOpened = true;
        this.compare.addAlliance(this.id, this.allianceName, this.world);
        this.comparedAlliances = this.compare.getComparedAlliances(this.world);
        this.cdr.detectChanges();
    }

    checkCompared() {
        this.compareOpened = false;
        for (let i of this.comparedAlliances) {
            if (i.id === this.id) {
                this.compareOpened = true;
            }
        }
    }

    removeFromCompare(id, world) {
        this.compare.removeAlliance(id, world);
        this.checkCompared();
        this.cdr.detectChanges();
    }

    renderPlayerActivity($event) {
        if (!this.loadingMembers && 'members' in this.allianceMembersData) {
            let activityNowHour = [];
            let activityNowDay = [];
            this.allianceMembersData.members.forEach((i) => {
                if (i.heatmap && i.heatmap.hour && '' + this.selectedHour in i.heatmap.hour) {
                    activityNowHour.push({
                        id: i.id,
                        name: i.name,
                        rank: i.rank,
                        value: 1 + i.heatmap.hour[this.selectedHour],
                    });
                } else {
                    activityNowHour.push({ id: i.id, name: i.name, rank: i.rank, value: 1, label: 0 });
                }
                if (i.heatmap && i.heatmap.day && '' + this.selectedDay in i.heatmap.day) {
                    activityNowDay.push({
                        id: i.id,
                        name: i.name,
                        rank: i.rank,
                        value: 1 + i.heatmap.day[this.selectedDay],
                    });
                } else {
                    activityNowDay.push({ id: i.id, name: i.name, rank: i.rank, value: 1, label: 0 });
                }
            });
            activityNowHour.sort((a, b) =>
                a.value > b.value ? 1 : a.value === b.value ? (a.rank > b.rank ? 1 : -1) : -1
            );
            activityNowDay.sort((a, b) =>
                a.value > b.value ? 1 : a.value === b.value ? (a.rank > b.rank ? 1 : -1) : -1
            );
            this.leastActiveHour = activityNowHour;
            this.leastActiveDay = activityNowDay;
            this.cdr.detectChanges();
            setTimeout((_) => this.cdr.detectChanges(), 250);
            setTimeout((_) => this.cdr.detectChanges(), 500);
        }
    }

    onPlayerClick($event) {
        if (!this.loadingMembers && 'members' in this.allianceMembersData) {
            let player = this.allianceMembersData.members.filter((obj) => obj.name === $event.name);
            this.router.navigate(['/player'], { queryParams: { world: this.world, id: player[0].id } });
            this.cdr.detectChanges();
            setTimeout((_) => this.cdr.detectChanges(), 250);
        }
    }

    private renderAllianceInfo(json, world, id) {
        this.allianceInfoData = json;
        this.allianceName = json.name;
        this.members = json.members;
        this.points = json.points;
        this.rank = json.rank;
        this.towns = json.towns;
        this.att = json.att;
        this.def = json.def;
        this.world = json.world;
        this.loadingInfo = false;
        this.cdr.detectChanges();
    }

    private saveAllianceHistory(history) {
        if (history.length == 0) {
            this.loadingHistory = false;
            this.historyError = true;
            return true;
        }
        this.allianceHistoryJson = history;
        this.allianceHistoryLastDay = this.getDateDiff(new Date(history[history.length - 1].date), new Date());
        this.renderAllianceHistory();
    }

    private getDateDiff(dt1, dt2) {
        return Math.floor(
            (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
                Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
                (1000 * 60 * 60 * 24)
        );
    }

    selectDayRange(val) {
        let from = 0;
        let to = 0;
        let max = this.allianceHistoryLastDay;
        this.dayRange = val;
        this.cdr.detectChanges();
        if (val !== 'cust') {
            this.renderAllianceHistory(from, to);
        }
    }

    private renderAllianceHistory(from = null, to = null, addToday = false) {
        try {
            let json = this.allianceHistoryJson;
            if (addToday || this.dayRange !== 'cust') {
                // Add todays record
                var allianceData = [
                    {
                        date: new Date(),
                        alliance_id: this.id,
                        points: this.points,
                        rank: this.rank,
                        towns: this.towns,
                        att: this.att,
                        def: this.def,
                    },
                ];
                allianceData = allianceData.concat(json);
            } else {
                allianceData = json;
            }

            if (json.length < 30) {
                this.dayRange = '30';
            }

            switch (this.dayRange) {
                case '30':
                    allianceData = allianceData.slice(0, 30);
                    break;
                case '90':
                    allianceData = allianceData.slice(0, 90);
                    break;
                case 'all':
                default:
                    break;
            }

            this.allianceHistoryData = allianceData;

            // Build chart data
            let chartSeriesAtt = [];
            let chartSeriesDef = [];
            let chartSeriesPoints = [];
            for (var record in this.allianceHistoryData) {
                // let date = moment(this.allianceHistoryData[record].date).format('D MMM');
                let date = new Date(this.allianceHistoryData[record].date);
                chartSeriesAtt.unshift({
                    name: date,
                    value: this.allianceHistoryData[record].att,
                });
                chartSeriesDef.unshift({
                    name: date,
                    value: this.allianceHistoryData[record].def,
                });
                chartSeriesPoints.unshift({
                    name: date,
                    value: this.allianceHistoryData[record].points,
                });
            }
            this.allianceHistoryChart = [
                {
                    name: 'Points',
                    series: chartSeriesPoints,
                },
                {
                    name: 'Attack points',
                    series: chartSeriesAtt,
                },
                {
                    name: 'Defence points',
                    series: chartSeriesDef,
                },
            ];

            this.data_default = this.allianceHistoryChart;
            this.data_default = [...this.data_default];

            this.loadingHistory = false;
            this.firstRun = false;
            this.cdr.detectChanges();
        } catch (e) {
            console.log(e);
        }
    }

    openMailListPopup () {
      let alliance_data = {};
      if (!this.loadingMembers && !this.membersError && this.allianceMembersData.members.length > 0) {
        alliance_data = {
          id: this.id,
          name: this.allianceName,
          members: this.allianceMembersData.members.map(i => i.name)
        }
      }

      let dialogRef = this.dialog.open(MailListDialog, {
        // width: '70%',
        // height: '85%',
        autoFocus: false,
        data: {
          world: this.world,
          alliance: alliance_data
        }
      });

      dialogRef.afterClosed().subscribe(result => {});
    }

    private loadMembers() {
        this.allianceService.loadAllianceMembers(this.world, this.id).subscribe(
            (response) => {
                this.renderAllianceMembers(response);
                this.loadingMembers = false;
                this.cdr.detectChanges();
                this.loadChanges();
                this.renderPlayerActivity(null);
            },
            (error) => {
                this.membersError = true;
                this.loadingMembers = false;
                this.cdr.detectChanges();
                this.loadChanges();
            }
        );
    }

    private loadChanges() {
        this.allianceService.loadAllianceChanges(this.world, this.id).subscribe((response) => {
            this.renderAllianceChanges(response);
        });
    }

    private renderAllianceMembers(json) {
        this.allianceMembersData = json;
        this.cdr.detectChanges();
    }

    private renderAllianceChanges(json) {
        this.playerAllianceChanges = json.items;
        this.cdr.detectChanges();
    }
}
