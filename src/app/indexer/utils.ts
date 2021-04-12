import {Component, Inject, Pipe, PipeTransform} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {GoogleAnalyticsEventsService} from "../services/google-analytics-events.service";

@Component({
  selector: 'bb-dialog',
  templateUrl: 'bb.html',
  providers: []
})
export class BBDialog {

  type: any;
  dataBB: any;
  generated_at : any;
  copied = false;
  hiddenKey: boolean = false;
  hideAvailable: boolean = false;
  showNonPriority: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<BBDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
    this.type = data.type;
    this.dataBB = data.dataBB;
    this.generated_at = new Date().toLocaleString();

    this.hideAvailable = this.dataBB.contains_duplicates && this.dataBB.data.length > 6;
    this.showNonPriority = !this.hideAvailable;

    try {
      this.googleAnalyticsEventsService.emitEvent("BB_code", "copyBB", "copyBB", 1);
    } catch (e) {}
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  copyBB() {
    let selection = window.getSelection();
    let txt = document.getElementById('bb_code');
    let range = document.createRange();
    range.selectNodeContents(txt);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();
    this.copied = true;
  }

}

@Pipe({ name: 'HideNoLossPipe',  pure: false })
export class HideNoLossPipe implements PipeTransform {
  transform(value: any, stripBrackets: any = false): any {
    if (typeof value == 'string') {
      let str = value.replace('(-0)', '');
      if (str.includes('(')) {
        let index = value.indexOf('(');
        let first = value.substr(0, index);
        let index2 = value.indexOf(')')+1;
        let second = value.substr(index, index2 - index);
        let third = value.substr(index2);
        if (stripBrackets === true) {
          second = second.replace('(','');
          second = second.replace(')','');
        }
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

@Pipe({ name: 'BBLossPipe',  pure: false })
export class BBLossPipe implements PipeTransform {
  transform(value: any): any {
    if (typeof value == 'string') {
      let str = value.replace('(-0)', '');
      if (str.includes('(')) {
        let index = value.indexOf('(');
        let first = value.substr(0, index);
        let index2 = value.indexOf(')')+1;
        let second = value.substr(index, index2 - index);
        let third = value.substr(index2);
        str = first + ' [color=#C11717]'+second+'[/color]' + third;
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
