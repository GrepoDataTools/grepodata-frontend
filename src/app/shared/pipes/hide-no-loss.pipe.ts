import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'HideNoLossPipe'
})
export class HideNoLossPipe implements PipeTransform {
  transform(value: any): any {
    if (typeof value == 'string') {
      let str = value.replace('(-0)', '');
      if (str.includes('(')) {
        let index = value.indexOf('(');
        let first = value.substr(0, index);
        let index2 = value.indexOf(')')+1;
        let second = value.substr(index, index2 - index);
        let third = value.substr(index2);
        str = first + ' <span class="diff-neg">'+second+'</span>' + third;
      }
      return str;
    } else if (value instanceof Array) {
      let temp = '';
      let count = 0;
      for (let i in value) {
        count ++;
        temp += this.transform(value[i]);
        if (count < (value.length)) temp += ', ';
      }
      return temp;
    } else {
      return value;
    }
  }
}