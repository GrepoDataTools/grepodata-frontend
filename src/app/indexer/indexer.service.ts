import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {JwtService} from '../auth/services/jwt.service';
import {Globals} from '../globals';
import {last} from 'rxjs/operators';

const apiUrl = environment.apiUrl;

@Injectable()
export class IndexerService {

  constructor(
    private globals: Globals,
    private http: HttpClient
  ) {}

  /**
   * Indexer Getters
   */

  getWorlds() {
    let url =  '/indexer/worlds';
    return this.http.get(apiUrl + url);
  }

  getIndex(access_token, key, minimal = false) {
    let url =  '/indexer/v2/getindex?key='+key;
    if (minimal) {
      url += '&minimal=true';
    }
    return this.http.get(apiUrl + url, {
      headers: new HttpHeaders().set('access_token', access_token)
    });
  }

  getUserEvents(access_token, from, size) {
    let url =  '/events/user?from='+from+'&size='+size;
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

  /**
   * Indexer Actions
   */

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

  updateTeamName(access_token, key, team_name) {
    let url =  '/indexer/settings/name?key='+key+'&team_name='+team_name;
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

  /**
   * Get intel routes
   */

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

  /**
   * Stats
   */

  getStats() {
    let url =  '/indexer/stats';
    return this.http.get(apiUrl + url);
  }

  loadStatsIndexer() {
    let url = '/analytics/indexer';
    return this.http.get(apiUrl + url);
  }

  /**
   * Commands
   */

  getCommandOverview(access_token, team, last_get_cmd = 0) {
    let url =  '/commands/get?team='+team+'&last_get_cmd='+last_get_cmd+'&access_token='+access_token;
    return this.http.get(apiUrl + url);
  }

  getActiveTeams(access_token) {
    let url =  '/commands/activeteams';
    return this.http.get(apiUrl + url, {
      headers: new HttpHeaders().set('access_token', access_token)
    });
  }

  updateCommandsByQuery(access_token, team, world, action, content) {
    let data = new HttpParams()
      .set('access_token', access_token)
      .set('team', team)
      .set('world', world)
      .set('es_id', 'na')
      .set('content', content)
      .set('action', action);
    return this.http.post<any>(apiUrl + '/commands/update', data,
      {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'})})
  }

  updateCommandDeleteStatus(access_token, team, world, es_id, new_delete_status) {
    let data = new HttpParams()
      .set('access_token', access_token)
      .set('team', team)
      .set('world', world)
      .set('es_id', es_id)
      .set('content', new_delete_status)
      .set('action', 'delete');
    return this.http.post<any>(apiUrl + '/commands/update', data,
      {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'})})
  }

  addCommandComment(access_token, team, world, es_id, comment) {
    let data = new HttpParams()
      .set('access_token', access_token)
      .set('team', team)
      .set('world', world)
      .set('es_id', es_id)
      .set('content', comment)
      .set('action', 'comment');
    return this.http.post<any>(apiUrl + '/commands/update', data,
      {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'})})
  }


  /**
   * Local functions
   */

  getLocalIndexInfo(index_key) {
    let localIndexes = this.globals.get_all_indexes();
    if (!localIndexes) return false;
    for (let i of (<any>localIndexes)) {
      if (i.key == index_key)  {
        return i;
      }
    }
  }

  addRecentlyVisitedEvent(entity, name, id, world, intel_count) {
    // TODO: store recent intel views and show quick links on 'My intel page'
  }

}
