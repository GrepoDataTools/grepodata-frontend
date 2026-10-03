import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-indexer-breadcrumbs',
  templateUrl: './indexer-breadcrumbs.component.html'
})
export class IndexerBreadcrumbsComponent implements OnInit {

  @Input() data: any;
  @Input() type: any = 'default';

  expandedPlayer = false;
  expandedAlliance = false;
  expandedTeams = false;

  constructor(
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
  }

  togglePlayer(show) {
    this.expandedPlayer = show;
    this.cdr.detectChanges();
  }

  toggleAlliance(show) {
    this.expandedAlliance = show;
    this.cdr.detectChanges();
  }

  toggleTeams(show) {
    this.expandedTeams = show;
    this.cdr.detectChanges();
  }

}
