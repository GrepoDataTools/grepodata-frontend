import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alliance } from '../core/interfaces/alliance';
import { environment } from '../../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable()
export class AllianceService {
  constructor(private http: HttpClient) { }

  searchByName(name: string): Observable<Alliance[]> {
    return this.http.get<Alliance[]>(`https://api.grepodata.com/alliance/search?query=${name}`);
  }

  loadInfo(world: string, id: string) {
    return this.http.get(`${apiUrl}/alliance/info?${world && `world=${world}&`}${id && `id=${id}`}`);
  }

  loadHistory(world: string, id: string) {
    return this.http.get(`${apiUrl}/alliance/history?${world && `world=${world}&`}${id && `id=${id}`}`);
  }

  loadChanges(world: string, id: any, from: any = undefined, size: any = undefined) {
    return this.http.get(`${apiUrl}/alliance/changes?${world && `world=${world}&`}${id && `id=${id}&`}${from && `from=${from}&`}${size && `size=${size}`}`);
  }

  loadHistoryRange(world: string, id: string, from: string, to: string) {
    return this.http.get(`${apiUrl}/alliance/rangehistory?${world && `world=${world}&`}${id && `id=${id}&`}${from && `from=${from}&`}${to && `to=${to}`}`);
  }

  loadMembers(world: string, id: string) {
    return this.http.get(`${apiUrl}/alliance/members?${world && `world=${world}&`}${id && `id=${id}`}`);
  }

  loadDayDifferences(world: string) {
    return this.http.get(`${apiUrl}/alliance/daydiffs?${world && `world=${world}`}`);
  }

  loadScoreboard(world: string, date: string, server: string) {
    return this.http.get(`${apiUrl}/scoreboard/alliance?${world && `world=${world}&`}${server && `server=${server}&`}${date && `date=${date}`}`);
  }
}
