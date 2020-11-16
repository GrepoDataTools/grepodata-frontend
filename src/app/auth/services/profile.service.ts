import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {JwtService} from "./jwt.service";
import {Router} from "@angular/router";
import {catchError, tap} from 'rxjs/operators';

const apiUrl = environment.apiUrl;
@Injectable()
export class ProfileService {

	constructor(private http: HttpClient,
							private authService: JwtService,
							private router: Router) {}

	getIndexes() {
		return this.http.get<any>(apiUrl + '/profile/indexes', {
			params: new HttpParams().set('access_token', this.authService.accessToken)
		});
	}

	getLinkedAccounts() {
		return this.http.get<any>(apiUrl + '/profile/linked', {
			params: new HttpParams().set('access_token', this.authService.accessToken)
		});
	}

  addLinkedAccounts(player_id, player_name, server) {
    let data = new HttpParams()
      .set('access_token', this.authService.accessToken)
      .set('player_id', player_id)
      .set('player_name', player_name)
      .set('server', server);
    return this.http.post<any>(apiUrl + '/profile/addlinked', data,
      {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'})})
	}

  unlinkAccount(player_id, server) {
    let data = new HttpParams()
      .set('access_token', this.authService.accessToken)
      .set('player_id', player_id)
      .set('server', server);
    return this.http.post<any>(apiUrl + '/profile/removelinked', data,
      {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'})})
	}

  getUserIntel(from = 0, size = 20) {
    return this.http.get<any>(apiUrl + '/indexer/v2/userintel', {
      params: new HttpParams()
        .set('access_token', this.authService.accessToken)
        .set('from', String(from))
        .set('size', String(size))
    });
  }
}

export interface LinkedAccount {
	user_id: string;
	player_id: string;
  player_name: string;
  server: string;
	confirmed: boolean;
	town_token: string;
}

export interface IndexList {
	key: string;
	name: string;
	role: string;
	world: string;
	contribute: any;
	overview: IndexOverview;
}

export interface IndexOverview {
	owners: any,
	contributors: any,
	total_reports: number,
	spy_reports: number,
	enemy_attacks: number,
	friendly_attacks: number,
}
