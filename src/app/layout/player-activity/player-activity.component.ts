import {Component, Input, OnChanges, OnInit} from '@angular/core';

@Component({
  selector: 'app-player-activity',
  templateUrl: './player-activity.component.html',
  styleUrls: ['./player-activity.component.scss']
})
export class PlayerActivityComponent implements OnInit, OnChanges {

  @Input() hours_inactive = null;
  @Input() show_active = true;
  @Input() player_name = null;
  @Input() tooltip = 'material'; // can be one of 'off'|'basic'|'material'

  inactive_readable = '';

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.hours_inactive) {
      let hours_inactive = this.hours_inactive;
      let hours = hours_inactive % 24;
      let days = Math.floor((hours_inactive % 24 * 7) / 24);
      let weeks = Math.floor((hours_inactive % (24 * 30)) / (24 * 7));
      let months = Math.floor(hours_inactive / (24 * 30));
      let time_readable_parts = [];
      if (months > 0) {
        time_readable_parts.push(`${months} month${months > 1 ? 's' : ''}`);
      }
      if (weeks > 0) {
        time_readable_parts.push(`${weeks} week${weeks > 1 ? 's' : ''}`);
      }
      if (days > 0) {
        time_readable_parts.push(`${days} day${days > 1 ? 's' : ''}`);
      }
      time_readable_parts.push(`${hours} hour${hours == 1 ? '' : 's'} ago`);
      this.inactive_readable = time_readable_parts.join(', ');
    }
  }

}
