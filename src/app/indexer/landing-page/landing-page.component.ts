import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {WorldService} from '../../services/world.service';
import {LocalCacheService} from '../../services/local-cache.service';
import {IndexerService} from '../indexer.service';
import {JwtService} from '../../auth/services/jwt.service';
import {Globals} from '../../globals';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ContactDialog} from '../../header/header.component';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  providers: [IndexerService, LocalCacheService, WorldService]
})
export class LandingPageComponent implements OnInit, AfterViewInit {
  @ViewChild('databaseStats') databaseStats: ElementRef;

  stats: any = '';
  loading = true;
  show_stats = true;

  single: any[];
  view: any[] = [700, 400];
  colorScheme = {
    domain: [
      '#18bc9c',
      '#f07057',
      '#2686c3',
      '#4CAF50',
      '#FFEB3B',
      '#334254',
      '#673AB7',
      '#F44336']
  };
  cardColor: string = '#232837';
  stats_data: any[];

  constructor(
    private globals: Globals,
    private indexerService: IndexerService,
    public router: Router,
    public authService: JwtService,
    public dialog: MatDialog) {
    if (authService.refreshToken) {
      this.router.navigate(['/profile']);
    }
  }

  ngOnInit() {
    this.indexerService.getStats().subscribe(
      (response) => {
        this.stats = response
        this.stats_data = [
          {
            "name": "Registered Users (+24hr)",
            "value": this.stats.now.user_count,
            "extra": this.stats.now.user_count - this.stats.yesterday.user_count,
          },
          {
            "name": "Teams Created (+24hr)",
            "value": this.stats.now.index_count,
            "extra": this.stats.now.index_count - this.stats.yesterday.index_count,
          },
          {
            "name": "Reports Indexed (+24hr)",
            "value": this.stats.now.reports,
            "extra": this.stats.now.reports - this.stats.yesterday.reports,
          },
          // {
          //   "name": "Unique Towns (+24hr)",
          //   "value": this.stats.now.town_count,
          //   "extra": this.stats.now.town_count - this.stats.yesterday.town_count,
          // },
          {
            "name": "Commands Shared (+24hr)",
            "value": this.stats.now.commands_count,
            "extra": this.stats.now.commands_today,
          }
        ]
      },
      (error) => this.stats = ''
    );
  }

  ngAfterViewInit() {
    // setTimeout(_ => {
    //   this.checkScroll();
    // }, 1000)
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }

  // @HostListener('window:scroll')
  // checkScroll() {
  //   const windowHeight = window.innerHeight;
  //   if (!this.show_stats && this.databaseStats && this.databaseStats.nativeElement.getBoundingClientRect().top+150 <= windowHeight) {
  //     this.show_stats = true;
  //   }
  // }

  formatStatValue(event) {
    if ('data' in event && 'extra' in event.data && event.data.extra!==null) {
      return `${event.value.toLocaleString()} (+${event.data.extra.toLocaleString()})`;
    } else {
      return event.value.toLocaleString();
    }
  }

  viewDetails() {
    this.router.navigate(['/analytics']);
  }
}
