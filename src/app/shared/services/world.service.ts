import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import {environment} from '../../../environments/environment';
import {Globals} from '../../globals';
import { mergeMap, map } from 'rxjs/operators';

const apiUrl = environment.apiUrl;

@Injectable()
export class WorldService {
  userLocale: string;
  userCountry: string;
  servers = ['ar', 'br', 'cz', 'de', 'dk', 'en', 'es', 'fi', 'fr', 'gr', 'hu', 'it', 'nl', 'no', 'pl', 'pt', 'ro', 'ru', 'se', 'sk', 'tr', 'us'];

  constructor(private http: HttpClient,
              private localStorage: LocalStorageService,
              private globals: Globals) {
                this.userLocale = navigator.language.slice(0, 2);
                this.userCountry = navigator.language.slice(3, 5).toLowerCase()
              }

  getDefaultServer() {
      if (this.globals.get_active_server()) return this.globals.get_active_server();

      switch(this.userCountry) {
        case 'us': return 'us';
        case 'gb': return 'en';
        default: this.servers.includes(this.userLocale) ? this.userLocale : this.servers.includes(this.userCountry) ? this.userCountry : 'en';
      }
  }


  getServers() {
    return this.servers;
  }

  getWorlds() {
    let url =  '/world/active';
    let data = LocalStorageService.get(url);
    if (data !== false) {
      return new Promise(resolve => {
        resolve(data)
      });
    } else {
      return new Promise(resolve =>
      {
        this.loadWorlds().subscribe(
          (response) => {
            LocalStorageService.set(url, response, (20));
            resolve(response);
          });
      });
    }
  }

  loadWorlds() {
    let url =  '/world/active';
    return this.http.get(apiUrl + url);
  }

  filterWorldList(list: Array<any>, worldId: string) {
    return list.filter((record) => record.server === worldId.slice(0, 2))[0].worlds.filter((server) => server.id === worldId)[0];
  }

  getWorldInfo(worldId: string) {
    return this.http.get(`${apiUrl}/world/active`).pipe(map(response => { 
        LocalStorageService.set('/world/active', response, (20));
        return response;
      }),
      map((response: any) => this.filterWorldList(response, worldId)));
  }

}
