import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from "../../../environments/environment";

const apiUrl = environment.apiUrl;
@Injectable()
export class IndexService {

	constructor(
	  private http: HttpClient
  ) {}

	getIndexUsers(access_token, index) {
    let data = new HttpParams()
      .set('access_token', access_token)
      .set('index_key', index);
		return this.http.get<any>(apiUrl + '/indexer/settings/users', {
			params: data
		});
	}

	setIndexUserRole(access_token, index, user_id, role) {
    let data = new HttpParams()
      .set('user_id', user_id)
      .set('role', role)
      .set('index_key', index);
		return this.http.put<any>(apiUrl + '/indexer/settings/users', data,
      {headers: new HttpHeaders({'access_token':access_token})}
    );
	}

	removeIndexUser(access_token, index, user_id) {
    let data = new HttpParams()
      .set('access_token', access_token)
      .set('user_id', user_id)
      .set('index_key', index);
		return this.http.delete<any>(apiUrl + '/indexer/settings/users', {
			params: data
		});
	}

	getIndexOwners(access_token, index) {
    let data = new HttpParams()
      .set('access_token', access_token)
      .set('index_key', index);
		return this.http.get<any>(apiUrl + '/indexer/settings/owners', {
			params: data
		});
	}

}
