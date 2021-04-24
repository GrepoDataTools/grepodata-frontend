import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {DisclaimerDialog} from '../footer/footer.component';
import {MatDialog} from '@angular/material/dialog';
import {ContactDialog} from '../header/header.component';
import {MediaMatcher} from '@angular/cdk/layout';
import {JwtService} from '../auth/services/jwt.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
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
export class HomepageComponent implements OnInit {
  @ViewChild('headerText') headerText: ElementRef;
  @ViewChild('indexerText') indexerText: ElementRef;

  headerInView = true;
  indexerInView = false;
  loggedOut = false;
  date = new Date();

  mobileQuery: MediaQueryList;
  private readonly _mediaQueryListener: () => void;

  constructor(
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
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
    }
  }

  ngOnInit(): void {
  }

  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition = window.pageYOffset;
    const windowHeight = window.innerHeight;

    if (this.mobileQuery.matches && this.indexerText && this.indexerText.nativeElement.offsetTop <= scrollPosition + windowHeight) {
      console.log('indexer');
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
}
