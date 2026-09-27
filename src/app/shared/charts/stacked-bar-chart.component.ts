import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
    selector: 'app-stacked-bar-chart',
    templateUrl: './stacked-bar-chart.component.html',
    host: { class: 'block' },
})
export class StackedBarChartComponent implements OnChanges {
    @Input() results: any[] = [];
    @Input() colors: string[] = [];
    @Input() seriesLabels: string[] = [];
    @Input() clickable = false;
    @Input() label = '';
    @Output() barSelect = new EventEmitter<string>();

    bars: any[] = [];
    yTicks: any[] = [];
    peak = -1;

    ngOnChanges(): void {
        const groups = (this.results || []).filter((group) => group && group.series);
        const totals = groups.map((group) => group.series.reduce((sum, item) => sum + (+item.value || 0), 0));
        const max = Math.max(0, ...totals);
        const step = this.niceStep(max / 3);
        const top = Math.max(step, Math.ceil(max / step) * step);

        this.yTicks = [];
        for (let value = 0; value <= top; value += step) {
            this.yTicks.push({ value: value, y: 100 - (value / top) * 100 });
        }
        this.peak = max > 0 ? totals.indexOf(max) : -1;
        this.bars = groups.map((group, index) => ({
            name: group.name,
            label: String(group.name).substr(0, 2),
            total: totals[index],
            height: (totals[index] / top) * 100,
            segments: group.series.map((item, position) => ({
                name: this.seriesLabels[position] || item.name,
                value: +item.value || 0,
                color: this.colors[position] || '#94A3B8',
                share: totals[index] > 0 ? ((+item.value || 0) / totals[index]) * 100 : 0,
            })),
        }));
    }

    private niceStep(raw: number): number {
        if (!(raw > 0)) {
            return 1;
        }
        const power = Math.pow(10, Math.floor(Math.log10(raw)));
        const fraction = raw / power;
        const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
        return Math.max(1, nice * power);
    }
}
