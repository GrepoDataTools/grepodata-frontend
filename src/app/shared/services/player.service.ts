import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Player } from "../core/interfaces/player";
import { ApiResponse } from '../core/interfaces/responses/api-response';
import { PlayerDifferenceResponse } from '../core/interfaces/responses/player-difference-response';
import { environment } from '../../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable()
export class PlayerService {
  constructor(private http: HttpClient) { }


  searchByName(name: string): Observable<Player[]> {
    return this.http.get(`${apiUrl}/player/search?query=${name}`).pipe(map((response: ApiResponse<Player[]>) => response.results));
  }

  loadDifferences(world: string): Observable<PlayerDifferenceResponse> {
    return this.http.get<PlayerDifferenceResponse>(`${apiUrl}/player/diffs?${world ? `world=${world}` :  ''}`);
  }

  loadScoreboard(world: string, date: string, server: string) {
    return this.http.get(`${apiUrl}/scoreboard/player?${world ? `world=${world}&` :  ''}${server ? `server=${server}&` :  ''}${date ? `date=${date}` :  ''}`);
  }

  loadHourDifferences(world: string, date: string, server: string) {
    return this.http.get(`${apiUrl}/scoreboard/hourdiffs?${world ? `world=${world}&` :  ''}${server ? `server=${server}&` :  ''}${date ? `date=${date}` :  ''}`);
  }

  loadDayDifferences(world: string, date: string, id: string) {
    return this.http.get(`${apiUrl}/player/daydiffs?${world ? `world=${world}&` :  ''}${id ? `id=${id}&` :  ''}${date ? `date=${date}` :  ''}`);
  }

  loadInfo(world: string, id: string, name: boolean) {
    return this.http.get(`${apiUrl}/player/info?${world ? `world=${world}&` :  ''}${id ? `id=${id}&` :  ''}${name ? `a_name=${name}` :  ''}`);
  }

  loadHistory(world: string, id: string) {
    return this.http.get(`${apiUrl}/player/history?${world ? `world=${world}&` :  ''}${id ? `id=${id}` :  ''}`);
  }

  loadChanges(world: string, id: any, from: any = undefined, size: any = undefined) {
    return this.http.get(`${apiUrl}/player/changes?${world ? `world=${world}&` :  ''}${id ? `id=${id}&` :  ''}${from ? `from=${from}&` :  ''}${size ? `size=${size}` :  ''}`);
  }

  loadHistoryRange(world: string, id: string, from: string, to: string) {
    return this.http.get(`${apiUrl}/player/rangehistory?${world ? `world=${world}&` :  ''}${id ? `id=${id}&` :  ''}${from ? `from=${from}&` :  ''}${to ? `to=${to}` :  ''}`);
  }

  getTowns(world: string, id: number) {
    return this.http.get(`${apiUrl}/town/player?${world ? `world=${world}&` :  ''}${id ? `id=${id}` :  ''}`);
  }
}
