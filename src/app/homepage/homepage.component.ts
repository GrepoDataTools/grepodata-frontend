import {ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {DisclaimerDialog} from '../footer/footer.component';
import {MatDialog} from '@angular/material/dialog';
import {ContactDialog} from '../header/header.component';
import {MediaMatcher} from '@angular/cdk/layout';
import {JwtService} from '../auth/services/jwt.service';
import {IndexerService} from '../indexer/indexer.service';
import {LocalCacheService} from '../services/local-cache.service';
import {WorldService} from '../services/world.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  providers: [IndexerService],
  animations: [
    trigger(
      'enterTop',
      [
        transition(
          ':enter',
          [
            style({ transform: 'translateY(-30px)', opacity: 0 }),
            animate('1.5s ease-out',
              style({ transform: 'translateY(0);', opacity: 1 }))
          ]
        )
      ]
    ),
    trigger(
      'enterBot',
      [
        transition(
          ':enter',
          [
            style({ transform: 'translateY(30px)', opacity: 0 }),
            animate('1.5s ease-out',
              style({ transform: 'translateY(0);', opacity: 1 }))
          ]
        )
      ]
    ),
  ]
})
export class HomepageComponent implements OnInit, OnDestroy {
  @ViewChild('headerText') headerText: ElementRef;
  @ViewChild('indexerText') indexerText: ElementRef;

  headerInView = true;
  indexerInView = false;
  loggedOut = false;
  date = new Date();

  mobileQuery: MediaQueryList;
  private readonly _mediaQueryListener: () => void;

  stats: any = '';
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
    public dialog: MatDialog,
    public router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private indexerService: IndexerService,
    private media: MediaMatcher,
    private authService: JwtService
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mediaQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', () => {
      this._mediaQueryListener();
    });

    if (!authService.refreshToken) {
      this.loggedOut = true;
      this.loadIndexerStats();
    }
  }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', () => this._mediaQueryListener());
  }

  ngOnInit(): void {
  }

  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition = window.pageYOffset;
    const windowHeight = window.innerHeight;

    if (this.mobileQuery.matches && this.indexerText && this.indexerText.nativeElement.offsetTop <= scrollPosition + windowHeight) {
      this.indexerInView = true;
    }

    if (!this.mobileQuery.matches) {
      this.headerInView = true;
      return;
    }
    if (this.headerInView) {
      if (this.headerText && this.headerText.nativeElement.offsetTop+150 <= scrollPosition) {
        this.headerInView = false;
      }
    } else {
      if (this.headerText && this.headerText.nativeElement.offsetTop + 50 >= scrollPosition) {
        this.headerInView = true;
      }
    }
  }

  public showDisclaimerDialog(): void {
    let dialogRef = this.dialog.open(DisclaimerDialog, {
      // width: '600px',
      // height: '80%'
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  showContactDialog() {
    let dialogRef = this.dialog.open(ContactDialog, {
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  loadIndexerStats() {
    this.indexerService.getStats().subscribe(
      (response) => {
        this.stats = response
        this.stats_data = [
          {
            "name": "Registered Users",
            "value": this.stats.now.user_count,
            // "extra": this.stats.now.user_count - this.stats.yesterday.user_count,
          },
          {
            "name": "Teams Created",
            "value": this.stats.now.index_count,
            // "extra": this.stats.now.index_count - this.stats.yesterday.index_count,
          },
          {
            "name": "Reports Indexed",
            "value": this.stats.now.reports,
            // "extra": this.stats.now.reports - this.stats.yesterday.reports,
          },
          // {
          //   "name": "Unique Towns (+24hr)",
          //   "value": this.stats.now.town_count,
          //   "extra": this.stats.now.town_count - this.stats.yesterday.town_count,
          // },
          {
            "name": "Commands Shared",
            "value": this.stats.now.commands_count,
            // "extra": this.stats.now.commands_today,
          }
        ]
      },
      (error) => this.stats = ''
    );
  }

  formatStatValue(event) {
    if ('data' in event && 'extra' in event.data && event.data.extra) {
      return `${event.value.toLocaleString()} (+${event.data.extra.toLocaleString()})`;
    } else {
      return event.value.toLocaleString();
    }
  }

  viewDetails() {
    this.router.navigate(['/analytics']);
  }
}
