import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {JwtService} from "./jwt.service";
import {Router} from "@angular/router";
import {environment} from '../../../environments/environment';

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
     //  .pipe(catchError((err: HttpErrorResponse) => {
		// 	if (err.status === 401) {
		// 		console.log('Redirecting to login');
		// 		this.authService.logout();
		// 		this.router.navigate(['/auth/login']);
		// 	} else {
		// 		console.error(err.error);
		// 	}
		// 	return new empty<Response>();
		// }));
	}
}

export interface IndexList {
	key: string;
	world: string;
	created_at: any;
	updated_at: any;
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
