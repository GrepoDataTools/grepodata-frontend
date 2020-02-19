import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'GrepodataFrontend';

  constructor(public translate: TranslateService) {
    translate.addLangs(['en', 'cs', 'nl', 'pt']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|cs|nl/) ? browserLang : 'en');
  }
}
