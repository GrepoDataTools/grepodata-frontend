import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NumberFilterPipe} from './number-filter.pipe';

@NgModule({
  declarations: [NumberFilterPipe],
  imports: [
    CommonModule
  ],
  exports: [
    NumberFilterPipe
  ]
})
export class PipesModule { }
