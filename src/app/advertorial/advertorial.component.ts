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
import {MatDialog} from '@angular/material/dialog';
import {DonateDialog} from '../shared/dialogs/donate/donate.component';
import {HOSTING_COST_PER_MONTH} from '../shared/hosting-cost';
import {AdBlockService} from '../services/ad-block.service';

@Component({
  selector: 'app-advertorial',
  templateUrl: './advertorial.component.html',
})
export class AdvertorialComponent implements OnInit {

  environment = environment;
  public mobile: boolean = true;
  public blocking: boolean = false;
  public hideBlockingMsg: boolean = false;
  readonly hostingCost = HOSTING_COST_PER_MONTH;

  constructor(private dialog: MatDialog, private adBlockService: AdBlockService) { }

  ngOnInit() {
    if (window.screen.width > 1200) { // 768px portrait
      this.mobile = false;
    }

    this.adBlockService.isBlocking().subscribe((blocking) => {
      this.blocking = blocking;
    });

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

  public donate() {
    this.dialog.open(DonateDialog);
  }

}
