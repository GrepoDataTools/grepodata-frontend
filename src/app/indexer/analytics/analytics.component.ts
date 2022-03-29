import { Component, OnInit } from '@angular/core';
import {LocalCacheService} from '../../services/local-cache.service';
import {IndexerService} from '../indexer.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  providers: [IndexerService]
})
export class AnalyticsComponent implements OnInit {

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
      '#334254',
      '#2686c3',
      '#4CAF50',
      '#FFEB3B',
      '#673AB7',
      '#F44336']
  };
  colorScheme2 = {domain: ['#18bc9c','#334254']};
  autoScale = true;
  // timeline = true; // broken as of ngx-charts@17.0
  timeline = false;
  animations = false;

  onSelect(event) {
    console.log(event);
  }

  loading_info = true;
  loading_index = true;
  error = false;

  total_per_day = [];
  users_per_day = [];
  indexes_per_day = [];
  report_type_per_day = [];
  indexer_error_rate = [];
  warning_rate = [];
  script_version = [];
  total_indexes = [];
  total_reports = [];
  total_shared_relative = [];
  total_users = [];
  index_world_bins = [];
  hourly_reports = [];

  single: any[];
  cardColor: string = '#232837';
  cards_data: any[];

  constructor(
    private indexerService: IndexerService
  ) { }

  ngOnInit() {
    this.load()
  }

  private load() {
    // Load town intel
    this.indexerService.loadStatsIndexer()
      .subscribe(
        (response) => this.renderIndexStats(response),
        (error) => this.renderIndexStats(null)
      );

    // Cards data
    this.indexerService.getStats().subscribe(
      (response : any) => {
        this.cards_data = [
          {
            "name": "Registered Users (+24hr)",
            "value": response.now.user_count,
            "extra": response.now.user_count - response.yesterday.user_count,
          },
          {
            "name": "Teams Created (+24hr)",
            "value": response.now.index_count,
            "extra": response.now.index_count - response.yesterday.index_count,
          },
          {
            "name": "Reports Indexed (+24hr)",
            "value": response.now.reports,
            "extra": response.now.reports - response.yesterday.reports,
          },
          {
            "name": "Unique Towns (+24hr)",
            "value": response.now.town_count,
            "extra": response.now.town_count - response.yesterday.town_count,
          }
        ]
      },
      (error) => {}
    );
  }

  formatStatValue(event) {
    if ('data' in event && 'extra' in event.data && event.data.extra!==null) {
      return `${event.value.toLocaleString()} (+${event.data.extra.toLocaleString()})`;
    } else {
      return event.value.toLocaleString();
    }
  }

  private renderIndexStats(data) {
    console.log(data);
    if (data == null) {
      this.error = true;
    }

    if (data.indexer_error_rate) {
      // Build chart data
      let chart = [];
      for(let i in data.indexer_error_rate.data) {
        let record = data.indexer_error_rate.data[i];
        let date = new Date(record.date);
        // date.setDate(date.getDate() - 1);
        chart.push({
          'name' : date,
          'value' : record.count,
        });
      }
      this.indexer_error_rate = chart;
    }

    if (data.indexer_generic_warning_rate) {
      // Build chart data
      let chart = [];
      for(let i in data.indexer_generic_warning_rate.data) {
        let record = data.indexer_generic_warning_rate.data[i];
        let date = new Date(record.date);
        // date.setDate(date.getDate() - 1);
        chart.unshift({
          'name' : date,
          'value' : record.count,
        });
      }
      this.warning_rate.push({
        'name': 'Logger warnings',
        'series': chart,
      });
    }

    if (data.indexer_hourly_new_reports) {
      let chart = [];
      let chartusers = [];
      for(let i in data.indexer_hourly_new_reports.data) {
        let record = data.indexer_hourly_new_reports.data[i];
        let date = new Date(record.datehour);
        chart.push({
          'name' : date,
          'value' : record.count,
        });
        chartusers.push({
          'name' : date,
          'value' : record.usercount,
        });
      }
      this.hourly_reports.push({
        'name': 'Hourly new reports',
        'series': chart,
      });
      this.hourly_reports.push({
        'name': 'Hourly active users',
        'series': chartusers,
      });
      console.log(this.hourly_reports);
    }

    if (data.indexer_num_inbox_per_day && data.indexer_num_forum_per_day) {
      // Build chart data
      let chartI = [];
      let chartF = [];
      for(let i in data.indexer_num_inbox_per_day.data) {
        let record = data.indexer_num_inbox_per_day.data[i];
        chartI.unshift({
          'name' : new Date(record.date),
          'value' : record.count,
        });
      }
      for(let i in data.indexer_num_forum_per_day.data) {
        let record = data.indexer_num_forum_per_day.data[i];
        chartF.unshift({
          'name' : new Date(record.date),
          'value' : record.count,
        });
      }
      this.report_type_per_day.push({
        'name': 'Inbox reports',
        'series': chartI,
      });
      this.report_type_per_day.push({
        'name': 'Forum reports',
        'series': chartF,
      });
    }

    if (data.indexer_stats_agg) {
      let chartNumIndex = [];
      let chartNumReports = [];
      let chartNumReportsShared = [];
      let chartNumReportsSharedNormalized = [];
      let chartNumReportsSharedNormalizedRelative = [];
      let chartNumUsers = [];
      let newReportsPerDay = [];
      let newReportsMovingAverage = [];
      let newReportsMovingAverageEntries = [];
      let usersPerDay = [];
      let usersPerWeek = [];
      let usersPerMonth = [];
      let teamsPerDay = [];
      let teamsPerWeek = [];
      let teamsPerMonth = [];
      for(let i in data.indexer_stats_agg.data) {
        let record = data.indexer_stats_agg.data[i];
        let date = new Date(record.created_at);
        // date.setDate(date.getDate() - 1);
        chartNumIndex.unshift({
          'name' : date,
          'value' : record.index_count,
        });
        chartNumReports.unshift({
          'name' : date,
          'value' : record.reports,
        });
        chartNumReportsShared.unshift({
          'name' : date,
          'value' : record.shared_count,
        });
        chartNumReportsSharedNormalized.unshift({
          'name' : date,
          'value' : record.shared_count - record.reports,
        });

        // Average percentage of report sharing
        chartNumReportsSharedNormalizedRelative.unshift({
          'name' : date,
          'value' : (((record.shared_count - record.reports) / record.reports) * 100).toFixed(2),
        });

        chartNumUsers.unshift({
          'name' : date,
          'value' : record.user_count,
        });

        newReportsPerDay.unshift({
          'name' : date,
          'value' : record.reports_today,
        });
        newReportsMovingAverage.unshift(record.reports_today);
        if (newReportsMovingAverage.length > 7) {
          newReportsMovingAverage.pop();
          let moving_average = newReportsMovingAverage.reduce( ( p, c ) => p + c, 0 ) / newReportsMovingAverage.length;
          newReportsMovingAverageEntries.unshift({
            'name' : date,
            'value' : Math.floor(moving_average),
          });
        }

        usersPerDay.unshift({
          'name' : date,
          'value' : record.users_today,
        });
        teamsPerDay.unshift({
          'name' : date,
          'value' : record.teams_today,
        });
        if (record.users_week>0) {
          usersPerWeek.unshift({
            'name' : date,
            'value' : record.users_week,
          });
        }
        if (record.users_month>0) {
          usersPerMonth.unshift({
            'name' : date,
            'value' : record.users_month,
          });
        }
        if (record.teams_week>0) {
          teamsPerWeek.unshift({
            'name' : date,
            'value' : record.teams_week,
          });
        }
        if (record.teams_month>0) {
          teamsPerMonth.unshift({
            'name' : date,
            'value' : record.teams_month,
          });
        }
      }
      this.total_indexes.push({
        'name': 'Number of teams',
        'series': chartNumIndex,
      });
      this.total_users.push({
        'name': 'Registered users',
        'series': chartNumUsers,
      });
      this.total_per_day.push({
        'name': 'Daily new reports',
        'series': newReportsPerDay,
      });
      this.total_per_day.push({
        'name': '7-day moving average',
        'series': newReportsMovingAverageEntries,
      });
      this.users_per_day.push({
        'name': 'Daily active users',
        'series': usersPerDay,
      });
      this.users_per_day.push({
        'name': 'Weekly active users',
        'series': usersPerWeek,
      });
      this.users_per_day.push({
        'name': 'Monthly active users',
        'series': usersPerMonth,
      });
      this.indexes_per_day.push({
        'name': 'Daily active teams',
        'series': teamsPerDay,
      });
      this.indexes_per_day.push({
        'name': 'Weekly active teams',
        'series': teamsPerWeek,
      });
      this.indexes_per_day.push({
        'name': 'Monthly active teams',
        'series': teamsPerMonth,
      });
      this.total_reports.push({
        'name': 'Total Unique Reports',
        'series': chartNumReports,
      });
      // this.total_reports.push({
      //   'name': 'Total Shared',
      //   'series': chartNumReportsShared,
      // });
      this.total_reports.push({
        'name': 'Total Shared',
        'series': chartNumReportsSharedNormalized,
      });
      this.total_shared_relative.push({
        'name': 'Report Sharing Relative %',
        'series': chartNumReportsSharedNormalizedRelative,
      });
    }

    if (data.indexer_script_version) {
      let series = {};
      for(let i in data.indexer_script_version.data) {
        let record = data.indexer_script_version.data[i];
        let date = new Date(record.date);
        for (let key in record) {
          if (key != 'date') {
            if (!(key in series)) {
              series[key] = [];
            }
            series[key].push({'name': date, 'value': record[key]});
          }
        }
      }

      for (let version in series) {
        this.script_version.push({
          'name': version,
          'series': series[version],
        });
      }
    }

    if (data.indexer_active_server_bins) {
      this.index_world_bins = [];
      for(let i in data.indexer_active_server_bins.data) {
        let record = data.indexer_active_server_bins.data[i];
        this.index_world_bins.push({'name': record.country, 'value': record.count});
      }
      this.index_world_bins.reverse();
    }

    this.loading_index = false
  }
}
