import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class AdBlockService {

  // null = detection still in progress
  private state$ = new BehaviorSubject<boolean | null>(null);

  constructor() {
    this.detect();
  }

  /** Emits once, with true/false, after ad-block detection has settled. */
  isBlocking(): Observable<boolean> {
    return this.state$.pipe(filter((v): v is boolean => v !== null), take(1));
  }

  private detect() {
    // localhost/acc are never an AdSense-approved domain, so the real script loads but
    // silently never sets `.loaded` there - that would always register as a false positive
    if (!environment.production) {
      this.state$.next(false);
      return;
    }

    // the real adsbygoogle.js sets this flag; `adsbygoogle` itself may already exist as a
    // pre-declared command queue from other ad components even when the script is blocked
    const isLoaded = () => {
      const ads = (window as any).adsbygoogle;
      return Array.isArray(ads) && (ads as any).loaded === true;
    };

    let settled = false;
    const finish = (blocked: boolean) => {
      if (settled) { return; }
      settled = true;
      if (blocked) {
        this.state$.next(true);
        return;
      }
      const bait = document.getElementById('adBait');
      const baitHidden = !bait || bait.offsetParent === null || bait.offsetHeight === 0 || window.getComputedStyle(bait).display === 'none';
      this.state$.next(baitHidden);
    };

    // load the real ad-vendor script: this is the request actual ad blockers target by domain
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4919155139162702';
    script.async = true;
    script.onerror = () => finish(true);
    script.onload = () => finish(!isLoaded());
    document.body.appendChild(script);

    // poll instead of a single fixed timeout: on a cold cache/slow network the script can
    // legitimately take a while to load, so keep checking before concluding it's blocked
    const maxWaitMs = 6000;
    const pollIntervalMs = 200;
    let waited = 0;
    const poll = setInterval(() => {
      if (isLoaded()) {
        clearInterval(poll);
        finish(false);
        return;
      }
      waited += pollIntervalMs;
      if (waited >= maxWaitMs) {
        clearInterval(poll);
        finish(true);
      }
    }, pollIntervalMs);
  }
}
