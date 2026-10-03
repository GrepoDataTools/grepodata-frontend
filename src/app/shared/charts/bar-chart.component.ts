import { Component, Input, OnChanges } from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.component.html',
    host: { class: 'block' },
})
export class BarChartComponent implements OnChanges {
    @Input() results: any[] = [];
    @Input() color = '#2A78D6';
    @Input() label = '';
    @Input() axisLabel = '';
    @Input() unit = '';
    @Input() suffix = '';
    @Input() titleSuffix = '';
    @Input() min = 0;
    @Input() peak = false;
    @Input() dates = false;
    @Input() caps = false;

    bars: any[] = [];
    yTicks: any[] = [];
    peakIndex = -1;

    ngOnChanges(): void {
        const items = (this.results || []).filter((item) => item && item.value !== null && item.value !== undefined);
        const values = items.map((item) => +item.value || 0);
        const max = Math.max(0, this.min, ...values);
        const step = this.niceStep(max / 5);
        const top = Math.max(step, Math.ceil(max / step) * step);

        this.yTicks = [];
        for (let i = 0; i * step <= top; i++) {
            this.yTicks.push({ value: i * step, y: 100 - ((i * step) / top) * 100 });
        }
        this.peakIndex = this.peak && values.length > 0 ? values.indexOf(Math.max(...values)) : -1;
        this.bars = items.map((item, index) => {
            const name = this.caps ? String(item.name).toUpperCase() : String(item.name);
            return {
                title: this.dates ? moment(item.name).format('D MMM YYYY') : name + this.titleSuffix,
                label: this.dates ? (index % 7 === 0 ? moment(item.name).format('D MMM') : '') : name,
                value: values[index],
                height: (values[index] / top) * 100,
            };
        });
    }

    private niceStep(raw: number): number {
        if (!(raw > 0)) {
            return 1;
        }
        const power = Math.pow(10, Math.floor(Math.log10(raw)));
        const fraction = raw / power;
        const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
        return nice * power;
    }
}
