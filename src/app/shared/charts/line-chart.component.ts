import { Component, Input, OnChanges } from '@angular/core';
import * as moment from 'moment';

const DAY = 86400000;
const LABEL_GAP = 7;

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    host: { class: 'block' },
})
export class LineChartComponent implements OnChanges {
    @Input() results: any[] = [];
    @Input() color: (name: string) => string = () => '#2A78D6';
    @Input() label = '';
    @Input() zero = false;
    @Input() area = false;
    @Input() peak = false;
    @Input() hourly = false;
    @Input() ends = 'name';
    @Input() plot = 'h-60';
    @Input() width: (name: string) => number = () => 2;

    lines: any[] = [];
    yTicks: any[] = [];
    xTicks: any[] = [];
    endLabels: any[] = [];
    hover: any = null;
    peakPoint: any = null;

    private series: any[] = [];
    private xMin = 0;
    private xMax = 0;
    private yMin = 0;
    private yMax = 0;

    ngOnChanges(): void {
        this.hover = null;
        this.series = (this.results || [])
            .filter((item) => item && item.series && item.series.length > 0)
            .map((item) => ({
                name: item.name,
                color: this.color(item.name),
                points: item.series
                    .map((point) => ({ time: new Date(point.name).getTime(), value: point.value }))
                    .filter((point) => !isNaN(point.time) && point.value !== null && point.value !== undefined)
                    .sort((a, b) => a.time - b.time),
            }))
            .filter((item) => item.points.length > 0);

        if (this.series.length === 0) {
            this.lines = [];
            this.yTicks = [];
            this.xTicks = [];
            this.endLabels = [];
            this.peakPoint = null;
            return;
        }

        const times = [].concat(...this.series.map((item) => item.points.map((point) => point.time)));
        const values = [].concat(...this.series.map((item) => item.points.map((point) => point.value)));
        this.xMin = Math.min(...times);
        this.xMax = Math.max(...times);

        let min = Math.min(...values);
        let max = Math.max(...values);
        if (this.zero) {
            min = Math.min(0, min);
        }
        if (min === max) {
            min -= 1;
            max += 1;
        }
        const step = this.niceStep((max - min) / 5);
        this.yMin = Math.floor(min / step) * step;
        this.yMax = Math.ceil(max / step) * step;
        this.yTicks = [];
        for (let i = 0; this.yMin + i * step <= this.yMax; i++) {
            const value = this.yMin + i * step;
            this.yTicks.push({ value: value, y: this.y(value) });
        }

        this.lines = this.series.map((item) => {
            const first = item.points[0];
            const last = item.points[item.points.length - 1];
            const path = 'M' + item.points.map((point) => this.x(point.time).toFixed(2) + ',' + this.y(point.value).toFixed(2)).join('L');
            return {
                name: item.name,
                color: item.color,
                width: this.width(item.name),
                path: path,
                fill: path + 'L' + this.x(last.time).toFixed(2) + ',100L' + this.x(first.time).toFixed(2) + ',100Z',
                x: this.x(last.time),
                y: this.y(last.value),
                value: last.value,
            };
        });

        this.peakPoint = null;
        if (this.peak) {
            this.series.forEach((item) =>
                item.points.forEach((point) => {
                    if (this.peakPoint === null || point.value > this.peakPoint.value) {
                        this.peakPoint = { value: point.value, color: item.color, x: this.x(point.time), y: this.y(point.value), date: moment(point.time).format('D MMM') };
                    }
                })
            );
        }

        this.endLabels = this.lines
            .map((line) => ({ name: line.name, color: line.color, value: line.value, y: line.y }))
            .sort((a, b) => a.y - b.y);
        for (let i = 1; i < this.endLabels.length; i++) {
            this.endLabels[i].y = Math.max(this.endLabels[i].y, this.endLabels[i - 1].y + LABEL_GAP);
        }
        const overflow = this.endLabels[this.endLabels.length - 1].y - 100;
        if (overflow > 0) {
            this.endLabels.forEach((item) => (item.y -= overflow));
        }

        this.xTicks = this.dateTicks();
    }

    move(event: PointerEvent): void {
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        if (this.series.length === 0 || rect.width === 0) {
            return;
        }
        const fraction = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
        const time = this.xMin + fraction * (this.xMax - this.xMin);
        let nearest = null;
        this.series.forEach((item) =>
            item.points.forEach((point) => {
                if (nearest === null || Math.abs(point.time - time) < Math.abs(nearest - time)) {
                    nearest = point.time;
                }
            })
        );
        if (this.hover && this.hover.time === nearest) {
            return;
        }
        const rows = [];
        this.series.forEach((item) => {
            const point = item.points.find((candidate) => candidate.time === nearest);
            if (point) {
                rows.push({ name: item.name, color: item.color, value: point.value, x: this.x(point.time), y: this.y(point.value) });
            }
        });
        this.hover = {
            time: nearest,
            x: this.x(nearest),
            date: moment(nearest).format(this.hourly ? 'D MMM HH:mm' : 'D MMM YYYY'),
            rows: rows.sort((a, b) => b.value - a.value),
        };
    }

    private x(time: number): number {
        return this.xMax === this.xMin ? 50 : ((time - this.xMin) / (this.xMax - this.xMin)) * 100;
    }

    private y(value: number): number {
        return 100 - ((value - this.yMin) / (this.yMax - this.yMin)) * 100;
    }

    private niceStep(raw: number): number {
        const power = Math.pow(10, Math.floor(Math.log10(raw)));
        const fraction = raw / power;
        const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
        return Math.max(1, nice * power);
    }

    private dateTicks(): any[] {
        const span = (this.xMax - this.xMin) / DAY;
        const ticks = [];
        const add = (date: moment.Moment, format: string) => {
            const time = date.valueOf();
            if (time >= this.xMin && time <= this.xMax) {
                ticks.push({ label: date.format(format), x: this.x(time) });
            }
        };
        if (span <= 12) {
            const every = Math.max(1, Math.ceil(span / 6));
            for (const date = moment(this.xMin).startOf('day'); date.valueOf() <= this.xMax; date.add(every, 'days')) {
                add(date, 'D MMM');
            }
        } else if (span <= 75) {
            for (const date = moment(this.xMin).startOf('month'); date.valueOf() <= this.xMax; date.add(1, 'month')) {
                add(date.clone(), 'D MMM');
                add(date.clone().date(15), 'D MMM');
            }
        } else {
            const every = span <= 200 ? 1 : span <= 400 ? 2 : span <= 1100 ? 3 : 6;
            const format = span <= 200 ? 'D MMM' : 'MMM YYYY';
            for (const date = moment(this.xMin).startOf('month'); date.valueOf() <= this.xMax; date.add(1, 'month')) {
                if (date.month() % every === 0) {
                    add(date.clone(), format);
                }
            }
        }
        return ticks;
    }
}
