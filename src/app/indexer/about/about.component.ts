import { Component, OnInit } from '@angular/core';
import {IndexerService} from '../../shared/services/indexer.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'indexer-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  providers: [IndexerService]
})
export class AboutComponent implements OnInit {

  stats: any = '';
  error = '';
  openingIndex = false;

  constructor(
    private indexerService: IndexerService,
    private route: ActivatedRoute,
  ) {
    this.route.params.subscribe( params => this.load(params));
  }

  ngOnInit(): void {
  }

  private load(params) {
    this.indexerService.getStats().subscribe(
      (response) => this.stats = response,
      (error) => this.stats = ''
    );
  }

  openIndex() {

  }

  newIndex() {

  }

  showForgotDialog() {

  }

}
