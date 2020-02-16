import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-score-table',
  templateUrl: './score-table.component.html',
  styleUrls: ['./score-table.component.scss']
})
export class ScoreTableComponent implements OnInit {

  @Input()
  headers: Array<string>

  @Input()
  keys: Array<any>

  @Input()
  data: Array<Object>

  constructor() { }

  ngOnInit(): void {
    this.data.map(row => this.keys.concat(Object.keys(row)));
  }

}
