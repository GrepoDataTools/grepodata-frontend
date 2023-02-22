import {Component, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() type: 'error' | 'info' | 'success' | 'warning';
  @Input() title: string;
  @Input() dismissible: boolean = true;
  @Input() showIcon: boolean = true;

  alertHidden = false;

  constructor() { }

  ngOnInit() {
  }

  selectIcon() {
    switch (this.type) {
      case 'error': return 'error_outline';
      case 'info': return 'help_outline';
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      default: return 'error_outline';
    }
  }

  hideAlert() {
    this.alertHidden = true;
  }
}
