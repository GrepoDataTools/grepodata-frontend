import { Directive, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
import { AccordionLinkDirective } from './accordion-link.directive';

@Directive({
    selector: '[appAccordion]',
})
export class AccordionDirective implements AfterContentChecked {
    protected navLinks: Array<AccordionLinkDirective> = [];

    closeOtherLinks(selectedLink: AccordionLinkDirective): void {
        this.navLinks.forEach((link: AccordionLinkDirective) => {
            if (link !== selectedLink) {
                link.selected = false;
            }
        });
    }

    addLink(link: AccordionLinkDirective): void {
        this.navLinks.push(link);
    }

    removeGroup(link: AccordionLinkDirective): void {
        const index = this.navLinks.indexOf(link);
        if (index !== -1) {
            this.navLinks.splice(index, 1);
        }
    }

    checkOpenLinks() {
        this.navLinks.forEach((link: AccordionLinkDirective) => {
            if (link.group) {
                const routeUrl = this.router.url;
                const currentUrl = routeUrl.split('/');
                if (currentUrl.indexOf(link.group) > 0) {
                    link.selected = true;
                    this.closeOtherLinks(link);
                }
            }
        });
    }

    ngAfterContentChecked(): void {}

    constructor(private router: Router) {
        setTimeout(() => this.checkOpenLinks());
    }
}
