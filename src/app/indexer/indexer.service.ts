import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {JwtService} from '../auth/services/jwt.service';
import {Globals} from '../globals';

const apiUrl = environment.apiUrl;

@Injectable()
export class IndexerService {

  constructor(
    private globals: Globals,
    private http: HttpClient
  ) {}

  getStats() {
    let url =  '/indexer/stats';
    return this.http.get(apiUrl + url);
  }

  getIndex(access_token, key) {
    let url =  '/indexer/v2/getindex?key='+key;
    return this.http.get(apiUrl + url, {
      headers: new HttpHeaders().set('access_token', access_token)
    });
  }

  updateTeamName(access_token, key, team_name) {
    let url =  '/indexer/settings/name?key='+key+'&team_name='+team_name;
    return this.http.get(apiUrl + url, {
      headers: new HttpHeaders().set('access_token', access_token)
    });
  }

  getUserEvents(access_token) {
    let url =  '/events/user';
    return this.http.get(apiUrl + url, {
      headers: new HttpHeaders().set('access_token', access_token)
    });
  }

  getTeamEvents(access_token, index_key, from, size) {
    let url =  '/events/team?index_key='+index_key+'&from='+from+'&size='+size;
    return this.http.get(apiUrl + url, {
      headers: new HttpHeaders().set('access_token', access_token)
    });
  }

  getCommandOverview(access_token, world) {
    let url =  '/commands/get?world='+world;
    return this.http.get(apiUrl + url, {
      headers: new HttpHeaders().set('access_token', access_token)
    });
  }

  getWorlds() {
    let url =  '/indexer/worlds';
    return this.http.get(apiUrl + url);
  }

  createNewIndex(access_token, index_name, world, captcha): any {
    if (captcha == '' || captcha == undefined) captcha = '_';
    let url =  '/indexer/v2/newindex?world='+world+'&index_name='+index_name+'&captcha='+captcha;
    return this.http.get(apiUrl + url, {
      headers: new HttpHeaders().set('access_token', access_token)
    });
  }

  createNewLink(access_token, index_key): any {
    let url =  '/indexer/v2/newlink?index_key='+index_key;
    return this.http.get(apiUrl + url, {
      headers: new HttpHeaders().set('access_token', access_token)
    });
  }

  commitPrevIntel(access_token, index_key, action): any {
    let url =  '/indexer/commitprevintel?index_key='+index_key+'&action='+action;
    return this.http.get(apiUrl + url, {
      headers: new HttpHeaders().set('access_token', access_token)
    });
  }

  loadPlayerIntel(access_token, world, id) {
    let url =  '/indexer/v2/player?world='+world+'&player_id='+id;
    return this.http.get(apiUrl + url, {
      headers: new HttpHeaders().set('access_token', access_token)
    });
  }

  loadAllianceIntel(access_token, world, id) {
    let url =  '/indexer/v2/alliance?world='+world+'&alliance_id='+id;
    return this.http.get(apiUrl + url, {
      headers: new HttpHeaders().set('access_token', access_token)
    });
  }

  loadTownIntel(access_token, world, id) {
    let url =  '/indexer/v2/town?world='+world+'&town_id='+id;
    return this.http.get(apiUrl + url, {
      headers: new HttpHeaders().set('access_token', access_token)
    });
  }

  // Full stats
  loadStatsIndexer() {
    let url = '/analytics/indexer';
    return this.http.get(apiUrl + url);
  }

  getLocalIndexInfo(index_key) {
    let localIndexes = this.globals.get_all_indexes();
    if (!localIndexes) return false;
    for (let i of (<any>localIndexes)) {
      if (i.key == index_key)  {
        return i;
      }
    }
  }

  /**
   * @deprecated
   */
  resetIndexOwners(key, mail, captcha) {
    if (captcha == '' || captcha == undefined) captcha = '_';
    let url =  '/indexer/owner/reset?key='+key+'&mail='+mail+'&captcha='+captcha;
    return this.http.get<any>(apiUrl + url);
  }

  /**
   * @deprecated
   */
  excludeIndexOwner(key, mail, captcha, id) {
    if (captcha == '' || captcha == undefined) captcha = '_';
    let url =  '/indexer/owner/exclude?key='+key+'&mail='+mail+'&alliance_id='+id+'&captcha='+captcha;
    return this.http.get<any>(apiUrl + url);
  }

  /**
   * @deprecated
   */
  includeIndexOwner(key, mail, captcha, id) {
    if (captcha == '' || captcha == undefined) captcha = '_';
    let url =  '/indexer/owner/include?key='+key+'&mail='+mail+'&alliance_id='+id+'&captcha='+captcha;
    return this.http.get<any>(apiUrl + url);
  }


  addRecentlyVisitedEvent(entity, name, id, world, intel_count) {
    // TODO: store recent intel views and show quick links on 'My intel page'
  }

}
