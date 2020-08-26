import { Component, OnInit } from '@angular/core';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-userscript',
  templateUrl: './userscript.component.html',
  styleUrls: ['./userscript.component.scss']
})
export class UserscriptComponent implements OnInit {

  copied = false;
  token_opened = false;
  token = '3h1273g12d31280d3h10231bed1qwdq';

  constructor() { }

  ngOnInit() {
  }

  copyLink(inputElement) {
    let token = this.token;
    navigator.clipboard.writeText(token).then(() => {});
    this.copied = true;
    window.setTimeout(()=>{this.copied = false;}, 4000);
  }
}
