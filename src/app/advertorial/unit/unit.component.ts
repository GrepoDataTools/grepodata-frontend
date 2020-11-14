import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    ElementRef,
    ChangeDetectorRef,
} from '@angular/core';

@Component({
    selector: 'ad-unit',
    template: `
        <div [id]="'script-' + adId"></div>
        <!--<ins #ins class="adsbygoogle" style="display:inline-block;width:1200px;height:120px"-->
        <!--[attr.data-ad-region]="adId"-->
        <!--data-ad-client="ca-pub-4919155139162702"-->
        <!--data-ad-slot="6507245945"></ins>-->
        <ins
            #ins
            class="adsbygoogle"
            style="display:block;"
            [attr.data-ad-region]="adId"
            data-ad-client="ca-pub-4919155139162702"
            data-ad-slot="9527243060"
            data-ad-format="auto"
            data-full-width-responsive="true"
        ></ins>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('ins', { read: ElementRef, static: false }) ins: any;
    @ViewChild('script', { read: ElementRef, static: false }) script: any;

    timeOutRetry: number = 200;
    adId = 'ad-' + Math.floor(Math.random() * 10000) + 1;

    // data-ad-slot="6507245945" // fixed banner
    // data-ad-slot="9527243060" // responsive-1

    constructor(private cdr: ChangeDetectorRef) {}

    ngOnInit() {}

    ngOnDestroy() {
        if (this.ins) {
            console.log('Destroying ad view');
            const iframe = this.ins.nativeElement.querySelector('iframe');
            if (iframe && iframe.contentWindow) {
                iframe.src = 'about:blank';
                iframe.remove();
            }
        } else {
            console.log('Unable to destroy ad view');
        }
    }

    /**
     * attempts to push the ad twice. Usually if one doesn't work the other
     * will depeding on if the browser has the adsense code cached and
     * if its the first page to be loaded
     */
    ngAfterViewInit() {
        // setTimeout(() => {
        // 	const res = this.push();
        // 	if (res instanceof TypeError) {
        // 		setTimeout(() => {
        // 			console.log("Retrying ad push");
        // 			this.push();
        // 		}, this.timeOutRetry);
        // 	}
        // }, this.timeOutRetry);

        let that = this;
        function pushing() {
            console.log('Pushing onload');
            const res = that.push();
            // if (res instanceof TypeError) {
            // 	setTimeout(() => {
            // 		console.log("Retrying ad push");
            // 		that.push()
            // 	}, that.timeOutRetry);
            // }
        }

        let node = document.createElement('script');
        node.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        node.type = 'text/javascript';
        node.async = false;
        node.onload = function () {
            pushing();
        };
        document.getElementById('script-' + this.adId).appendChild(node);
    }

    push() {
        const p: any = {};
        try {
            if ('adsbygoogle' in window) {
                const adsbygoogle = (window as any).adsbygoogle;
                console.log('Pushing');
                console.log(adsbygoogle);
                adsbygoogle.push(p);
                this.cdr.detectChanges();
            } else {
                console.log('adsbygoogle undefined');
            }
            return true;
        } catch (e) {
            console.log(e);
            // let isTagError = false;
            // if (e.name && e.name == 'TagError') {
            // 	// Probably no slot size available. hide wrapper
            // 	isTagError = true;
            // }
            // if ((isTagError == true || this.failed == true) && this.wrapper) {
            // 	// Hide wrapper and don't retry!
            // 	this.wrapper.nativeElement.style.display = 'none';
            // } else {
            // 	// First fail. wait for retry
            // 	this.failed = true;
            // }
            return e;
        }
    }
}
