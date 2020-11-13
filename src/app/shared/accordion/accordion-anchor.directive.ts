import { Directive, Inject, HostListener } from '@angular/core';
import { AccordionLinkDirective } from './accordion-link.directive';

@Directive({
    selector: '[appAccordionAnchor]',
})
export class AccordionAnchorDirective {
    protected navlink: AccordionLinkDirective;

    constructor(@Inject(AccordionLinkDirective) navlink: AccordionLinkDirective) {
        this.navlink = navlink;
    }

    @HostListener('click', ['$event'])
    onClick(e: any) {
        this.navlink.toggle();
    }
}
