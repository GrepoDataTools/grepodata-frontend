import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IndexerService} from '../../indexer/indexer.service';

@Component({
  selector: 'app-demo-overview',
  templateUrl: './demo-overview.component.html',
  styleUrls: ['./demo-overview.component.scss'],
  providers: [IndexerService]
})
export class DemoOverviewComponent {

  world
  data

  constructor(
    private route: ActivatedRoute,
    private indexerService: IndexerService
  ) {
    this.route.params.subscribe( params => {
      this.world = params.world;
      this.loadCommands();
    });
  }

  loadCommands() {
    this.indexerService.getCommandOverview(this.world, this.world).subscribe(response => {
      this.data = response;
    })
  }


}
