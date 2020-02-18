import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'DiffFilterNonZero'
})
export class DiffFilterNonZeroPipe implements PipeTransform {
  transform(term: number): any {
    if (term==undefined || term==null) return term;
    if (term == 0) return '';
    if (term > 0) return '<span class="diff-pos">+'+term.toLocaleString()+'</span>';
    if (term < 0) return '<span class="diff-neg">'+term.toLocaleString()+'</span>';
    return term;
  }
}