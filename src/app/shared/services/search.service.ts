import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from '../../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable()
export class SearchService {

  constructor(private http: HttpClient) {}

  searchPlayers(query: string, from: number, size: number, server: string,
								world: string, showStopped: boolean, index: string, id: string, forceSql: boolean,
								preferred_server: string) : any {
    let url = '/player/search?';
    if (typeof id != 'undefined' && id != null) url += 'grep_id=' + id + '&';
    if (typeof query != 'undefined' && query != null) url += 'query=' + query.toLowerCase() + '&';
    if (typeof from != 'undefined') url += 'from=' + from + '&';
    if (typeof size != 'undefined') url += 'size=' + size + '&';
    if (typeof server != 'undefined' && server != '') url += 'server=' + server + '&';
    if (typeof world != 'undefined' && world != '') url += 'world=' + world + '&';
    if (typeof index != 'undefined' && index != null && index != '') url += 'index=' + index + '&';
    if (typeof preferred_server != 'undefined' && preferred_server != null && preferred_server != '') {
    	url += 'preferred_server=' + preferred_server + '&';
		}

    if (typeof showStopped != 'undefined' && showStopped != null && showStopped == true) url += 'active=true&';
    if (typeof forceSql != 'undefined' && forceSql != null && forceSql == true) url += 'sql=true&';

    return this.http.get(apiUrl + url);
  }

  searchAlliances(query: string, from: number, size: number, index: string) {
    let url = '/alliance/search?';
    if (typeof query != 'undefined') url += 'query=' + query.toLowerCase() + '&';
    if (typeof from != 'undefined') url += 'from=' + from + '&';
    if (typeof size != 'undefined') url += 'size=' + size + '&';
    if (typeof index != 'undefined' && index != null && index != '') url += 'index=' + index + '&';

    url += 'active=true&';

    return this.http.get(apiUrl + url);
  }

  searchPlayersIndexed(query: string, index: string) {
    let url = '/indexer/search/player?';
    if (typeof query != 'undefined') url += 'query=' + query.toLowerCase() + '&';
    if (typeof index != 'undefined' && index != null && index != '') url += 'key=' + index + '&';
    return this.http.get(apiUrl + url);
  }

  searchTownsIndexed(query: string, index: string) {
    let url = '/indexer/search/town?';
    if (typeof query != 'undefined') url += 'query=' + query.toLowerCase() + '&';
    if (typeof index != 'undefined' && index != null && index != '') url += 'key=' + index + '&';
    return this.http.get(apiUrl + url);
  }

  searchIslandsIndexed(query: string, index: string) {
    let url = '/indexer/search/island?';
    if (typeof query != 'undefined') url += 'query=' + query.toLowerCase() + '&';
    if (typeof index != 'undefined' && index != null && index != '') url += 'key=' + index + '&';
    return this.http.get(apiUrl + url);
  }

}
