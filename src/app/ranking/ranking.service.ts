import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

const apiUrl = environment.apiUrl;

@Injectable()
export class RankingService {

  constructor(private http: HttpClient) {}

  loadPlayerRanking(world: string, sort_field: string, sort_order: string, from: number, size: number, server: string) {
    var url =  '/ranking/player?';
    if (typeof world != 'undefined' && world != '') {
      url += 'world=' + world + '&';
    } else if (typeof server != 'undefined' && server != '') {
      url += 'server=' + server + '&';
    }

    if (typeof sort_field != 'undefined') url += 'sort_field=' + sort_field + '&';
    if (typeof sort_order != 'undefined') url += 'sort_order=' + sort_order + '&';
    if (typeof from != 'undefined') url += 'from=' + from + '&';
    if (typeof size != 'undefined') url += 'size=' + size + '&';

    url += 'active=true&';

    return this.http.get(apiUrl + url);
  }

  loadAllianceRanking(world: string, sort_field: string, sort_order: string, from: number, size: number, server: string) {
    var url =  '/ranking/alliance?';
    if (typeof world != 'undefined' && world != '') {
      url += 'world=' + world + '&';
    } else if (typeof server != 'undefined' && server != '') {
      url += 'server=' + server + '&';
    }

    if (typeof sort_field != 'undefined') url += 'sort_field=' + sort_field + '&';
    if (typeof sort_order != 'undefined') url += 'sort_order=' + sort_order + '&';
    if (typeof from != 'undefined') url += 'from=' + from + '&';
    if (typeof size != 'undefined') url += 'size=' + size + '&';

    url += 'active=true&';

    return this.http.get(apiUrl + url);
  }
}
