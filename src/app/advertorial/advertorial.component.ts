export function setCookie(name: string, val: string, expires: any) {
  const value = val;

  // Set it
  document.cookie = name+"="+value+"; expires="+expires.toUTCString()+"; path=/";
}

export function getCookie(name: string) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");

  if (parts.length == 2) {
    return parts.pop().split(";").shift();
  }
}

import {Component, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-advertorial',
  templateUrl: './advertorial.component.html',
  styleUrls: ['./advertorial.component.scss']
})
export class AdvertorialComponent implements OnInit {

  environment = environment;
  public mobile: boolean = true;
  public blocking: boolean = false;
  public hideBlockingMsg: boolean = false;

  constructor() { }

  ngOnInit() {
    if (window.screen.width > 1200) { // 768px portrait
      this.mobile = false;
    }

    if(!document.getElementById('MzWAfeDdXbZt')) {
      console.log("Client is blocking ads");
      this.blocking = true;
    }
    if (getCookie('gd_adblocker_help')==='1') {
      this.hideBlockingMsg = true;
    }
  }

  public hideHelp() {
    this.hideBlockingMsg = false;
    const date = new Date();
    date.setTime(date.getTime() + (2 * 24 * 60 * 60 * 1000));
    setCookie('gd_adblocker_help','1', date);
  }

}
