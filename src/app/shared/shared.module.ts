import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionAnchorDirective } from './accordion/accordion-anchor.directive';
import { AccordionLinkDirective } from './accordion/accordion-link.directive';
import { AccordionDirective } from './accordion/accordion.directive';
import { IconDirective } from './icon/icon.directive';
import { MenuItems } from './menu-items/menu-items';
import { CompactNumberPipe } from './charts/compact-number.pipe';
import { LineChartComponent } from './charts/line-chart.component';
import { StackedBarChartComponent } from './charts/stacked-bar-chart.component';
import { GroupedBarChartComponent } from './charts/grouped-bar-chart.component';
import { GroupedHbarChartComponent } from './charts/grouped-hbar-chart.component';
import { BarChartComponent } from './charts/bar-chart.component';
import { ShareChartComponent } from './charts/share-chart.component';

@NgModule({
    imports: [CommonModule],
    declarations: [AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective, IconDirective, CompactNumberPipe, LineChartComponent, StackedBarChartComponent, GroupedBarChartComponent, GroupedHbarChartComponent, BarChartComponent, ShareChartComponent],
    exports: [AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective, IconDirective, CompactNumberPipe, LineChartComponent, StackedBarChartComponent, GroupedBarChartComponent, GroupedHbarChartComponent, BarChartComponent, ShareChartComponent],
    providers: [MenuItems],
})
export class SharedModule {}
