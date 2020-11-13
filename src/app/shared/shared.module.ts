import { NgModule } from '@angular/core';
import { AccordionAnchorDirective } from './accordion/accordion-anchor.directive';
import { AccordionLinkDirective } from './accordion/accordion-link.directive';
import { AccordionDirective } from './accordion/accordion.directive';
import { MenuItems } from './menu-items/menu-items';

@NgModule({
    declarations: [AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective],
    exports: [AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective],
    providers: [MenuItems],
})
export class SharedModule {}
