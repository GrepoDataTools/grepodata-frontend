import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {IndexVersionComponent} from './index-version.component';


@NgModule({
  declarations: [IndexVersionComponent],
  exports: [IndexVersionComponent],
  imports: [
    CommonModule
  ]
})
export class IndexVersionModule { }
