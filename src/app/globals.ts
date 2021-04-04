// globals.ts
import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class Globals {
  ACTIVE_WORLD        = 'active_world';
  ACTIVE_SERVER       = 'active_server';
  ACTIVE_INDEX        = 'active_index';
  ACTIVE_INTEL_WORLD  = 'active_intel_worlds';
  ACTIVE_SCRIPT_TOKEN = 'active_script_token';

  private active_world:   string = '';
  private active_server:  string = '';
  private active_index:   string = '';
  private active_token:   string = '';
  private active_intel:   any = null;
  private show_duplicates: any = false;
  public duplicateVisChange: EventEmitter<any> = new EventEmitter();

  get_active_world() {
    if (this.active_world != '') {
      return this.active_world;
    } else if (localStorage.getItem(this.ACTIVE_WORLD)) {
      return localStorage.getItem(this.ACTIVE_WORLD);
    } else {
      return false;
    }
  }
  set_active_world(world) {
    this.active_world = world;
    localStorage.setItem(this.ACTIVE_WORLD, world);
  }

  get_active_script_token() {
    if (this.active_token != '') {
      return this.active_token;
    } else if (localStorage.getItem(this.ACTIVE_SCRIPT_TOKEN)) {
      return localStorage.getItem(this.ACTIVE_SCRIPT_TOKEN);
    } else {
      return false;
    }
  }
  set_active_script_token(active_token) {
    this.active_token = active_token;
    localStorage.setItem(this.ACTIVE_SCRIPT_TOKEN, active_token);
  }
  delete_active_script_token() {
    localStorage.removeItem(this.ACTIVE_SCRIPT_TOKEN);
  }


  get_active_server() {
    if (this.active_server != '') {
      return this.active_server;
    } else if (localStorage.getItem(this.ACTIVE_SERVER)) {
      return localStorage.getItem(this.ACTIVE_SERVER);
    } else {
      return false;
    }
  }
  set_active_server(server) {
    this.active_server = server;
    localStorage.setItem(this.ACTIVE_SERVER, server);
  }

  // get_active_index() {
  //   if (this.active_index != '') {
  //     return this.active_index;
  //   } else if (localStorage.getItem(this.ACTIVE_INDEX)) {
  //     return localStorage.getItem(this.ACTIVE_INDEX);
  //   } else {
  //     return false;
  //   }
  // }
  // set_active_index(index) {
  //   this.active_index = index;
  //   if (index == '') {
  //     localStorage.removeItem(this.ACTIVE_INDEX);
  //   } else {
  //     localStorage.setItem(this.ACTIVE_INDEX, index);
  //   }
  // }

  /**
   * Return a list of all worlds where intel is available
   * @returns {any}
   */
  get_active_intel() {
    if (this.active_intel !== null) {
      return this.active_intel;
    } else if (localStorage.getItem(this.ACTIVE_INTEL_WORLD)) {
      return JSON.parse(localStorage.getItem(this.ACTIVE_INTEL_WORLD));
    } else {
      return false;
    }
  }

  /**
   * Sets a flag to indicate that the given world has intel
   * @param world
   */
  set_active_intel(world) {
    let intel = this.get_active_intel();
    if (intel !== false) {
      this.active_intel = intel;
    } else {
      this.active_intel = {}
    }
    this.active_intel[world] = true;
    localStorage.setItem(this.ACTIVE_INTEL_WORLD, JSON.stringify(this.active_intel));
  }

  get_show_duplicates() {
    return this.show_duplicates;
  }
  set_show_duplicates(show_duplicates) {
    this.show_duplicates = show_duplicates;
    this.duplicateVisChange.emit(this.show_duplicates);
  }

  // Get V1 keys from local storage
  get_v1_keys() {
    try {
      let storage_key = 'gd_key_list_v1';
      let migration_complete = 'gd_migration_complete';
      if (!localStorage.getItem(migration_complete) && localStorage.getItem(storage_key)) {
        let keys = JSON.parse(localStorage.getItem(storage_key));
        console.log('Loaded V1 keys from local storage: ', keys);
        return keys;
      }
      return false;
    } catch (e) {
      console.log('Error loading v1 keys: ', e);
    }
  }
  set_migration_complete() {
    let migration_complete = 'gd_migration_complete'
    localStorage.setItem(migration_complete, 'true');
  }
}
