import { Injectable } from '@angular/core';

const STORAGE_KEY = 'dark_mode';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {

  private enabled = false;

  constructor() {}

  /**
   * Reads the persisted preference (falling back to OS preference) and applies it to the document.
   */
  init() {
    let stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}

    if (stored === 'true' || stored === 'false') {
      this.enabled = stored === 'true';
    } else {
      this.enabled = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.apply();
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  toggle() {
    this.set(!this.enabled);
  }

  set(enabled: boolean) {
    this.enabled = enabled;
    try {
      localStorage.setItem(STORAGE_KEY, String(enabled));
    } catch (e) {}
    this.apply();
  }

  private apply() {
    document.documentElement.classList.toggle('dark-mode', this.enabled);
  }
}
