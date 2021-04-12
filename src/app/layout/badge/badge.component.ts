import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent implements OnInit {
  @Input() type: 'error' | 'info' | 'warning' | 'success';
  @Input() text?: string;

  constructor() { }

  ngOnInit() {
  }

}
