import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Globals} from '../../globals';
import {IndexerService} from '../indexer.service';
import {ActivatedRoute, Router} from '@angular/router';
import {JwtService} from '../../auth/services/jwt.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  providers: [IndexerService, JwtService]
})
export class EventListComponent implements OnChanges {

  @Input() key : string;
  @Input() update : string;

  events : any = [];
  loading = true;
  paging = false;
  total_events = 0;
  error = '';
  from = 0;
  size = 10;
  pageEvent : any;

  constructor(
    private indexerService: IndexerService,
    private authService: JwtService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.load();
  }

  load () {
    if (this.key !== null) {
      // Load all events for a specific team
      this.getTeamEvents();
    } else {
      // Load all events for the current user
      // this.getUserEvents();
    }
  }

  public getTeamEvents() {
    this.paging = true;
    this.error = '';
    this.authService.accessToken().then(access_token => {
      this.indexerService.getTeamEvents(access_token, this.key, this.from, this.size).subscribe(
        (response) => {
          if ('total' in response) {
            this.total_events = response['total'];
          } else if (this.total_events <= 0) {
            this.total_events = response['count'];
          }
          this.events = response['items'];
          this.loading = false;
          this.paging = false;
          this.error = '';
          console.log(this.events);
        },
        (error) => {
          this.loading = false;
          this.paging = false;
          this.error = 'error'
        }
      );
    });
  }

  paginatorEvent($event) {
    this.pageEvent = $event;
    if (typeof this.pageEvent != 'undefined') {
      this.from = this.pageEvent.pageIndex * this.pageEvent.pageSize;
      this.size = this.pageEvent.pageSize;
      this.load();
    }
  }

  // public getUserEvents() {
  //   this.authService.accessToken().then(access_token => {
  //     this.indexerService.getUserEvents(access_token).subscribe(
  //       (response) => {
  //         this.events = response['items'];
  //         this.loading = false;
  //         this.error = '';
  //         console.log(this.events);
  //       },
  //       (error) => {
  //         this.loading = false;
  //         this.error = 'error'
  //       }
  //     );
  //   });
  // }

}
