import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {NavigationEnd, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

declare let ga: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'GrepodataFrontend';

  constructor(
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
}
