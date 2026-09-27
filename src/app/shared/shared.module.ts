import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionAnchorDirective } from './accordion/accordion-anchor.directive';
import { AccordionLinkDirective } from './accordion/accordion-link.directive';
import { AccordionDirective } from './accordion/accordion.directive';
import { IconDirective } from './icon/icon.directive';
import { MenuItems } from './menu-items/menu-items';
import { CompactNumberPipe } from './charts/compact-number.pipe';
import { LineChartComponent } from './charts/line-chart.component';

@NgModule({
    imports: [CommonModule],
    declarations: [AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective, IconDirective, CompactNumberPipe, LineChartComponent],
    exports: [AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective, IconDirective, CompactNumberPipe, LineChartComponent],
    providers: [MenuItems],
})
export class SharedModule {}
