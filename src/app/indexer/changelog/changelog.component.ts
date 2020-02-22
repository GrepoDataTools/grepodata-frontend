import { Component, OnInit } from '@angular/core';
import * as icon from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.scss']
})
export class ChangelogComponent implements OnInit {

  gitIcon = icon.faGithub;

  constructor() { }

  ngOnInit(): void {
  }

}
