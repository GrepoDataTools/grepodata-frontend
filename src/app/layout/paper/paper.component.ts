import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-paper',
  templateUrl: './paper.component.html',
  styleUrls: ['./paper.component.scss']
})
export class PaperComponent implements OnInit {
  @Input() elevation?: 1 | 2 | 3 | 4 | 5;
  @Input() icon?: string;
  @Input() title?: string;
  @Input() description?: string;

  constructor() { }

  ngOnInit() {
  }

}
