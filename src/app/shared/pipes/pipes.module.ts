import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NumberFilterPipe} from './number-filter.pipe';
import {ValuesPipe} from './values.pipe';
import {IndexDatePipe} from './index-date.pipe';
import {HideNoLossPipe} from './hide-no-loss.pipe';
import {DatexPipe} from './datex.pipe';
import {DiffFilterPipe} from './diff-filter.pipe';
import {DiffFilterNonZeroPipe} from './diff-filter-non-zero.pipe';
import {UnitIconPipe} from './unit-icon.pipe';
import {BBLossPipe} from './bb-loss.pipe';

@NgModule({
  declarations: [NumberFilterPipe, ValuesPipe, IndexDatePipe, HideNoLossPipe, DatexPipe, DiffFilterPipe, DiffFilterNonZeroPipe, UnitIconPipe, BBLossPipe],
  imports: [
    CommonModule
  ],
  exports: [
    NumberFilterPipe,
    ValuesPipe,
    IndexDatePipe,
    HideNoLossPipe,
    DatexPipe,
    DiffFilterPipe,
    DiffFilterNonZeroPipe,
    UnitIconPipe,
    BBLossPipe
  ]
})
export class PipesModule { }
