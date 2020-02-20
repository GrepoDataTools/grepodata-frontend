import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {ActivatedRoute, Router} from '@angular/router';
import {AllianceService} from '../alliance/alliance.service';
import {PlayerService} from '../player/player.service';
import {ScoreboardService} from '../scoreboard/scoreboard.service';

@Component({
  selector: 'app-alliance-change',
  templateUrl: './alliance-change.component.html',
  styleUrls: ['./alliance-change.component.scss'],
  providers: [AllianceService, PlayerService]
})
export class AllianceChangeComponent implements OnInit {


  loading = false;
  noData = false;
  name = '';
  type = '';
  world = '';
  id = 0;
  data = [];
  from = 0;
  size = 30;
  count = 0;
  pageEvent: PageEvent;

  constructor(
    public playerService : PlayerService,
    public allianceService : AllianceService,
    public router: Router, private route: ActivatedRoute) {
    this.route.params.subscribe( params => this.load(params));
  }

  ngOnInit() {}

  paginatorEvent($event) {
    this.pageEvent = $event;
    if (typeof this.pageEvent != 'undefined') {
      this.from = this.pageEvent.pageIndex * this.pageEvent.pageSize;
      this.size = this.pageEvent.pageSize;
      this.load({
        'type': this.type,
        'world': this.world,
        'id': this.id
      });
    }
  }

  private load(params) {
    // Reset
    this.loading = true;

    // Save params
    this.type = params['type'];
    this.world = params['world'];
    this.id = params['id'];

    if (this.type == 'player') {
      this.playerService.loadPlayerChanges(this.world, this.id, this.from, this.size).subscribe(
        (response) => this.renderChanges(response),
        (error) => this.renderChanges(null)
      );
    } else if (this.type == 'alliance') {
      this.allianceService.loadAllianceChanges(this.world, this.id, this.from, this.size).subscribe(
        (response) => this.renderChanges(response),
        (error) => this.renderChanges(null)
      );
    }
  }

  renderChanges(data) {
    if (data == null || data.count == null || data.count <= 0) {
      this.noData = true;
      this.count = 0;
      this.data = [];
    } else {
      if (this.count != data.count) this.count = data.count;
      this.noData = false;
      this.data = data.items;
      for (let i of this.data) {
        if (this.name == '') {
          if (this.type == 'player') {
            this.name = i.player_name;
          } else if (this.type == 'alliance') {
            if (i.new_alliance_grep_id == this.id) {
              this.name = i.new_alliance_name;
            } else if (i.old_alliance_grep_id == this.id) {
              this.name = i.new_alliance_name
            }
          }
        }
      }
    }
    this.loading = false;
  }

}
