import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {JwtService} from "./jwt.service";
import {Router} from "@angular/router";
import {catchError} from 'rxjs/operators';

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
