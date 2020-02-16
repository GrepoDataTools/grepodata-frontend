import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NumberFilterPipe} from './number-filter.pipe';
import {ValuesPipe} from './values.pipe';
import {IndexDatePipe} from './index-date.pipe';
import {HideNoLossPipe} from './hide-no-loss.pipe';

@NgModule({
  declarations: [NumberFilterPipe, ValuesPipe, IndexDatePipe, HideNoLossPipe],
  imports: [
    CommonModule
  ],
  exports: [
    NumberFilterPipe,
    ValuesPipe,
    IndexDatePipe,
    HideNoLossPipe
  ]
})
export class PipesModule { }
