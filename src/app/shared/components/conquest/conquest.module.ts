import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConquestRoutingModule } from './conquest-routing.module';
import { ConquestComponent } from './conquest.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatChipsModule} from '@angular/material/chips';
import {PipesModule} from '../../pipes/pipes.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [ConquestComponent],
  exports: [ConquestComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ConquestRoutingModule,
    MatCardModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    PipesModule,
    RouterModule
  ]
})
export class ConquestModule { }
