import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { detectAnyAdblocker } from 'just-detect-adblock';
import { environment } from '../../environments/environment';

@Injectable()
export class AdBlockService {

  // null = detection still in progress
  private state$ = new BehaviorSubject<boolean | null>(null);
  // intermediate signals combined (OR'd) into state$ once both have settled
  private networkBlocked$ = new BehaviorSubject<boolean | null>(null);
  private libraryBlocked$ = new BehaviorSubject<boolean | null>(null);

  constructor() {
    this.detect();
  }

  /** Emits once, with true/false, after ad-block detection has settled. */
  isBlocking(): Observable<boolean> {
    return this.state$.pipe(filter((v): v is boolean => v !== null), take(1));
  }

  private scriptLoadPromise: Promise<void> | null = null;

  /**
   * Loads the real adsbygoogle.js exactly once app-wide. Every ad component must use this
   * instead of injecting its own <script> tag: loading the real script more than once causes
   * it to re-run its init, which can reset `.loaded` and corrupt this service's detection.
   */
  ensureAdScriptLoaded(): Promise<void> {
    if (!this.scriptLoadPromise) {
      this.scriptLoadPromise = new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4919155139162702';
        script.async = true;
        script.onerror = () => resolve();
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    }
    return this.scriptLoadPromise;
  }

  private detect() {
    // localhost/acc are never an AdSense-approved domain, so the real script loads but
    // silently never sets `.loaded` there - that would always register as a false positive
    if (!environment.production) {
      this.state$.next(false);
      return;
    }

    // the real adsbygoogle.js sets this flag once it finishes initializing; note it REPLACES
    // window.adsbygoogle (a plain object, no longer the pre-declared command-queue array) at
    // that point, so this must NOT require it to still be an array
    const isLoaded = () => {
      const ads = (window as any).adsbygoogle;
      return !!ads && (ads as any).loaded === true;
    };

    let settled = false;
    const finish = (blocked: boolean) => {
      if (settled) { return; }
      settled = true;
      if (blocked) {
        this.networkBlocked$.next(true);
        return;
      }
      const bait = document.getElementById('adBait');
      const baitHidden = !bait || bait.offsetParent === null || bait.offsetHeight === 0 || window.getComputedStyle(bait).display === 'none';
      this.networkBlocked$.next(baitHidden);
    };

    // load the real ad-vendor script: this is the request actual ad blockers target by domain
    this.ensureAdScriptLoaded().then(() => finish(!isLoaded()));

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

    // independent signal that also catches browser-native blockers (Brave Shields, Opera)
    // which don't block the network request our bait/script check above relies on
    detectAnyAdblocker()
      .then((detected) => this.libraryBlocked$.next(detected))
      .catch(() => this.libraryBlocked$.next(false));

    // blocked if either signal says so; both must have reported before emitting
    Promise.all([
      this.networkBlocked$.pipe(filter((v): v is boolean => v !== null), take(1)).toPromise(),
      this.libraryBlocked$.pipe(filter((v): v is boolean => v !== null), take(1)).toPromise(),
    ]).then(([networkBlocked, libraryBlocked]) => {
      this.state$.next(networkBlocked || libraryBlocked);
    });
  }
}
