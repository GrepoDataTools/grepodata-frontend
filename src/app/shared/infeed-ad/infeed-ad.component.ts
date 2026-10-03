import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-infeed-ad',
    templateUrl: './infeed-ad.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfeedAdComponent implements AfterViewInit {
    @ViewChild('ins', { read: ElementRef, static: false }) ins: any;

    environment = environment;
    adId = 'infeed-ad-' + Math.floor(Math.random() * 10000) + 1;

    ngAfterViewInit() {
        if (!environment.production) {
            return;
        }

        const node = document.createElement('script');
        node.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4919155139162702';
        node.async = true;
        node.crossOrigin = 'anonymous';
        node.onload = () => this.push();
        document.getElementById('script-' + this.adId)?.appendChild(node);
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
