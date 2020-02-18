import { Component, OnInit } from '@angular/core';
import { WorldService } from '../shared/services/world.service';

@Component({
  selector: 'app-indexer',
  templateUrl: './indexer.component.html',
  styleUrls: ['./indexer.component.scss']
})
export class IndexerComponent implements OnInit {

  constructor(private worldService: WorldService) { }

  ngOnInit(): void {
    console.log(this.worldService.getDefaultServer())
  }

}
