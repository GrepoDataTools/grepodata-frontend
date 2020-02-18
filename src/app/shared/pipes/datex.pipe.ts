import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment";

@Pipe({
  name: 'Datex'
})
export class DatexPipe implements PipeTransform {
  transform(value: string, format: string = ""): string {
    if (!value || value==="") return "";
    return moment(value).format(format);
  }
}
