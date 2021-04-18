import { Component, OnInit } from '@angular/core';
import {WorldService} from "../services/world.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Globals} from '../globals';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  providers: [WorldService]
})
export class ContentComponent implements OnInit {

  worldData = '';
  servers = [];
  worlds = [];
  server: any = 'en';
  world: any = '';

  constructor(
    private globals: Globals,
    private worldService: WorldService,
    private router: Router,
    private route: ActivatedRoute) {
    this.server = worldService.getDefaultServer();
    this.worldService.getWorlds().then((response) => this.loadWorlds(response));
    if (this.globals.get_active_world() !== false) {
      this.world = this.globals.get_active_world();
      this.server = this.world.substr(0,2);
    } else {
      this.world = '';
    }
  }

  ngOnInit() {}

  loadWorlds(worldData) {
    this.worldData = worldData;
    this.servers = [];
    this.worlds = [];
    for (let i of this.worldData) {
      this.servers.push((<any>i).server);
      if ((<any>i).server == this.server) {
        if (!this.world) {
          this.world = (<any>i).worlds[0].id;
          this.globals.set_active_world(this.world);
          this.globals.set_active_server(this.world.substr(0,2));
        }
        for (let w of (<any>i).worlds) {
          this.worlds.push(w);
        }
      }
    }

    // Cache data
    // LocalCacheService.set('worlds', json);
  }

  loadScoreboard() {
    this.router.navigate(['/points'], { queryParams: { world: this.world} });
  }

  loadRanking() {
    this.router.navigate(['/ranking/'+this.world]);
  }

  setWorld(event) {
    this.world = event;
    this.globals.set_active_world(event);
    this.globals.set_active_server(event.substr(0,2));
  }

  updateWorlds(event) {
    this.server = event;
    this.world = '';
    this.loadWorlds(this.worldData);
  }

}
