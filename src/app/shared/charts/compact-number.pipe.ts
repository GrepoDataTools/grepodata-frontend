import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'compactNumber',
})
export class CompactNumberPipe implements PipeTransform {
    transform(value: number): string {
        if (value === null || value === undefined || !isFinite(value)) {
            return '';
        }
        const abs = Math.abs(value);
        if (abs >= 1000000) {
            return this.round(value / 1000000) + 'M';
        }
        if (abs >= 1000) {
            return this.round(value / 1000) + 'k';
        }
        return this.round(value);
    }

    private round(value: number): string {
        return value.toFixed(1).replace(/\.0$/, '');
    }
}
