import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'UnitIconPipe',  pure: false })
export class UnitIconPipe implements PipeTransform {
  transform(value: any): any {
    let unitString = '';
    for (let i in value) {
      let unit = value[i];
      // console.log(unit);
      if (unitString != '') {unitString+=', ';}
      unitString += unit.count + ' ';
      if (unit.killed > 0) {unitString += '(-'+unit.killed+') '}
      unitString += unit.name;
    }
    unitString = unitString.replace(/_/g, ' ');
    return unitString;
    // if (typeof value == 'string') {
    //   let markup = '';
    //   let units = value.split(", ");
    //   for (let u in units) {
    //     let icon = '';
    //     // switch (true) {
    //     //   case units[u].indexOf('manti') !== -1: icon = 'icon-manti-sm'; break;
    //     //   case units[u].indexOf('erinyes') !== -1: icon = 'icon-erinyen-sm'; break;
    //     //   case units[u].indexOf('slingers') !== -1: icon = 'icon-slinger-sm'; break;
    //     //   case units[u].indexOf('griff') !== -1: icon = 'icon-griff-sm'; break;
    //     //   case units[u].indexOf('horsemen') !== -1: icon = 'icon-horseman-sm'; break;
    //     //   case units[u].indexOf('catapults') !== -1: icon = 'icon-catapult-sm'; break;
    //     //   default: break;
    //     // }
    //     markup += units[u] + (icon != '' ? '<div class="gd-icon-sm '+icon+'"></div>' : icon) + "<br/>";
    //   }
    //   return markup;
    // } else {
    //   return value;
    // }
  }
}