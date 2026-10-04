import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AdBlockService } from '../../services/ad-block.service';

@Component({
    selector: 'app-infeed-ad',
    templateUrl: './infeed-ad.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfeedAdComponent implements OnInit, AfterViewInit {
    @ViewChild('ins', { read: ElementRef, static: false }) ins: any;

    environment = environment;
    adId = 'infeed-ad-' + Math.floor(Math.random() * 10000) + 1;
    mobile = true;
    blocking = false;

    constructor(private cdr: ChangeDetectorRef, private adBlockService: AdBlockService) {}

    ngOnInit() {
        if (window.screen.width > 1200) { // 768px portrait
            this.mobile = false;
        }

        this.adBlockService.isBlocking().subscribe((blocking) => {
            this.blocking = blocking;
            // markForCheck() alone depends on a later CD pass reaching this OnPush view;
            // detectChanges() updates this view immediately regardless of ancestor state
            try {
                this.cdr.detectChanges();
            } catch (e) {
                // view may already be destroyed (e.g. row removed by a data refresh)
            }
        });
    }

    ngAfterViewInit() {
        if (!environment.production) {
            return;
        }

        this.adBlockService.ensureAdScriptLoaded().then(() => this.push());
    }

    push() {
        try {
            if ('adsbygoogle' in window) {
                ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
            }
        } catch (e) {
            console.log(e);
        }
    }
}
