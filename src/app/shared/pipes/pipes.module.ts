import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NumberFilterPipe} from './number-filter.pipe';
import {ValuesPipe} from './values.pipe';
import {IndexDatePipe} from './index-date.pipe';

@NgModule({
  declarations: [NumberFilterPipe, ValuesPipe, IndexDatePipe],
  imports: [
    CommonModule
  ],
  exports: [
    NumberFilterPipe,
    ValuesPipe,
    IndexDatePipe
  ]
})
export class PipesModule { }
