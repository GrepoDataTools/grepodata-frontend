import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderModule } from './shared/components/header/header.module';
import { SearchModule } from './shared/components/search/search.module';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptor } from './shared/interceptors/loader.interceptor';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Globals} from './globals';
import { PlayerOverviewDialogComponent } from './shared/dialogs/player-overview-dialog/player-overview-dialog.component';
import { AllianceOverviewDialogComponent } from './shared/dialogs/alliance-overview-dialog/alliance-overview-dialog.component';
import { OverviewDialogComponent } from './shared/dialogs/overview-dialog/overview-dialog.component';
import { BbScoreboardDialogComponent } from './shared/dialogs/bb-scoreboard-dialog/bb-scoreboard-dialog.component';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import {RouterModule} from '@angular/router';
import {NgcCookieConsentConfig, NgcCookieConsentModule} from 'ngx-cookieconsent';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

const cookieConfig:NgcCookieConsentConfig = {
  cookie: {
    domain: 'grepodata.com'
  },
  content: {
    dismiss: 'Accept cookies'
  },
  palette: {
    popup: {
      background: '#2e3c4b',
      text: '#d6d6d6'
    },
    button: {
      background: '#18BC9C',
      text: '#2e3c4b'
    }
  },
  position: 'bottom-right',
  theme: 'block',
  // type: 'opt-out' // TODO: Allow users to opt-out of cookies, can handle opOut like this: https://tinesoft.github.io/ngx-cookieconsent/doc/index.html
};

@NgModule({
  declarations: [
    AppComponent,
    PlayerOverviewDialogComponent,
    AllianceOverviewDialogComponent,
    OverviewDialogComponent,
    BbScoreboardDialogComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    SlimLoadingBarModule.forRoot(),
    HeaderModule,
    SearchModule,
    FontAwesomeModule,
    MatIconModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    NgxChartsModule,
    MatProgressBarModule,
    MatTabsModule,
    NgcCookieConsentModule.forRoot(cookieConfig)
  ],
  exports: [
    TranslateModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    },
    Globals
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
