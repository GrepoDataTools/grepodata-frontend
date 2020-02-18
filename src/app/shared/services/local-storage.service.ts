import { Injectable } from "@angular/core";
import * as moment from "moment";

@Injectable()
export class LocalStorageService {
  constructor() {}

  public static get(key: string): any {
    if (localStorage.key) {
      const item = JSON.parse(localStorage.getItem(key));

      if(moment(item.expires) < moment()) return false;

      return item.content;
    }
    return false;
  }

  public static set(key, content, expiration) {
    const expires = moment().add(expiration, 'm').toDate();

    const data = {
      content,
      expires
    };

    localStorage.setItem(key, JSON.stringify(data));
  }
}
