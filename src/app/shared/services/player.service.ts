import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map} from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Player } from "../core/interfaces/player";
import { ApiResponse } from '../core/interfaces/responses/api-response';
import { PlayerDifferenceResponse } from '../core/interfaces/responses/player-difference-response';
import {environment} from '../../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable()
export class PlayerService {
  constructor(private http: HttpClient) {}


  fetchPlayersByName(name: string): Observable<Player[]> {
    return this.http.get(`${apiUrl}/player/search?query=${name}`).pipe(map((response: ApiResponse<Player[]>) => response.results));
  }

  fetchDifferenceForWorld(world: string): Observable<PlayerDifferenceResponse> {
    return this.http.get(`${apiUrl}/player/diffs?world=${world}`).pipe(map((response: PlayerDifferenceResponse) =>response));
  }

  loadPlayerInfo(world: string, id: string, name: boolean) {
    let url =  '/player/info';
    if (typeof world != 'undefined') url += `?world=${world}`;
    if (typeof id != 'undefined') url += `&id=${id}`;
    if (typeof name != 'undefined') url += `&a_name=${name}`;
    return this.http.get(apiUrl + url);
  }

  loadPlayerHistory(world: string, id: string) {
    let url =  '/player/history';
    if (typeof world != 'undefined') url += `?world=${world}`;
    if (typeof id != 'undefined') url += `&id=${id}`;
    return this.http.get(apiUrl + url);
  }

  loadPlayerChanges(world: string, id: any, from: any = undefined, size: any = undefined) {
    let url =  '/player/changes';
    if (typeof world != 'undefined') url += `?world=${world}`;
    if (typeof id != 'undefined') url += `&id=${id}`;
    if (typeof from != 'undefined') url += `&from=${from}`;
    if (typeof size != 'undefined') url += `&size=${size}`;
    return this.http.get(apiUrl + url);
  }

  loadPlayerHistoryRange(world: string, id: string, from: string, to: string) {
    let url =  '/player/rangehistory';
    if (typeof world != 'undefined') url += `?world=${world}`;
    if (typeof id != 'undefined') url += `&id=${id}`;
    if (typeof from != 'undefined') url += `&from=${from}`;
    if (typeof to != 'undefined') url += `&to=${to}`;
    return this.http.get(apiUrl + url);
  }

  getTowns(world: string, id: number) {
    let url = `/town/player?world=${world}&id=${id}`;
    return this.http.get(apiUrl + url);
  }
}
