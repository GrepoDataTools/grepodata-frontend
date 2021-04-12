import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LocalCacheService} from "./local-cache.service";
import {environment} from "../../environments/environment";
import {Globals} from '../globals';

const apiUrl = environment.apiUrl;

@Injectable()
export class WorldService {
	servers = ['ar', 'br', 'cz', 'de', 'dk', 'en', 'es', 'fi', 'fr', 'gr', 'hu', 'it', 'nl', 'no', 'pl', 'pt', 'ro', 'ru', 'se', 'sk', 'tr', 'us'];

  constructor(private http: HttpClient,
              private globals: Globals,
              private cache: LocalCacheService) {}

  getDefaultServer() {
    try {
    	let active_server = this.globals.get_active_server();
      if (active_server !== false) {
        return active_server;
      }

      let userLang = navigator.language || navigator['userLanguage'];
      userLang = userLang.toLowerCase();
      if (userLang === 'nl' || userLang === 'nl-nl' || userLang === 'nl-be') {
        return 'nl';
      } else if (userLang === 'fr' || userLang === 'fr-fr') {
        return 'fr';
      } else if (userLang === 'de' || userLang === 'de-de') {
        return 'de';
      } else if (userLang === 'en' || userLang === 'en-gb') {
        return 'en';
      } else if (userLang === 'en-us') {
        return 'us';
      } else {
      	// Match BCP47 country (prefixed by '-')
				let match = this.servers.filter(server => (userLang.search('-'+server) != -1));
				if (match.length > 0) {
					console.log("matched country: " + match[0]);
					return match[0];
				}

				// Match BCP47 language
      	match = this.servers.filter(server => (userLang.search(server) != -1));
				if (match.length > 0) {
					console.log("matched language: " + match[0]);
      		return match[0];
				} else {
      		return 'en';
				}
			}
    } catch (e) {}
    return 'en';
  }

  getServers() {
  	return this.servers;
	}

  getWorlds() {
      let url =  '/world/active';
      let data = LocalCacheService.get(url);
      if (data !== false) {
        return new Promise(resolve => {
          resolve(data)
        });
      } else {
        return new Promise(resolve =>
        {
          this.loadWorlds().subscribe(
            (response) => {
              LocalCacheService.set(url, response, (20));
              resolve(response);
          });
        });
      }
  }

  /**
   * Return the local world information from caache (ignore the data expiration)
   * @returns {boolean | any}
   */
  static getLocalWorlds() {
      let url =  '/world/active';
      return LocalCacheService.get(url, true);
  }

  loadWorlds() {
    let url =  '/world/active';
    return this.http.get(apiUrl + url);
  }

  getWorldInfo(id) {
    return this.getWorlds().then((response) => {
      for (let i of (<any>response)) {
        for (let w of (<any>i).worlds) {
          if (w.id == id)  {
            return w;
          }
        }
      }
    });
  }

  getLocalWorldInfo(id) {
    let localWorlds = WorldService.getLocalWorlds();
    if (!localWorlds) return false;
    for (let i of (<any>localWorlds)) {
      for (let w of (<any>i).worlds) {
        if (w.id == id)  {
          return w;
        }
      }
    }
  }

}
