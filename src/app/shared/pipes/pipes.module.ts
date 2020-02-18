import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NumberFilterPipe} from './number-filter.pipe';
import {ValuesPipe} from './values.pipe';
import {IndexDatePipe} from './index-date.pipe';
import {HideNoLossPipe} from './hide-no-loss.pipe';
import {DatexPipe} from './datex.pipe';

@NgModule({
  declarations: [NumberFilterPipe, ValuesPipe, IndexDatePipe, HideNoLossPipe, DatexPipe],
  imports: [
    CommonModule
  ],
  exports: [
    NumberFilterPipe,
    ValuesPipe,
    IndexDatePipe,
    HideNoLossPipe,
    DatexPipe
  ]
})
export class PipesModule { }
