import { Component, Input, OnInit } from '@angular/core';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-userscript',
  templateUrl: './userscript.component.html',
  host: {class: 'block [router-outlet+&]:mx-auto [router-outlet+&]:my-6 [router-outlet+&]:max-w-6xl [router-outlet+&]:px-4'}
})
export class UserscriptComponent implements OnInit {
  @Input() section = 'all';

  constructor() { }

  ngOnInit() {
  }

}
