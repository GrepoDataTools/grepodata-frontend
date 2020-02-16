import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'NumberFilter'
})
export class NumberFilterPipe implements PipeTransform {
  transform(term: number): any {
    if (term==undefined || term==null) return term;
    return term.toLocaleString();
  }
}
