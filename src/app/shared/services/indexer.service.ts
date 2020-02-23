import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from '../../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable()
export class IndexerService {

  constructor(private http: HttpClient) {}

  getStats() {
    return this.http.get(`${apiUrl}/indexer/stats`);
  }
  getIndex(key, access_token = '') {
    return this.http.get(`${apiUrl}/indexer/getindex?key=${key}&access_token=${access_token}`);
  }
  getWorlds() {
    return this.http.get(`${apiUrl}/indexer/worlds`);
  }
  isValid(key) {
    return this.http.get(`${apiUrl}/indexer/isvalid?key=${key}`);
  }
  createNewIndex(access_token, world, captcha) {
    if (captcha == '' || captcha == undefined) captcha = '_';
    return this.http.get<any>(`${apiUrl}/indexer/newindex?access_token=${access_token}&world=${world}&captcha=${captcha}`);
  }
  updateIndexKey(key, mail, captcha) {
    if (captcha == '' || captcha == undefined) captcha = '_';
    let url =  '/indexer/newkey?key='+key+'&mail='+mail+'&captcha='+captcha;
    return this.http.get<any>(apiUrl + url);
  }
	requestCleanupSession(key, mail, captcha) {
    if (captcha == '' || captcha == undefined) captcha = '_';
    let url =  '/indexer/cleanup?key='+key+'&mail='+mail+'&captcha='+captcha;
    return this.http.get<any>(apiUrl + url);
  }
	forgotIndexKeys(mail, captcha) {
    if (captcha == '' || captcha == undefined) captcha = '_';
    let url =  '/indexer/forgotkeys?mail='+mail+'&captcha='+captcha;
    return this.http.get<any>(apiUrl + url);
  }
  confirmAction(token) {
    let url =  '/indexer/confirmaction?token='+token;
    return this.http.get<any>(apiUrl + url);
  }

  resetIndexOwners(key, mail, captcha) {
    if (captcha == '' || captcha == undefined) captcha = '_';
    let url =  '/indexer/owner/reset?key='+key+'&mail='+mail+'&captcha='+captcha;
    return this.http.get<any>(apiUrl + url);
  }
  excludeIndexOwner(key, mail, captcha, id) {
    if (captcha == '' || captcha == undefined) captcha = '_';
    let url =  '/indexer/owner/exclude?key='+key+'&mail='+mail+'&alliance_id='+id+'&captcha='+captcha;
    return this.http.get<any>(apiUrl + url);
  }
  includeIndexOwner(key, mail, captcha, id) {
    if (captcha == '' || captcha == undefined) captcha = '_';
    let url =  '/indexer/owner/include?key='+key+'&mail='+mail+'&alliance_id='+id+'&captcha='+captcha;
    return this.http.get<any>(apiUrl + url);
  }

	deleteRecordById(csa, key, id) {
		console.log('delete ', id);
		let url =  '/indexer/delete?csa='+csa+'&key='+key+'&id='+id;
		return this.http.get(apiUrl + url);
	}
	deleteRecordUndo(csa, key, id) {
		console.log('delete undo ', id);
		let url =  '/indexer/undodelete?csa='+csa+'&key='+key+'&id='+id;
		return this.http.get(apiUrl + url);
	}

  loadPlayerIntel(key, id) {
    let url =  '/indexer/player?key='+key+'&id='+id;
    return this.http.get(apiUrl + url);
  }
  loadAllianceIntel(key, id) {
    let url =  '/indexer/alliance?key='+key+'&id='+id;
    return this.http.get(apiUrl + url);
  }
  loadTownIntel(key, id) {
    // let url =  '/indexer/town?key='+key+'&id='+id;
    let url =  '/indexer/api/town?key='+key+'&id='+id;
    return this.http.get(apiUrl + url);
  }

}
