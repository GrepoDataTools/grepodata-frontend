import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
    selector: 'app-grouped-hbar-chart',
    templateUrl: './grouped-hbar-chart.component.html',
    host: { class: 'block' },
})
export class GroupedHbarChartComponent implements OnChanges {
    @Input() results: any[] = [];
    @Input() keys: string[] = [];
    @Input() labels: string[] = [];
    @Input() colors: string[] = [];
    @Input() clickable = false;
    @Input() icon = '';
    @Input() label = '';
    @Output() rowSelect = new EventEmitter<string>();

    rows: any[] = [];
    xTicks: any[] = [];

    ngOnChanges(): void {
        const items = (this.results || []).filter((item) => item && item.series);
        const values = items.map((item) =>
            this.keys.map((key) => {
                const entry = item.series.find((candidate) => candidate.name === key);
                return entry ? +entry.value || 0 : 0;
            })
        );
        const max = Math.max(0, ...[].concat(...values));
        const step = this.niceStep(max / 5);
        const top = Math.max(step, Math.ceil(max / step) * step);

        this.xTicks = [];
        for (let value = 0; value <= top; value += step) {
            this.xTicks.push({ value: value, x: (value / top) * 100 });
        }
        this.rows = items.map((item, index) => ({
            name: item.name,
            bars: this.keys.map((key, position) => ({
                label: this.labels[position] || key,
                value: values[index][position],
                color: this.colors[position] || '#94A3B8',
                width: (values[index][position] / top) * 100,
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
