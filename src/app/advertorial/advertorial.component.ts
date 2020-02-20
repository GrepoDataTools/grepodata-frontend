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

@Component({
  selector: 'app-advertorial',
  templateUrl: './advertorial.component.html',
  styleUrls: ['./advertorial.component.scss']
})
export class AdvertorialComponent implements OnInit {

  public mobile: boolean = true;
  public blocking: boolean = false;

  constructor() { }

  ngOnInit() {
    if (window.screen.width > 1200) { // 768px portrait
      this.mobile = false;
    }

    let block = false;
    if(!document.getElementById('MzWAfeDdXbZt')) {
      console.log("Client is blocking ads");
      block = true;
    }
    if (getCookie('gd_adblocker_help')==='1') {
      block = false;
    }
    this.blocking = block;
  }

  public hideHelp() {
    this.blocking = false;
    const date = new Date();
    date.setTime(date.getTime() + (2 * 24 * 60 * 60 * 1000));
    setCookie('gd_adblocker_help','1', date);
  }

}
