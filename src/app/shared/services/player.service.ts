import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map} from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Player } from "../core/interfaces/player";
import { ApiResponse } from '../core/interfaces/responses/api-response';
import { PlayerDifferenceResponse } from '../core/interfaces/responses/player-difference-response';
import { PlayerDifference } from '../core/interfaces/player-difference';

@Injectable()
export class PlayerService {
  constructor(private http: HttpClient) {}


  fetchPlayersByName(name: string): Observable<Player[]> {
    return this.http.get(`https://api.grepodata.com/player/search?query=${name}`).pipe(map((response: ApiResponse<Player[]>) => response.results));
  }

  fetchDifferenceForWorld(world: string): Observable<PlayerDifferenceResponse> {
    return this.http.get(`https://api.grepodata.com/player/diffs?world=${world}`).pipe(map((response: PlayerDifferenceResponse) =>response));
  }
}
