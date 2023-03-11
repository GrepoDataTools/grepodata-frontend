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
        return false;
      } else {
        return data.data;
      }
    }
    return false;

  }

  public static set(url, cachedData, lifetime=60) {
    let expire = moment().add(lifetime, 'm').toDate();
    let data = {
      data: cachedData,
      expires: expire
    };
    localStorage.setItem(url, JSON.stringify(data));
  }

  public static remove(url) {
    localStorage.removeItem(url);
  }

}
