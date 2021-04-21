import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../environments/environment";

const apiUrl = environment.apiUrl;

@Injectable()
export class SearchService {

  constructor(private http: HttpClient) {}


  searchPlayersIndexed(access_token: string, query: string) {
    return this.searchPlayers(query, 0, 30, null, null, false, null, null, false, null, access_token);
  }

  searchPlayers(query: string, from: number, size: number, server: string,
								world: string, showStopped: boolean, index: string, id: string, forceSql: boolean,
								preferred_server: any, access_token: string) : any {
    let url = '/player/search?';
    if (typeof id != 'undefined' && id != null) url += 'grep_id=' + id + '&';
    if (typeof query != 'undefined' && query != null) url += 'query=' + query.toLowerCase() + '&';
    if (typeof from != 'undefined') url += 'from=' + from + '&';
    if (typeof size != 'undefined') url += 'size=' + size + '&';
    if (typeof server != 'undefined' && server != null && server != '') url += 'server=' + server + '&';
    if (typeof world != 'undefined' && world != null && world != '') url += 'world=' + world + '&';
    if (typeof index != 'undefined' && index != null && index != '') url += 'index=' + index + '&';
    if (typeof preferred_server != 'undefined' && preferred_server != false && preferred_server != null && preferred_server != '') {
    	url += 'preferred_server=' + preferred_server + '&';
		}

    if (typeof showStopped != 'undefined' && showStopped != null && showStopped == true) url += 'active=true&';
    if (typeof forceSql != 'undefined' && forceSql != null && forceSql == true) url += 'sql=true&';

    let options = {}
    if (access_token) {
      options = {
        headers: new HttpHeaders().set('access_token', access_token)
      };
    }

    return this.http.get(apiUrl + url, options);
  }

  searchAlliances(query: string, from: number, size: number, world: string = null) {
    let url = '/alliance/search?';
    if (typeof query != 'undefined') url += 'query=' + query.toLowerCase() + '&';
    if (typeof from != 'undefined') url += 'from=' + from + '&';
    if (typeof size != 'undefined') url += 'size=' + size + '&';
    if (typeof world != 'undefined' && world != null && world != '') url += 'world=' + world + '&';

    url += 'active=true&';

    return this.http.get(apiUrl + url);
  }

  // searchTownsIndexed(access_token: string, query: string, world: string) {
  //   let url = '/indexer/search/town?';
  //   if (typeof query != 'undefined') url += 'query=' + query.toLowerCase() + '&';
  //   if (typeof world != 'undefined' && world != null && world != '') url += 'world=' + world + '&';
  //   return this.http.get(apiUrl + url, {
  //     headers: new HttpHeaders().set('access_token', access_token)
  //   });
  // }

  /**
   * Access token is not required but can be used to filter the results by the worlds the player is active in
   * @param query
   * @param world
   * @param access_token
   */
  searchTowns(query: string, world: string = null, access_token: string = null) {
    let url = '/town/search?';
    if (typeof query != 'undefined') url += 'query=' + query.toLowerCase() + '&';
    if (typeof world != 'undefined' && world != null && world != '') url += 'world=' + world + '&';
    let options = {}
    if (access_token) {
      options = {
        headers: new HttpHeaders().set('access_token', access_token)
      };
    }
    return this.http.get(apiUrl + url, options);
  }

  // searchIslandsIndexed(access_token: string, query: string, world: string) {
  //   let url = '/indexer/search/island?';
  //   if (typeof query != 'undefined') url += 'query=' + query.toLowerCase() + '&';
  //   if (typeof world != 'undefined' && world != null && world != '') url += 'world=' + world + '&';
  //   return this.http.get(apiUrl + url, {
  //     headers: new HttpHeaders().set('access_token', access_token)
  //   });
  // }

  searchUsers(access_token, query: string) {
    let url = '/indexer/search/user?';
    if (typeof query != 'undefined') url += 'query=' + query.toLowerCase();
    return this.http.get(apiUrl + url, {
      headers: new HttpHeaders().set('access_token', access_token)
    });
  }

}
