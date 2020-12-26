import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class LocalCacheService {

  constructor() {}

  /**
   * @param url
   * @param ignore_expiration
   * @returns {any} false if url does not exist or is expired
   */
  public static get(url, ignore_expiration = false) {
    let exists = localStorage.hasOwnProperty(url) && localStorage[url] !== null;
    if (exists) {
      let data = JSON.parse(localStorage.getItem(url));
      if (ignore_expiration === false && moment(data.expires) < moment()) {
        // console.log('Cache item is expired: ' + url + ' - ' + data.expires);
        return false;
      } else {
        // console.log('Retrieved item from cache: ' + url + '. expires: ' + data.expires);
        return data.data;
      }
    }

    // console.log('Cache item does not exist: ' + url);
    return false;

  }

  public static set(url, cachedData, lifetime) {
    let expire = moment().add(lifetime, 'm').toDate();
    let data = {
      data: cachedData,
      expires: expire
    };
    // console.log('Added data to local cache: ' + url + '. expires: ' + expire);
    localStorage.setItem(url, JSON.stringify(data));
  }

}
