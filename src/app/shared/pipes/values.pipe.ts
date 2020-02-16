import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ValuesPipe'
})
export class ValuesPipe implements PipeTransform {
  transform(value: any, args: any[] = null): any {
    return Object.keys(value).map(key => value[key]);
  }
}
