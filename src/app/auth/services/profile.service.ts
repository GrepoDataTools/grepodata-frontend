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

	getIndexes(access_token, limit = 0, expand_overview = false) {
	  let url = apiUrl + '/profile/indexes';
	  if (expand_overview === true) {
      url = url + '?expand_overview=true';
    }
	  if (limit > 0) {
      url = url + '&limit=' + limit;
    }
		return this.http.get<any>(url, {
      headers: new HttpHeaders({'access_token': access_token})
		});
	}

	getLinkedAccounts(access_token) {
		return this.http.get<any>(apiUrl + '/profile/linked', {
      headers: new HttpHeaders({'access_token': access_token})
		});
	}

  addLinkedAccounts(access_token, player_id, player_name, server) {
    let data = new HttpParams()
      .set('access_token', access_token)
      .set('player_id', player_id)
      .set('player_name', player_name)
      .set('server', server);
    return this.http.post<any>(apiUrl + '/profile/addlinked', data,
      {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'})})
	}

  unlinkAccount(access_token, player_id, server) {
    let data = new HttpParams()
      .set('access_token', access_token)
      .set('player_id', player_id)
      .set('server', server);
    return this.http.post<any>(apiUrl + '/profile/removelinked', data,
      {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'})})
	}

  getUserIntel(access_token, from = 0, size = 20) {
    return this.http.get<any>(apiUrl + '/indexer/v2/userintel', {
      params: new HttpParams()
        .set('access_token', access_token)
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
