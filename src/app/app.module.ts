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
import { HomeModule } from './home/home.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Globals} from './globals';
import { PlayerOverviewDialogComponent } from './shared/components/dialogs/player-overview-dialog/player-overview-dialog.component';
import { AllianceOverviewDialogComponent } from './shared/components/dialogs/alliance-overview-dialog/alliance-overview-dialog.component';
import { OverviewDialogComponent } from './shared/components/dialogs/overview-dialog/overview-dialog.component';
import { BbScoreboardDialogComponent } from './shared/components/dialogs/bb-scoreboard-dialog/bb-scoreboard-dialog.component';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { MatProgressBarModule } from "@angular/material/progress-bar";

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

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
    AppRoutingModule,
    HttpClientModule,
    SlimLoadingBarModule.forRoot(),
    HeaderModule,
    SearchModule,
    HomeModule,
    FontAwesomeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    NgxChartsModule,
    MatProgressBarModule
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
