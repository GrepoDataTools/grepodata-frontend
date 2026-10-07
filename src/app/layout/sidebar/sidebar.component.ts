import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { MatExpansionPanel } from '@angular/material/expansion';
import {JwtService} from '../../auth/services/jwt.service';
import {Router} from '@angular/router';
import {SidenavService} from './sidenav-service';
import {MatDialog} from '@angular/material/dialog';
import {DonateDialog} from '../../shared/dialogs/donate/donate.component';
import {DonationService} from '../../services/donation.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  viewProviders: [MatExpansionPanel],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() username: string;

  private readonly _mediaQueryListener: () => void;

  mobileQuery: MediaQueryList;
  status = true;
  new_updates = false;
  activePath: string;
  itemSelect: Array<number> = [];
  parentIndex = 0;
  childIndex = 0;
  donationPercent = 0;
  donationBadgeClasses = 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500';

  constructor(
    private sidenavService: SidenavService,
    private authService: JwtService,
    private router: Router,
    changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog,
    media: MediaMatcher,
    private donationService: DonationService,
    public menuItems: MenuItems) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mediaQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', () => this._mediaQueryListener());
    this.new_updates = new Date(2024, 0, 30).valueOf() > new Date().valueOf(); // Month is zero-indexed! e.g. month 3 = april

    router.events.subscribe((params) => {
      let val: any = params;
      if ('url' in val) {
        this.activePath = val.url;
      }
    });
  }

  ngOnInit() {
    this.donationService.getDonationKpi().subscribe((state) => {
      this.donationPercent = state.percent;
      const palette = {
        red: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/30',
        orange: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/30',
        green: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30',
      };
      this.donationBadgeClasses = palette[state.tier];
    });
  }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', () => this._mediaQueryListener());
  }

  setClickedRow(i: number, j: number) {
    this.parentIndex = i;
    this.childIndex = i;
  }

  loadMenuItems() {
    return this.menuItems.getMenuItem();
  }

  subclickEvent() {
    this.status = true;
  }

  scrollToTop() {
    document.querySelector('.page-wrapper').scrollIntoView();
  }

  logout() {
    console.log('logout');
    this.authService.logout();
  }

  handleMenuAction(action: string) {
    console.log('action: ',action);
    switch (action) {
      case 'logout':
        this.logout();
        break;
      case 'donate':
        this.donate();
        break;
      case 'discord':
        window.open('https://discord.gg/E95bhqR3Ns', "_blank");
        break;
      default:
        console.log(action);
    }
  }

  clickedLink() {
    if (!this.mobileQuery.matches) {
      this.sidenavService.close();
    }
    this.scrollToTop();
  }

  donate() {
    const dialogRef = this.dialog.open(DonateDialog, {
      autoFocus: false,
    });
  }
}
