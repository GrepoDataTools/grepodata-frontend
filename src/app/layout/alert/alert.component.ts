import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {LocalCacheService} from '../../services/local-cache.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  providers: [LocalCacheService]
})
export class AlertComponent implements OnInit {
  @Input() type: 'error' | 'info' | 'success' | 'warning' | 'info2';
  @Input() title: string;
  @Input() dismissible: boolean = true;
  @Input() dismissPermanentId: string = '';
  @Input() showIcon: boolean = true;
  @Input() iconOverride: string = '';

  alertHidden = false;

  constructor() { }

  ngOnInit() {
    if (this.dismissPermanentId != '') {
      let local_status = this.getHiddenStatusFromCache(this.dismissPermanentId);
      if (local_status == 1) {
        // alert was previously dismissed. do not show
        this.alertHidden = true;
      }
    }
  }

  selectIcon() {
    if (this.iconOverride != '') {
      return this.iconOverride;
    }

    switch (this.type) {
      case 'error': return 'error_outline';
      case 'info': return 'help_outline';
      case 'info2': return 'help_outline';
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      default: return 'error_outline';
    }
  }

  hideAlert() {
    this.alertHidden = true;

    if (this.dismissPermanentId != '') {
      this.saveHiddenStatusToCache(this.dismissPermanentId);
    }
  }

  saveHiddenStatusToCache(alert_id) {
    LocalCacheService.set('alert_dismiss_' + alert_id, 1, 60 * 24 * 7);
  }

  getHiddenStatusFromCache(alert_id) {
    return LocalCacheService.get('alert_dismiss_' + alert_id);
  }
}
