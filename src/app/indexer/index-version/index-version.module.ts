import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {IndexVersionComponent} from './index-version.component';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  declarations: [IndexVersionComponent],
  exports: [IndexVersionComponent],
  imports: [
    CommonModule,
    TranslateModule
  ]
})
export class IndexVersionModule { }
