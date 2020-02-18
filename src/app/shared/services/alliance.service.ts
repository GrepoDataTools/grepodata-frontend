import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../core/interfaces/responses/api-response';
import { Alliance } from '../core/interfaces/alliance';
import {environment} from '../../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable()
export class AllianceService {
    constructor(private http: HttpClient) {}

    fetchAlliancesByName(name: string): Observable<Alliance[]> {
        return this.http.get(`https://api.grepodata.com/alliance/search?query=${name}`).pipe(map((response: ApiResponse<Alliance[]>) => response.results));
    }

  loadAllianceInfo(world: string, id: string) {
    var url =  '/alliance/info';
    if (typeof world != 'undefined') url += '?world=' + world;
    if (typeof id != 'undefined') url += '&id=' + id;
    return this.http.get(apiUrl + url);
  }

  loadAllianceHistory(world: string, id: string) {
    var url =  '/alliance/history';
    if (typeof world != 'undefined') url += '?world=' + world;
    if (typeof id != 'undefined') url += '&id=' + id;
    return this.http.get(apiUrl + url);
  }

  loadAllianceChanges(world: string, id: any, from: any = undefined, size: any = undefined) {
    var url =  '/alliance/changes';
    if (typeof world != 'undefined') url += '?world=' + world;
    if (typeof id != 'undefined') url += '&id=' + id;
    if (typeof from != 'undefined') url += '&from=' + from;
    if (typeof size != 'undefined') url += '&size=' + size;
    return this.http.get(apiUrl + url);
  }

  loadAllianceHistoryRange(world: string, id: string, from: string, to: string) {
    var url =  '/alliance/rangehistory';
    if (typeof world != 'undefined') url += '?world=' + world;
    if (typeof id != 'undefined') url += '&id=' + id;
    if (typeof from != 'undefined') url += '&from=' + from;
    if (typeof to != 'undefined') url += '&to=' + to;
    return this.http.get(apiUrl + url);
  }

  loadAllianceMembers(world: string, id: string) {
    var url =  '/alliance/members';
    if (typeof world != 'undefined') url += '?world=' + world;
    if (typeof id != 'undefined') url += '&id=' + id;
    return this.http.get(apiUrl + url);
  }
}
