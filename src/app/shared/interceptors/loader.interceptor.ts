import { Injectable, Injector } from "@angular/core";
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor
} from "@angular/common/http";
import { Observable } from "rxjs";
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { finalize, delay } from "rxjs/operators";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loadingBar: SlimLoadingBarService) {}
  
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    this.loadingBar.start();


    return next.handle(request).pipe(
      finalize(() => this.loadingBar.complete())
    )
  }
}
