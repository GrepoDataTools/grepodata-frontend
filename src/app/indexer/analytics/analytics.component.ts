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
  autoScale = true;
  timeline = true;
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
  index_types_agg = [];
  index_world_bins = [];

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
  }

  private renderIndexStats(data) {
    console.log(data);
    if (data == null) {
      this.error = true;
    }

    if (data.indexer_num_reports_per_day) {
      // Build chart data
      let chart = [];
      for(let i in data.indexer_num_reports_per_day.data) {
        let record = data.indexer_num_reports_per_day.data[i];
        chart.unshift({
          'name' : new Date(record.date),
          'value' : record.count,
        });
      }
      this.total_per_day.push({
        'name': 'New reports',
        'series': chart,
      });
    }

    if (data.indexer_num_unique_uploaders_per_day) {
      // Build chart data
      let chart = [];
      for(let i in data.indexer_num_unique_uploaders_per_day.data) {
        let record = data.indexer_num_unique_uploaders_per_day.data[i];
        chart.unshift({
          'name' : new Date(record.date),
          'value' : record.count,
        });
      }
      this.users_per_day.push({
        'name': 'Unique users',
        'series': chart,
      });
    }

    if (data.indexer_num_unique_indexes_per_day) {
      // Build chart data
      let chart = [];
      for(let i in data.indexer_num_unique_indexes_per_day.data) {
        let record = data.indexer_num_unique_indexes_per_day.data[i];
        chart.unshift({
          'name' : new Date(record.date),
          'value' : record.count,
        });
      }
      this.indexes_per_day.push({
        'name': 'Active teams',
        'series': chart,
      });
    }

    if (data.indexer_error_rate) {
      // Build chart data
      let chart = [];
      for(let i in data.indexer_error_rate.data) {
        let record = data.indexer_error_rate.data[i];
        chart.unshift({
          'name' : new Date(record.date),
          'value' : record.count,
        });
      }
      this.indexer_error_rate.push({
        'name': 'Report parsing errors',
        'series': chart,
      });
    }

    if (data.indexer_generic_warning_rate) {
      // Build chart data
      let chart = [];
      for(let i in data.indexer_generic_warning_rate.data) {
        let record = data.indexer_generic_warning_rate.data[i];
        chart.unshift({
          'name' : new Date(record.date),
          'value' : record.count,
        });
      }
      this.warning_rate.push({
        'name': 'Logger warnings',
        'series': chart,
      });
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
      let chartTypeSpy = [];
      let chartTypeAtt = [];
      let chartTypeDef = [];
      for(let i in data.indexer_stats_agg.data) {
        let record = data.indexer_stats_agg.data[i];
        let date = new Date(record.created_at);
        chartNumIndex.unshift({
          'name' : date,
          'value' : record.index_count,
        });
        chartNumReports.unshift({
          'name' : date,
          'value' : record.reports,
        });
        chartTypeSpy.unshift({
          'name' : date,
          'value' : record.spy_count,
        });
        chartTypeAtt.unshift({
          'name' : date,
          'value' : record.att_count,
        });
        chartTypeDef.unshift({
          'name' : date,
          'value' : record.def_count,
        });
      }
      this.total_indexes.push({
        'name': 'Number of teams',
        'series': chartNumIndex,
      });
      this.total_reports.push({
        'name': 'Active intel records',
        'series': chartNumReports,
      });
      this.index_types_agg.push({
        'name': 'Espionage reports',
        'series': chartTypeSpy,
      });
      this.index_types_agg.push({
        'name': 'Attack reports',
        'series': chartTypeAtt,
      });
      this.index_types_agg.push({
        'name': 'Support reports',
        'series': chartTypeDef,
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
