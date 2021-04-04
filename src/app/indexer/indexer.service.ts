import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Globals} from '../globals';

const apiUrl = environment.apiUrl;

@Injectable()
export class IndexerService {

  constructor(
    private http: HttpClient,
    private globals: Globals
  ) {}

  getStats() {
    let url =  '/indexer/stats';
    return this.http.get(apiUrl + url);
  }
  getIndex(key) {
    this.globals.store_v1_key(key);
    let url =  '/indexer/getindex?key='+key;
    return this.http.get(apiUrl + url);
  }
  getWorlds() {
    let url =  '/indexer/worlds';
    return this.http.get(apiUrl + url);
  }
  isValid(key) {
    this.globals.store_v1_key(key);
    let url =  '/indexer/isvalid?key='+key;
    return this.http.get(apiUrl + url);
  }
  createNewIndex(mail, world, captcha) {
    if (captcha == '' || captcha == undefined) captcha = '_';
    let url =  '/indexer/newindex?mail='+mail+'&world='+world+'&captcha='+captcha;
    return this.http.get<any>(apiUrl + url);
  }
  updateIndexKey(key, mail, captcha) {
    this.globals.store_v1_key(key);
    if (captcha == '' || captcha == undefined) captcha = '_';
    let url =  '/indexer/newkey?key='+key+'&mail='+mail+'&captcha='+captcha;
    return this.http.get<any>(apiUrl + url);
  }
	requestCleanupSession(key, mail, captcha) {
    this.globals.store_v1_key(key);
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
    this.globals.store_v1_key(key);
    if (captcha == '' || captcha == undefined) captcha = '_';
    let url =  '/indexer/owner/reset?key='+key+'&mail='+mail+'&captcha='+captcha;
    return this.http.get<any>(apiUrl + url);
  }
  excludeIndexOwner(key, mail, captcha, id) {
    this.globals.store_v1_key(key);
    if (captcha == '' || captcha == undefined) captcha = '_';
    let url =  '/indexer/owner/exclude?key='+key+'&mail='+mail+'&alliance_id='+id+'&captcha='+captcha;
    return this.http.get<any>(apiUrl + url);
  }
  includeIndexOwner(key, mail, captcha, id) {
    this.globals.store_v1_key(key);
    if (captcha == '' || captcha == undefined) captcha = '_';
    let url =  '/indexer/owner/include?key='+key+'&mail='+mail+'&alliance_id='+id+'&captcha='+captcha;
    return this.http.get<any>(apiUrl + url);
  }

	deleteRecordById(csa, key, id) {
    this.globals.store_v1_key(key);
		console.log('delete ', id);
		let url =  '/indexer/delete?csa='+csa+'&key='+key+'&id='+id;
		return this.http.get(apiUrl + url);
	}
	deleteNoteById(csa, key, id) {
    this.globals.store_v1_key(key);
		console.log('delete ', id);
		let url =  '/indexer/delnote?csa='+csa+'&key='+key+'&note_id='+id;
		return this.http.get(apiUrl + url);
	}
	deleteRecordUndo(csa, key, id) {
    this.globals.store_v1_key(key);
		console.log('delete undo ', id);
		let url =  '/indexer/undodelete?csa='+csa+'&key='+key+'&id='+id;
		return this.http.get(apiUrl + url);
	}

  loadPlayerIntel(key, id) {
    this.globals.store_v1_key(key);
    let url =  '/indexer/player?key='+key+'&id='+id;
    return this.http.get(apiUrl + url);
  }
  loadAllianceIntel(key, id) {
    this.globals.store_v1_key(key);
    let url =  '/indexer/alliance?key='+key+'&id='+id;
    return this.http.get(apiUrl + url);
  }
  loadTownIntel(key, id) {
    this.globals.store_v1_key(key);
    // let url =  '/indexer/town?key='+key+'&id='+id;
    let url =  '/indexer/api/town?key='+key+'&id='+id;
    return this.http.get(apiUrl + url);
  }

  // stats
  loadStatsIndexer() {
    let url = '/analytics/indexer';
    return this.http.get(apiUrl + url);
  }
}
