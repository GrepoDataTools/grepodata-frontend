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
// import {InstallDialog} from '../indexer/indexer.component';
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

  @Input() message: any = '';
  @Input() version: any = '';
  @Input() key: any = '';

  encrypted: any = '';
  showHelp = false;
  showUpdate = false;
  searchTime = 2500;

  constructor(
    public cdr: ChangeDetectorRef,
    public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  private checkVersion() {
    if (this.searchTime > 0) {
      this.searchTime -= 100;
      setTimeout(()=> {
        let version = document.getElementById('gd_version');
        // console.log("Detected version installed userscript: ", version);
        if (version != null && version.innerText && version.innerText != '') {
          if (this.version != '' && this.version != version.innerText) {
            console.log("Detected out of sync userscript version. Newest version available: ", this.version);
            setTimeout(()=>{
              let cookie = getCookie('gd_version_update');
              // console.log("version cookie: ", cookie);
              if (typeof cookie == 'undefined' || cookie!=this.version) {
                // console.log("Showing update dialog.");
                this.encrypted = Md5.hashAsciiStr(this.key);
                this.showHelp = false;
                this.showUpdate = true;
                this.detectChanges();
              } else {
                console.log("Ignoring update message; user already dismissed this version");
              }
            }, this.searchTime);
          }
        } else {
          this.checkVersion();
        }
        this.detectChanges();
      }, 100)
    } else {
      if (getCookie('gd_version_help')!='1') {
        this.showUpdate = false;
        this.showHelp = true;
      }
    }
    this.detectChanges();
  }

  public hideHelp() {
    this.showHelp = false;
    const date = new Date();
    date.setTime(date.getTime() + (3 * 24 * 60 * 60 * 1000));
    setCookie('gd_version_help','1', date);
    this.detectChanges();
  }

  public hideUpdate() {
    this.showUpdate = false;
    const date = new Date();
    date.setTime(date.getTime() + (3 * 24 * 60 * 60 * 1000));
    setCookie('gd_version_update',this.version, date);
    this.detectChanges();
  }

  public openInstalldialog() {
    // this.showHelp = false;
    // this.showUpdate = false;
    // let dialogRef = this.dialog.open(InstallDialog, {
    //   autoFocus: false,
    //   data: {
    //     key: this.key
    //   }
    // });
    // this.detectChanges();
    //
    // dialogRef.afterClosed().subscribe(result => {
    //   this.detectChanges();
    // });
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
