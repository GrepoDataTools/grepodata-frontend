import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IndexerService} from '../../indexer/indexer.service';
import * as moment from 'moment';

@Component({
  selector: 'app-demo-overview',
  templateUrl: './demo-overview.component.html',
  styleUrls: ['./demo-overview.component.scss'],
  providers: [IndexerService]
})
export class DemoOverviewComponent {

  world
  data
  refresh_interval

  constructor(
    private route: ActivatedRoute,
    private indexerService: IndexerService
  ) {
    this.route.params.subscribe( params => {
      this.world = params.key;
      this.loadCommands();
    });

    this.refresh_interval = setInterval(_ => {this.updateEta()}, 1000);
  }

  loadCommands() {
    this.indexerService.getCommandOverview(this.world, this.world).subscribe(response => {
      this.data = response;
      this.updateEta();
    })
  }

  updateEta() {
    console.log(this.data)
    if (!this.data || !this.data.items || this.data.items.length <= 0) {
      return;
    }
    let now = (+ new Date()) / 1000;
    this.data.items.map(command => {
      let seconds = command.arrival_at - now;
      let hours = Math.floor(seconds / 3600);
      let minutes = Math.floor((seconds % 3600) / 60);
      let ss = Math.floor(seconds % 60);
      command.eta = hours + ':' + (minutes<10?'0':'') + minutes + ':' + (ss<10?'0':'') + ss;
      return command;
    });
    console.log(this.data)
  }


}
