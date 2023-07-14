// globals.ts
import {EventEmitter, Injectable} from '@angular/core';
import * as moment from 'moment';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BasicSnackbar} from './shared/snackbar/basic-snackbar.component';
import {NavigationEnd, Router} from '@angular/router';

@Injectable()
export class Globals {
  ACTIVE_WORLD        = 'active_world';
  ACTIVE_SERVER       = 'active_server';
  ACTIVE_INTEL_WORLD  = 'active_intel_worlds';
  TOP_INDEX_LIST      = 'topindexlist';
  ALL_INDEX_LIST      = 'allindexlist';
  RECENT_INTEL_LIST   = 'recentintellist';

  private active_world:   string = '';
  private active_server:  string = '';
  private active_index:   string = '';
  private active_token:   string = '';
  private redirect_url:   string = '';
  private active_intel:   any = null;
  private show_duplicates: any = false;
  public duplicateVisChange: EventEmitter<any> = new EventEmitter();

  constructor(
    public snackBar: MatSnackBar,
  ) {}

  /**
   * Last selected game world
   */
  get_active_world() {
    if (this.active_world != '') {
      return this.active_world;
    } else if (localStorage.getItem(this.ACTIVE_WORLD)) {
      let local_world = localStorage.getItem(this.ACTIVE_WORLD);
      if (local_world == 'undefined') {
        localStorage.removeItem(this.ACTIVE_WORLD);
        return false;
      }
      return local_world;
    } else {
      return false;
    }
  }
  set_active_world(world) {
    this.active_world = world;
    localStorage.setItem(this.ACTIVE_WORLD, world);
  }

  /**
   * Last selected game server
   */
  get_active_server() {
    if (this.active_server != '') {
      return this.active_server;
    } else if (localStorage.getItem(this.ACTIVE_SERVER)) {
      let local_server = localStorage.getItem(this.ACTIVE_SERVER);
      if (local_server == 'un') {
        localStorage.removeItem(this.ACTIVE_SERVER);
        return false;
      }
      return local_server;
    } else {
      return false;
    }
  }
  set_active_server(server) {
    this.active_server = server;
    localStorage.setItem(this.ACTIVE_SERVER, server);
  }

  /**
   * Return a list of all worlds where intel is available
   * @returns {any}
   */
  get_active_intel() {
    if (this.active_intel !== null) {
      return this.active_intel;
    } else if (localStorage.getItem(this.ACTIVE_INTEL_WORLD)) {
      return JSON.parse(localStorage.getItem(this.ACTIVE_INTEL_WORLD));
    } else {
      return false;
    }
  }

  /**
   * Sets a flag to indicate that the given world has intel
   * @param world
   */
  set_active_intel(world) {
    let intel = this.get_active_intel();
    if (intel !== false) {
      this.active_intel = intel;
    } else {
      this.active_intel = {}
    }
    this.active_intel[world] = true;
    localStorage.setItem(this.ACTIVE_INTEL_WORLD, JSON.stringify(this.active_intel));
  }

  /**
   * Global duplicate toggle on intel tables
   */
  get_show_duplicates() {
    return this.show_duplicates;
  }
  set_show_duplicates(show_duplicates) {
    this.show_duplicates = show_duplicates;
    this.duplicateVisChange.emit(this.show_duplicates);
  }

  /**
   * Redirect URL
   */
  get_redirect_url() {
    return this.redirect_url;
  }
  set_redirect_url(redirect_url) {
    this.redirect_url = redirect_url;
  }

  /**
   * Top index list
   */
  get_top_indexes() {
    return this.get_json_with_expiry(this.TOP_INDEX_LIST)
  }
  set_top_indexes(top_indexes, lifetime=60 * 24 * 14) {
    return this.set_json_with_expiry(this.TOP_INDEX_LIST, top_indexes, lifetime)
  }
  delete_top_indexes() {
    localStorage.removeItem(this.TOP_INDEX_LIST);
  }

  /**
   * Recent intel list
   */
  get_recent_intel() {
    return this.get_json_with_expiry(this.RECENT_INTEL_LIST)
  }
  set_recent_intel(top_indexes, lifetime=60 * 24 * 14) {
    return this.set_json_with_expiry(this.RECENT_INTEL_LIST, top_indexes, lifetime)
  }
  delete_recent_intel() {
    localStorage.removeItem(this.RECENT_INTEL_LIST);
  }

  /**
   * All index list
   */
  get_all_indexes() {
    return this.get_json_with_expiry(this.ALL_INDEX_LIST)
  }
  set_all_indexes(top_indexes, lifetime=60 * 24 * 14) {
    return this.set_json_with_expiry(this.ALL_INDEX_LIST, top_indexes, lifetime)
  }
  delete_all_indexes() {
    localStorage.removeItem(this.ALL_INDEX_LIST);
  }

  /**
   * @param url
   * @param ignore_expiration
   * @returns {any} false if url does not exist or is expired
   */
  private get_json_with_expiry(url, ignore_expiration = false) {
    let exists = localStorage.hasOwnProperty(url) && localStorage[url] !== null;
    if (exists) {
      let data = JSON.parse(localStorage.getItem(url));
      if (ignore_expiration === false && moment(data.expires) < moment()) {
        return false;
      } else {
        return data.data;
      }
    }
    return false;

  }

  /**
   * store an item in local storage with expiry (lifetime given in minutes)
   * @param url
   * @param cachedData
   * @param lifetime
   * @private
   */
  private set_json_with_expiry(url, cachedData, lifetime) {
    let expire = moment().add(lifetime, 'm').toDate();
    let data = {
      data: cachedData,
      expires: expire
    };
    localStorage.setItem(url, JSON.stringify(data));
  }

  showSnackbar(message, type, title='', dismissible=true, lifetime=5000, customActionHtml=null, customActionCallback=null, customActionData=null) {
    let snackBarRef = this.snackBar.openFromComponent(BasicSnackbar, {
      data: {
        message: message,
        type: type,
        title: title,
        dismissible: dismissible,
        customActionHtml: customActionHtml,
        customActionCallback: customActionCallback,
        customActionData: customActionData,
      },
      duration: lifetime,
      panelClass: ['default-snackbar']
    });
    snackBarRef.afterDismissed().subscribe(() => {
      console.log('snackbar dismissed')
    });
  }
}
