// globals.ts
import { Injectable } from '@angular/core';
import {WorldService} from './shared/services/world.service';

@Injectable()
export class Globals {
  ACTIVE_WORLD        = 'active_world';
  ACTIVE_SERVER       = 'active_server';
  ACTIVE_INDEX        = 'active_index';
  ACTIVE_INTEL_WORLD  = 'active_intel_worlds';

  private active_world:   string = '';
  private active_server:  string = '';
  private active_index:   string = '';
  private active_intel:   any = null;

  constructor(private worldService: WorldService) {
  }

  get_active_world() {
    if (this.active_world != '') {
      return this.active_world;
    } else if (localStorage.getItem(this.ACTIVE_WORLD)) {
      return localStorage.getItem(this.ACTIVE_WORLD);
    } else {
      return this.worldService.getNewestWorldForServer(this.worldService.getDefaultServer());
    }
  }
  set_active_world(world) {
    this.active_world = world;
    localStorage.setItem(this.ACTIVE_WORLD, world);
  }

  get_active_server() {
    if (this.active_server != '') {
      return this.active_server;
    } else if (localStorage.getItem(this.ACTIVE_SERVER)) {
      return localStorage.getItem(this.ACTIVE_SERVER);
    } else {
      return this.worldService.getDefaultServer();
    }
  }
  set_active_server(server) {
    this.active_server = server;
    localStorage.setItem(this.ACTIVE_SERVER, server);
  }

  get_active_index() {
    if (this.active_index != '') {
      return this.active_index;
    } else if (localStorage.getItem(this.ACTIVE_INDEX)) {
      return localStorage.getItem(this.ACTIVE_INDEX);
    } else {
      return false;
    }
  }
  set_active_index(index) {
    this.active_index = index;
    if (index == '') {
      localStorage.removeItem(this.ACTIVE_INDEX);
    } else {
      localStorage.setItem(this.ACTIVE_INDEX, index);
    }
  }

  get_active_intel() {
    if (this.active_intel !== null) {
      return this.active_intel;
    } else if (localStorage.getItem(this.ACTIVE_INTEL_WORLD)) {
      return JSON.parse(localStorage.getItem(this.ACTIVE_INTEL_WORLD));
    } else {
      return false;
    }
  }
  set_active_intel(world, index) {
    let intel = this.get_active_intel();
    if (intel !== false) {
      this.active_intel = intel;
    } else {
      this.active_intel = {}
    }
    this.active_intel[world] = index;
    localStorage.setItem(this.ACTIVE_INTEL_WORLD, JSON.stringify(this.active_intel));
  }
}
