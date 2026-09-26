import { NgModule } from '@angular/core';
import { AccordionAnchorDirective } from './accordion/accordion-anchor.directive';
import { AccordionLinkDirective } from './accordion/accordion-link.directive';
import { AccordionDirective } from './accordion/accordion.directive';
import { IconDirective } from './icon/icon.directive';
import { MenuItems } from './menu-items/menu-items';

@NgModule({
    declarations: [AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective, IconDirective],
    exports: [AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective, IconDirective],
    providers: [MenuItems],
})
export class SharedModule {}
