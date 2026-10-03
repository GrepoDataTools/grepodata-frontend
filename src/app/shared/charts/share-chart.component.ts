import { Component, Input, OnChanges } from '@angular/core';
import * as moment from 'moment';

const DAY = 86400000;

@Component({
    selector: 'app-share-chart',
    templateUrl: './share-chart.component.html',
    host: { class: 'block' },
})
export class ShareChartComponent implements OnChanges {
    @Input() results: any[] = [];
    @Input() color: (name: string) => string = () => '#2A78D6';
    @Input() label = '';

    bands: any[] = [];
    edges: any[] = [];
    xTicks: any[] = [];
    yTicks = [0, 25, 50, 75, 100].map((value) => ({ value: value, y: 100 - value }));
    hover: any = null;

    private series: any[] = [];
    private times: number[] = [];
    private xMin = 0;
    private xMax = 0;

    ngOnChanges(): void {
        this.hover = null;
        this.series = (this.results || [])
            .filter((item) => item && item.series && item.series.length > 0)
            .map((item) => {
                const values = new Map<number, number>();
                item.series.forEach((point) => {
                    const time = new Date(point.name).getTime();
                    if (!isNaN(time)) {
                        values.set(time, +point.value || 0);
                    }
                });
                return { name: item.name, color: this.color(item.name), values: values };
            });

        const all = new Set<number>();
        this.series.forEach((item) => item.values.forEach((value, time) => all.add(time)));
        this.times = Array.from(all)
            .filter((time) => this.total(time) > 0)
            .sort((a, b) => a - b);

        if (this.series.length === 0 || this.times.length === 0) {
            this.bands = [];
            this.edges = [];
            this.xTicks = [];
            return;
        }
        this.xMin = this.times[0];
        this.xMax = this.times[this.times.length - 1];

        const tops = this.series.map(() => []);
        this.times.forEach((time) => {
            const total = this.total(time);
            let sum = 0;
            this.series.forEach((item, index) => {
                sum += item.values.get(time) || 0;
                tops[index].push({ x: this.x(time), y: 100 - (sum / total) * 100 });
            });
        });

        const last = this.times[this.times.length - 1];
        const lastTotal = this.total(last);
        this.bands = this.series.map((item, index) => {
            const top = tops[index];
            const bottom = index === 0 ? top.map((point) => ({ x: point.x, y: 100 })) : tops[index - 1];
            const outline = top.concat(bottom.slice().reverse());
            const upper = top[top.length - 1].y;
            const lower = bottom[bottom.length - 1].y;
            return {
                name: item.name,
                short: String(item.name).split(' ')[0],
                color: item.color,
                path: 'M' + outline.map((point) => point.x.toFixed(2) + ',' + point.y.toFixed(2)).join('L') + 'Z',
                share: ((item.values.get(last) || 0) / lastTotal) * 100,
                y: (upper + lower) / 2,
            };
        });
        this.edges = this.series.slice(0, -1).map((item, index) => ({
            color: item.color,
            path: 'M' + tops[index].map((point) => point.x.toFixed(2) + ',' + point.y.toFixed(2)).join('L'),
        }));
        this.xTicks = this.dateTicks();
    }

    move(event: PointerEvent): void {
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        if (this.times.length === 0 || rect.width === 0) {
            return;
        }
        const fraction = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
        const target = this.xMin + fraction * (this.xMax - this.xMin);
        const nearest = this.times.reduce((best, time) => (Math.abs(time - target) < Math.abs(best - target) ? time : best), this.times[0]);
        if (this.hover && this.hover.time === nearest) {
            return;
        }
        const total = this.total(nearest);
        this.hover = {
            time: nearest,
            x: this.x(nearest),
            date: moment(nearest).format('D MMM YYYY'),
            rows: this.series
                .map((item) => ({ name: item.name, color: item.color, value: item.values.get(nearest) || 0, share: ((item.values.get(nearest) || 0) / total) * 100 }))
                .reverse(),
        };
    }

    private total(time: number): number {
        return this.series.reduce((sum, item) => sum + (item.values.get(time) || 0), 0);
    }

    private x(time: number): number {
        return this.xMax === this.xMin ? 50 : ((time - this.xMin) / (this.xMax - this.xMin)) * 100;
    }

    private dateTicks(): any[] {
        const span = (this.xMax - this.xMin) / DAY;
        const every = span <= 200 ? 1 : span <= 400 ? 2 : span <= 1100 ? 3 : 6;
        const ticks = [];
        for (const date = moment(this.xMin).startOf('month'); date.valueOf() <= this.xMax; date.add(1, 'month')) {
            if (date.month() % every === 0 && date.valueOf() >= this.xMin) {
                const format = span <= 200 ? 'D MMM' : date.month() === 0 ? 'MMM YYYY' : 'MMM';
                ticks.push({ label: date.format(format), x: this.x(date.valueOf()) });
            }
        }
        return ticks;
    }
}
