import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';
import {IndexTableComponent} from './table.component';
import {MatCardModule} from '@angular/material/card';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {RouterModule} from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [IndexTableComponent],
  exports: [IndexTableComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    PipesModule,
    RouterModule,
    MatInputModule,
    FormsModule
  ]
})
export class IndexTableModule { }
