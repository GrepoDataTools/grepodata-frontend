import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

const apiUrl = environment.apiUrl;

@Injectable()
export class PlayerService {

  constructor(private http: HttpClient) {}

  loadPlayerInfo(world: string, id: string, getName: boolean) {
    var url =  '/player/info';
    if (typeof world != 'undefined') url += '?world=' + world;
    if (typeof id != 'undefined') url += '&id=' + id;
    if (typeof getName != 'undefined') url += '&a_name=' + getName;
    return this.http.get(apiUrl + url);
  }

  loadPlayerHistory(world: string, id: string) {
    var url =  '/player/history';
    if (typeof world != 'undefined') url += '?world=' + world;
    if (typeof id != 'undefined') url += '&id=' + id;
    return this.http.get(apiUrl + url);
  }

  loadGhostTowns(world: string, id: string) {
    var url =  '/player/ghosttowns';
    if (typeof world != 'undefined') url += '?world=' + world;
    if (typeof id != 'undefined') url += '&id=' + id;
    return this.http.get(apiUrl + url);
  }

  loadPlayerChanges(world: string, id: any, from: any = undefined, size: any = undefined) {
    var url =  '/player/changes';
    if (typeof world != 'undefined') url += '?world=' + world;
    if (typeof id != 'undefined') url += '&id=' + id;
    if (typeof from != 'undefined') url += '&from=' + from;
    if (typeof size != 'undefined') url += '&size=' + size;
    return this.http.get(apiUrl + url);
  }

  loadPlayerHistoryRange(world: string, id: string, from: string, to: string) {
    var url =  '/player/rangehistory';
    if (typeof world != 'undefined') url += '?world=' + world;
    if (typeof id != 'undefined') url += '&id=' + id;
    if (typeof from != 'undefined') url += '&from=' + from;
    if (typeof to != 'undefined') url += '&to=' + to;
    return this.http.get(apiUrl + url);
  }

  getTowns(world: string, id: number) {
    let url = '/town/player?world='+world+'&id='+id;
    return this.http.get(apiUrl + url);
  }
}
