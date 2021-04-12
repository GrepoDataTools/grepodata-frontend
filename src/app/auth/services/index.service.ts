import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {Globals} from '../../globals';

const apiUrl = environment.apiUrl;
@Injectable()
export class IndexAuthService {

	constructor(
	  private http: HttpClient,
    private globals: Globals
  ) {}

	getIndexUsers(access_token, index) {
    let data = new HttpParams()
      .set('index_key', index);
		return this.http.get<any>(apiUrl + '/indexer/settings/users', {
			params: data,
      headers: new HttpHeaders({'access_token': access_token})
		});
	}

	addIndexUser(access_token, index, user_id) {
    let data = new HttpParams()
      .set('index_key', index)
      .set('user_id', user_id);
		return this.http.post<any>(apiUrl + '/indexer/settings/users', data, {
      headers: new HttpHeaders({'access_token': access_token})
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
      .set('user_id', user_id)
      .set('index_key', index);
		return this.http.delete<any>(apiUrl + '/indexer/settings/users', {
			params: data,
      headers: new HttpHeaders({'access_token': access_token})
		});
	}

  setIndexDeleteDays(access_token, index, num_days) {
    let data = new HttpParams()
      .set('num_days', num_days)
      .set('index_key', index);
    return this.http.put<any>(apiUrl + '/indexer/settings/deletedays', data,
      {headers: new HttpHeaders({'access_token':access_token})}
    );
  }

  setIndexV1Join(access_token, index, allow_join_v1_key) {
    let data = new HttpParams()
      .set('allow_join_v1_key', allow_join_v1_key)
      .set('index_key', index);
    return this.http.put<any>(apiUrl + '/indexer/settings/joinv1', data,
      {headers: new HttpHeaders({'access_token':access_token})}
    );
  }

	getIndexOwners(access_token, index) {
    let data = new HttpParams()
      .set('index_key', index);
		return this.http.get<any>(apiUrl + '/indexer/settings/owners', {
		  params: data,
      headers: new HttpHeaders({'access_token': access_token})
		});
	}

	setIndexOwnerHidden(access_token, index, alliance_id, is_hidden) {
    let data = new HttpParams()
      .set('index_key', index)
      .set('alliance_id', alliance_id)
      .set('is_hidden', is_hidden);
		return this.http.put<any>(apiUrl + '/indexer/settings/owners', data, {
      headers: new HttpHeaders({'access_token': access_token})
		});
	}

	removeIndexOwner(access_token, index, alliance_id) {
    let data = new HttpParams()
      .set('index_key', index)
      .set('alliance_id', alliance_id);
		return this.http.delete<any>(apiUrl + '/indexer/settings/owners', {
      params: data,
      headers: new HttpHeaders({'access_token': access_token})
		});
	}

	addIndexOwner(access_token, index, alliance_id) {
    let data = new HttpParams()
      .set('index_key', index)
      .set('alliance_id', alliance_id);
		return this.http.post<any>(apiUrl + '/indexer/settings/owners', data, {
      headers: new HttpHeaders({'access_token': access_token})
		});
	}

	leaveIndex(access_token, index) {
    let data = new HttpParams()
      .set('index_key', index);
		return this.http.post<any>(apiUrl + '/indexer/settings/leave', data, {
      headers: new HttpHeaders({'access_token': access_token})
		});
	}

	toggleIndexContribute(access_token, index, contribute) {
    let data = new HttpParams()
      .set('index_key', index)
      .set('contribute', contribute);
		return this.http.put<any>(apiUrl + '/indexer/settings/contribute', data, {
      headers: new HttpHeaders({'access_token': access_token})
		});
	}

	verifyInviteLink(access_token, invite_link) {
    let data = new HttpParams()
      .set('invite_link', invite_link);
    return this.http.post<any>(apiUrl + '/indexer/invite', data, {
      headers: new HttpHeaders({'access_token': access_token})
    });
  }

	importV1Keys(access_token, keys, verbose=false) {
    let data = new HttpParams()
      .set('index_keys', keys);
    if (verbose == true) {
      data = data.set('verbose', 'true');
    }
    return this.http.post<any>(apiUrl + '/migrate/importv1keys', data, {
      headers: new HttpHeaders({'access_token': access_token})
    });
	}

	// Check for V1 keys in local storage and migrate them to authenticated user if logged in
	implicitV1Migration(access_token) {
	  try {
	    console.log('Checking for implicit V1 key migration');
      // Check v1 keys
      let local_v1_keys = this.globals.get_v1_keys();
      if (local_v1_keys) {
        console.log('Found local v1 keys: ', local_v1_keys);
        this.importV1Keys(access_token, local_v1_keys, false).subscribe((response) => {
          console.log('V1 migration response: ', response);
          if (response.success_code && response.success_code === 1400) {
            console.log('migration successful. Removing local v1 keys');
            this.globals.set_migration_complete();
          }
        });
      }
    } catch (e) {
	    console.log('V1 implicit key migration failed: ', e);
    }
  }

}
