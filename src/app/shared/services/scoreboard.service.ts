import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from '../../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable()
export class ScoreboardService {

  constructor(private http: HttpClient) {}

  loadPlayerScoreboard(world: string, date: string, server: string) {
    var url =  '/scoreboard/player?';
    if (typeof world != 'undefined' && world != '') {
      url += 'world=' + world + '&';
    } else if (typeof server != 'undefined' && server != ''){
      url += 'server=' + server + '&';
    }
    if (typeof date != 'undefined') url += 'date=' + date + '&';

    return this.http.get(apiUrl + url);
  }

  loadHourDiffs(world: string, date: string, hour: string) {
    var url =  '/scoreboard/hourdiffs?';
    url += 'world=' + world + '&';
    url += 'date=' + date + '&';
    url += 'hour=' + hour + '&';

    return this.http.get(apiUrl + url);
  }

  loadDayDiffs(world: string, date: string, id: string) {
    var url =  '/player/daydiffs?';
    url += 'world=' + world + '&';
    url += 'date=' + date + '&';
    url += 'id=' + id + '&';

    return this.http.get(apiUrl + url);
  }

  loadAllianceDayDiffs(world: string, date: string, id: string) {
    var url =  '/alliance/daydiffs?';
    url += 'world=' + world + '&';
    url += 'date=' + date + '&';
    url += 'id=' + id + '&';

    return this.http.get(apiUrl + url);
  }

  loadPlayerDiffs(world: string) {
    var url =  '/player/diffs?';
    if (typeof world != 'undefined') {
      url += 'world=' + world + '&';
    }

    return this.http.get(apiUrl + url);
  }

  loadAllianceScoreboard(world: string, date: string, server: string) {
    var url =  '/scoreboard/alliance?';
    if (typeof world != 'undefined' && world != '') {
      url += 'world=' + world + '&';
    } else if (typeof server != 'undefined' && server != ''){
      url += 'server=' + server + '&';
    }
    if (typeof date != 'undefined') url += 'date=' + date + '&';

    return this.http.get(apiUrl + url);
  }

  loadAllianceChanges(world: string, date: string, server: string, from: any = undefined, size: any = undefined) {
    var url =  '/world/changes?';
    if (typeof world != 'undefined' && world != '') {
      url += 'world=' + world + '&';
    } else if (typeof server != 'undefined' && server != ''){
      url += 'server=' + server + '&';
    }
    if (typeof date != 'undefined') url += 'date=' + date + '&';
    if (typeof from != 'undefined') url += '&from=' + from;
    if (typeof size != 'undefined') url += '&size=' + size;

    return this.http.get(apiUrl + url);
  }
}
