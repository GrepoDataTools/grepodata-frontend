import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {TranslateModule} from '@ngx-translate/core';
import {IndexSearchComponent} from './search.component';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {RouterModule} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';


@NgModule({
  declarations: [IndexSearchComponent],
  exports: [IndexSearchComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatProgressBarModule,
    PipesModule,
    RouterModule,
    FlexLayoutModule
  ]
})
export class IndexSearchModule { }
