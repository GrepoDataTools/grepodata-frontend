import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-script-version',
  templateUrl: './script-version.component.html',
  styleUrls: ['./script-version.component.scss']
})
export class ScriptVersionComponent implements OnInit {
  @Input() details_hidden: boolean = true;
  @Input() collapsable: boolean = true;
  @Input() title: string;
  @Input() github_url: string;

  constructor() { }

  ngOnInit(): void {
  }

}
