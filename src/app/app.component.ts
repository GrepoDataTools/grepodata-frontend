import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {NavigationEnd, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { addBackToTop } from 'vanilla-back-to-top'
import {NgcCookieConsentService} from 'ngx-cookieconsent';

declare let ga: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [NgcCookieConsentService]
})
export class AppComponent {
  title = 'GrepodataFrontend';

  constructor(
    private ccService: NgcCookieConsentService,
    private router: Router,
    private dialogRef: MatDialog,
    public translate: TranslateService) {
    translate.addLangs(['en', 'cs', 'nl', 'pt']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|cs|nl/) ? browserLang : 'en');

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }

      // Analytics (pageview for current url)
      try {
        ga('set', 'page', evt.urlAfterRedirects);
        ga('send', 'pageview');
      } catch (e) {}

      // Scrolltop on navigate
      window.scrollTo(0, 0);

      // Close all open dialogs on navigate
      this.dialogRef.closeAll()
    });
  }

  ngOnInit() {
    addBackToTop({
      diameter: 56,
      backgroundColor: '#304356',
      textColor: '#18BC9C',
      // scrollContainer: document.getElementById('content'),
      // innerHTML: '<svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path></svg>',
      onClickScrollTo: 0, // px
      scrollDuration: 100, // ms
      showWhenScrollTopIs: 200, // px
      zIndex: 1
    });
  }
}
