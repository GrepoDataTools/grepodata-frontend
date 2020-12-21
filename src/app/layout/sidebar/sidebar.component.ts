import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { MatExpansionPanel } from '@angular/material/expansion';
import {JwtService} from '../../auth/services/jwt.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  viewProviders: [MatExpansionPanel],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() username: string;

  private readonly _mediaQueryListener: () => void;

  mobileQuery: MediaQueryList;
  status = true;
  itemSelect: Array<number> = [];
  parentIndex = 0;
  childIndex = 0;

  constructor(
    private authService: JwtService,
    private router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mediaQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', () => this._mediaQueryListener());
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', () => this._mediaQueryListener());
  }

  setClickedRow(i: number, j: number) {
    this.parentIndex = i;
    this.childIndex = i;
  }

  subclickEvent() {
    this.status = true;
  }

  scrollToTop() {
    document.querySelector('.page_wrapper').scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  logout() {
    this.authService.logout();
  }

  handleMenuAction(action: string) {
    switch (action) {
      case 'logout':
        this.logout();
        break;
      default:
        console.log(action);
    }
  }
}
