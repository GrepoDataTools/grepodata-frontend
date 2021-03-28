import {Component, Injectable, Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';
import {NavigationEnd, Router} from "@angular/router";
import {isUndefined} from "util";
import {LocalCacheService} from "./services/local-cache.service";
import {CompareService} from "./compare/compare.service";
import { addBackToTop } from 'vanilla-back-to-top'
import { MatDialog } from "@angular/material/dialog";
import {WorldService} from './services/world.service';
import {SidenavService} from './layout/sidebar/sidenav-service';

declare let ga: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [LocalCacheService, CompareService]
})
export class AppComponent {
  title = 'app';

  public greenType = false;
  public whiteType = false;

  constructor(
    private router: Router,
    private dialogRef: MatDialog,
    private sidenavService: SidenavService
  ) {

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }

      // Check ad type based on route
      if (evt.url.includes('/compare')) {
        this.whiteType = false;
        this.greenType = false;
      } else if (evt.url.includes('/points')  ||
          evt.url.includes('/ranking')) {
        this.greenType = false;
        this.whiteType = true;
      } else if ( evt.url.includes('/player')   ||
                  evt.url.includes('/alliance') ||
                  evt.url.includes('/conquest')) {
        this.whiteType = false;
        this.greenType = false;
        // this.greenType = true;
      } else {
        this.whiteType = false;
        this.greenType = false;
      }

      // Analytics
      try {
        console.log("pageview: ", evt.urlAfterRedirects);
        ga('set', 'page', evt.urlAfterRedirects);
        ga('send', 'pageview');
      } catch (e) {}

      // Scrolltop
      // try {
      //   document.querySelector('.Site').scrollTo(0, 0);
      // } catch (e) {}
      window.scrollTo(0, 0);

      // Close dialogs
			this.dialogRef.closeAll()

      // Close profile sidenav on navigate
      if (evt.url.includes('/profile') || evt.url.includes('/indexer')) {
        this.sidenavService.close();
      }
    });
  }

  scrollContent(event) {
    console.log(event);
  }

  cookieConsent() {
    _window().cookieconsent.initialise({
      'palette': {
        'popup': {
          'background': '#2e3c4b',
          'text': '#d6d6d6'
        },
        'button': {
          'background': '#18BC9C',
          'text': '#2e3c4b'
        }
      },
      'position': 'bottom-right'
    });
  }

  ngOnInit() {
    this.cookieConsent();

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

function _window(): any {
  // return the global native browser window object
  return window;
}

@Injectable()
export class WindowRef {
  get nativeWindow(): any {
    return _window();
  }
}

@Pipe({
  name: 'WorldNamePipe'
})
export class WorldNamePipe implements PipeTransform {
  constructor(private worldService: WorldService) {}
  transform(world: string): any {
    if (!world) return world;
    let server = world.substring(0, 2);
    let worldname = null;
    let worldinfo = this.worldService.getLocalWorldInfo(world);
    if (worldinfo && 'name' in worldinfo) {
      worldname = worldinfo.name
    }
    let html = '<div class="bg-flag flag-inline-middle flag-'+server+'"></div>&nbsp;';
    if (worldname) {
      html += worldname + ' (' + world + ')';
    } else {
      html += world;
    }
    return html;
  }
}

@Pipe({
  name: 'DiffFilterNonZero'
})
export class DiffFilterNonZero implements PipeTransform {
  transform(term: number): any {
    if (isUndefined(term) || term==null) return term;
    if (term == 0) return '';
    if (term > 0) return '<span class="diff-pos">+'+term.toLocaleString()+'</span>';
    if (term < 0) return '<span class="diff-neg">'+term.toLocaleString()+'</span>';
  }
}

@Pipe({
  name: 'DiffFilter'
})
export class DiffFilter implements PipeTransform {
  transform(term: number): any {
    if (isUndefined(term) || term==null) return term;
    if (term == 0) return '<span class="diff-null">'+term+'</span>';
    if (term > 0) return '<span class="diff-pos">+'+term.toLocaleString()+'</span>';
    if (term < 0) return '<span class="diff-neg">'+term.toLocaleString()+'</span>';
    return term;
  }
}

@Pipe({
  name: 'NumberFilter'
})
export class NumberFilter implements PipeTransform {
  transform(term: number): any {
    if (isUndefined(term) || term==null) return term;
    return term.toLocaleString();
  }
}

@Pipe({
  name: 'Datex'
})
export class Datex implements PipeTransform {
  transform(value: string, format: string = ""): string {
    if (!value || value==="") return "";
    return moment(value).format(format);
  }
}

@Pipe({ name: 'ValuesPipe',  pure: false })
export class ValuesPipe implements PipeTransform {
  transform(value: any, args: any[] = null): any {
    let array = Object.keys(value).map(key => value[key]);
    return array;
  }
}

@Pipe({ name: 'IndexDate',  pure: false })
export class IndexDate implements PipeTransform {
  transform(value: string, as_html: any = null): string {
    if (!value || value==="") return "";
    if (as_html == null) {
    	return moment(value, "DD-MM-YY HH:mm:ss").format('D MMM YYYY HH:mm');
		} else {
			let date = moment(value, "DD-MM-YY HH:mm:ss").format('D MMM__ YYYY___ HH:mm');
			date = date.replace('___','</span>');
			date = date.replace('__','<span class="hidden-xs">');
			return date;
		}
  }
}
