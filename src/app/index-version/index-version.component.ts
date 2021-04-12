/*
 * General utils for managing cookies in Typescript.
 */
import * as moment from 'moment';

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

import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Md5} from 'ts-md5/dist/md5';
import {animate, style, transition, trigger} from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-index-version',
  templateUrl: './index-version.component.html',
  styleUrls: ['./index-version.component.scss'],
  animations: [
    trigger('helpAnim',
      [
        transition(
          ':enter', [
            style({transform: 'scaleY(0)', opacity: 0, height: 0}),
            animate('1000ms ease-in-out', style({transform: 'scaleY(1)', opacity: 1, height: '*'}))
          ]
        ),
        transition(
          ':leave', [
            style({transform: 'scaleY(1)', opacity: 1, height: '*'}),
            animate('1000ms ease-in-out', style({transform: 'scaleY(0)', opacity: 0, height: 0}))
          ]
        )]),
    trigger('animPush',
      [
        transition(
          ':enter', [
            style({height: 0}),
            animate('1000ms ease-in-out', style({height: 100}))
          ]
        ),
        transition(
          ':leave', [
            style({height: 100}),
            animate('1000ms ease-in-out', style({height: 0}))
          ]
        )])
  ]
})
export class IndexVersionComponent implements OnInit, AfterViewInit {

  encrypted: any = '';
  showHelp = false;
  searchTime = 3500;

  constructor(
		private cdr: ChangeDetectorRef,
		public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  private checkVersion() {
    if (this.searchTime > 0) {
      this.searchTime -= 100;
      setTimeout(()=> {
        let version = document.getElementById('gd_version');
        if (version == null) {
          version = document.getElementById('script_version');
        }
        if (version != null && version.innerText && version.innerText != '') {
          console.log("Detected installed userscript: ", version);
          this.showHelp = false;
          this.detectChanges();
        } else {
          this.checkVersion();
        }
				this.detectChanges();
      }, 100)
    } else {
			if (getCookie('gd_version_help')!='1') {
        this.showHelp = true;
      }
    }
		this.detectChanges();
  }

  public hideHelp() {
    this.showHelp = false;
    const date = new Date();
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
    setCookie('gd_version_help','1', date);
		this.detectChanges();
  }

	ngAfterViewInit(): void {
		this.checkVersion();
		this.cdr.detach();
		this.detectChanges();
	}

	detectChanges() {
		this.cdr.detectChanges();
		setTimeout(_ => this.cdr.detectChanges(), 250);
		setTimeout(_ => this.cdr.detectChanges(), 1250);
	}

}
