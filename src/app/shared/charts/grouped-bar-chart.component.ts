import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
    selector: 'app-grouped-bar-chart',
    templateUrl: './grouped-bar-chart.component.html',
    host: { class: 'block' },
})
export class GroupedBarChartComponent implements OnChanges {
    @Input() results: any[] = [];
    @Input() keys: string[] = [];
    @Input() labels: string[] = [];
    @Input() colors: string[] = [];
    @Input() clickable = false;
    @Input() label = '';
    @Input() axisLabel = '';
    @Input() hint = '';
    @Output() barSelect = new EventEmitter<string>();

    groups: any[] = [];
    yTicks: any[] = [];

    ngOnChanges(): void {
        const groups = (this.results || []).filter((group) => group && group.series);
        const values = groups.map((group) =>
            this.keys.map((key) => {
                const item = group.series.find((entry) => entry.name === key);
                return item ? +item.value || 0 : 0;
            })
        );
        const max = Math.max(0, ...[].concat(...values));
        const step = this.niceStep(max / 4);
        const top = Math.max(step, Math.ceil(max / step) * step);

        this.yTicks = [];
        for (let value = 0; value <= top; value += step) {
            this.yTicks.push({ value: value, y: 100 - (value / top) * 100 });
        }
        this.groups = groups.map((group, index) => ({
            name: group.name,
            label: String(group.name).substr(0, 2),
            bars: this.keys.map((key, position) => ({
                label: this.labels[position] || key,
                value: values[index][position],
                color: this.colors[position] || '#94A3B8',
                height: (values[index][position] / top) * 100,
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
