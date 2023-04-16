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
  colorScheme2 = {domain: ['rgba(24,188,156,0.3)','#18bc9c','rgba(240,112,87,0.3)','#f07057']};
  colorScheme3 = {
    domain: [
      '#18bc9c',
      '#f07057',
      '#334254',
      'rgba(24,188,156,0.5)',
      'rgba(240,112,87,0.5)',
      'rgba(51,66,84,0.5)'
    ]
  };
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
  indexer_error_rate_maxy = 10;
  warning_rate = [];
  script_version = [];
  total_reports = [];
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
          },
          {
            "name": "Commands Shared (+24hr)",
            "value": response.now.commands_count,
            "extra": response.now.commands_today,
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

    let last_count_inbox = 0;
    let last_count_forum = 0;
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
        last_count_inbox = record.count;
      }
      for(let i in data.indexer_num_forum_per_day.data) {
        let record = data.indexer_num_forum_per_day.data[i];
        chartF.unshift({
          'name' : new Date(record.date),
          'value' : record.count,
        });
        last_count_forum = record.count;
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

    if (data.indexer_error_rate) {
      // Build chart data
      let chart = [];
      for(let i in data.indexer_error_rate.data) {
        let record = data.indexer_error_rate.data[i];
        let date = new Date(record.date);
        // date.setDate(date.getDate() - 1);
        let value = (record.count / (last_count_inbox + last_count_forum)) * 100
        // let value = record.count
        chart.push({
          'name' : date,
          'value' : value,
          // 'value' : (record.count),
        });
        this.indexer_error_rate_maxy = Math.max(value, this.indexer_error_rate_maxy)
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

    if (data.indexer_stats_agg) {
      let chartNumIndex = [];
      let chartNumReports = [];
      let chartNumReportsShared = [];
      let chartNumReportsSharedNormalized = [];
      let chartNumCommands = [];
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
      let cmd_PerDay = [];
      let cmd_MovingAverage = [];
      let cmd_MovingAverageEntries = [];
      let cmd_usersPerDay = [];
      let cmd_usersPerWeek = [];
      let cmd_usersPerMonth = [];
      let cmd_teamsPerDay = [];
      let cmd_teamsPerWeek = [];
      let cmd_teamsPerMonth = [];
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
        if (record.commands_count > 0) {
          chartNumCommands.unshift({
            'name' : date,
            'value' : record.commands_count,
          });
        }

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

        if (record.commands_today > 0) {
          cmd_PerDay.unshift({
            'name' : date,
            'value' : record.commands_today,
          });
          cmd_MovingAverage.unshift(record.commands_today);
          if (cmd_MovingAverage.length > 7) {
            cmd_MovingAverage.pop();
            let moving_average = cmd_MovingAverage.reduce( ( p, c ) => p + c, 0 ) / cmd_MovingAverage.length;
            cmd_MovingAverageEntries.unshift({
              'name' : date,
              'value' : Math.floor(moving_average),
            });
          }
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

        if (record.commands_users_today>0) {
          cmd_usersPerDay.unshift({
            'name': date,
            'value': record.commands_users_today,
          });
        }
        if (record.commands_teams_today>0) {
          cmd_teamsPerDay.unshift({
            'name': date,
            'value': record.commands_teams_today,
          });
        }
        if (record.commands_users_week>0) {
          cmd_usersPerWeek.unshift({
            'name' : date,
            'value' : record.commands_users_week,
          });
        }
        if (record.commands_users_month>0) {
          cmd_usersPerMonth.unshift({
            'name' : date,
            'value' : record.commands_users_month,
          });
        }
        if (record.commands_teams_week>0) {
          cmd_teamsPerWeek.unshift({
            'name' : date,
            'value' : record.commands_teams_week,
          });
        }
        if (record.commands_teams_month>0) {
          cmd_teamsPerMonth.unshift({
            'name' : date,
            'value' : record.commands_teams_month,
          });
        }
      }
      this.total_users.push({
        'name': 'Number of teams',
        'series': chartNumIndex,
      });
      this.total_users.push({
        'name': 'Registered users',
        'series': chartNumUsers,
      });
      this.total_per_day.push({
        'name': 'Indexed reports',
        'series': newReportsPerDay,
      });
      this.total_per_day.push({
        'name': 'Indexed reports (MA7)',
        'series': newReportsMovingAverageEntries,
      });
      this.total_per_day.push({
        'name': 'Shared commands',
        'series': cmd_PerDay,
      });
      this.total_per_day.push({
        'name': 'Shared commands (MA7)',
        'series': cmd_MovingAverageEntries,
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
      this.users_per_day.push({
        'name': 'Daily active teams',
        'series': teamsPerDay,
      });
      this.users_per_day.push({
        'name': 'Weekly active teams',
        'series': teamsPerWeek,
      });
      this.users_per_day.push({
        'name': 'Monthly active teams',
        'series': teamsPerMonth,
      });
      this.indexes_per_day.push({
        'name': 'Daily active users (Ops)',
        'series': cmd_usersPerDay,
      });
      this.indexes_per_day.push({
        'name': 'Weekly active users (Ops)',
        'series': cmd_usersPerWeek,
      });
      this.indexes_per_day.push({
        'name': 'Monthly active users (Ops)',
        'series': cmd_usersPerMonth,
      });
      this.indexes_per_day.push({
        'name': 'Daily active teams (Ops)',
        'series': cmd_teamsPerDay,
      });
      this.indexes_per_day.push({
        'name': 'Weekly active teams (Ops)',
        'series': cmd_teamsPerWeek,
      });
      this.indexes_per_day.push({
        'name': 'Monthly active teams (Ops)',
        'series': cmd_teamsPerMonth,
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
        'name': 'Total Reports Shared',
        'series': chartNumReportsSharedNormalized,
      });
      this.total_reports.push({
        'name': 'Total Commands Shared',
        'series': chartNumCommands,
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
