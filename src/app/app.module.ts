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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NumberFilterPipe } from './shared/pipes/number-filter.pipe';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SlimLoadingBarModule.forRoot(),
    HeaderModule,
    SearchModule,
    FontAwesomeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NoopAnimationsModule,
  ],
  exports: [
    TranslateModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
