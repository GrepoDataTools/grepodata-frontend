import { Component, OnInit } from '@angular/core';
import {Globals} from '../../../../globals';

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss']
})
export class ApiComponent implements OnInit {

  constructor(
    private globals: Globals) { }

  ngOnInit(): void {
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  copyText(target) {
    let selection = window.getSelection();
    let txt = document.getElementById(target);
    let range = document.createRange();
    range.selectNodeContents(txt);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();
    this.globals.showSnackbar(
      `<h4>Copied to clipboard</h4>`,
      'success', '', true,5000);
  }
}
