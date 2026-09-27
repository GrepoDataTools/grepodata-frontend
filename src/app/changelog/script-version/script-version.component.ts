import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-script-version',
  templateUrl: './script-version.component.html',
  styleUrls: ['./script-version.component.scss']
})
export class ScriptVersionComponent implements OnInit {
  @Input() details_hidden: boolean = true;
  @Input() collapsable: boolean = true;
  @Input() new: boolean = false;
  @Input() title: string;
  @Input() github_url: string;

  constructor() { }

  ngOnInit(): void {
  }

  get dateLabel(): string {
    const date = (this.title || '').split(' - ')[0];
    const parsed = moment(date, 'DD-MM-YYYY', true);
    return parsed.isValid() ? parsed.format('D MMM YYYY') : date;
  }

  get heading(): string {
    const parts = (this.title || '').split(' - ');
    return parts.length > 1 ? parts.slice(1).join(' - ') : this.title;
  }

}
