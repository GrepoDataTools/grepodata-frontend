import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment";

@Pipe({
  name: 'IndexDate'
})
export class IndexDatePipe implements PipeTransform {
  transform(value: string, as_html: any = null): string {
    if (!value || value==="") return "";
    if (as_html == null) {
      return moment(value, "DD-MM-YY HH:mm:ss").format('D MMM YYYY HH:mm');
    } else {
      let date = moment(value, "DD-MM-YY HH:mm:ss").format('D MMM__ YYYY___ HH:mm');
      date = date.replace('___','</span>');
      date = date.replace('__','<span class="hidden-xs">');
      return date;
    }
  }
}
