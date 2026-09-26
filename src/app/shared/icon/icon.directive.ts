import { Directive, ElementRef, Input, OnChanges, OnDestroy, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

export type IconVariant = 'outline' | 'solid' | 'mini' | 'micro' | 'game';

const VARIANTS: { [variant in IconVariant]: { path: string; size: number } } = {
    outline: { path: 'assets/heroicons/24/outline', size: 24 },
    solid: { path: 'assets/heroicons/24/solid', size: 24 },
    mini: { path: 'assets/heroicons/20/solid', size: 20 },
    micro: { path: 'assets/heroicons/16/solid', size: 16 },
    game: { path: 'assets/images', size: 16 },
};

const COPIED_ATTRIBUTES = ['viewBox', 'fill', 'stroke', 'stroke-width'];

const cache = new Map<string, Observable<SVGElement>>();

@Directive({
    selector: 'svg[appIcon]',
})
export class IconDirective implements OnChanges, OnDestroy {
    @Input() appIcon: string;
    @Input() variant: IconVariant = 'outline';

    private subscription: Subscription;

    constructor(private http: HttpClient, private host: ElementRef<SVGElement>, private renderer: Renderer2) {}

    ngOnChanges(): void {
        const variant = VARIANTS[this.variant] || VARIANTS.outline;
        const svg = this.host.nativeElement;
        const url = `${variant.path}/${this.appIcon}.svg`;

        this.renderer.setAttribute(svg, 'width', String(variant.size));
        this.renderer.setAttribute(svg, 'height', String(variant.size));
        if (svg.hasAttribute('aria-label')) {
            this.renderer.setAttribute(svg, 'role', 'img');
        } else {
            this.renderer.setAttribute(svg, 'aria-hidden', 'true');
        }

        this.unsubscribe();
        this.subscription = this.load(url).subscribe({
            next: (source) => this.render(source),
            error: () => cache.delete(url),
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe();
    }

    private load(url: string): Observable<SVGElement> {
        if (!cache.has(url)) {
            cache.set(
                url,
                this.http.get(url, { responseType: 'text' }).pipe(
                    map((text) => new DOMParser().parseFromString(text, 'image/svg+xml').documentElement as Element as SVGElement),
                    shareReplay(1)
                )
            );
        }
        return cache.get(url);
    }

    private render(source: SVGElement): void {
        const svg = this.host.nativeElement;

        COPIED_ATTRIBUTES.forEach((name) => {
            const value = source.getAttribute(name);
            if (value === null) {
                this.renderer.removeAttribute(svg, name);
            } else {
                this.renderer.setAttribute(svg, name, value);
            }
        });

        while (svg.firstChild) {
            this.renderer.removeChild(svg, svg.firstChild);
        }
        Array.from(source.childNodes).forEach((node) => {
            this.renderer.appendChild(svg, svg.ownerDocument.importNode(node, true));
        });
    }

    private unsubscribe(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
