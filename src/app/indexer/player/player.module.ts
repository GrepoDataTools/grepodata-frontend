import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerRoutingModule } from './player-routing.module';
import {IndexPlayerComponent} from './player.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {IndexTableModule} from '../table/table.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {MatChipsModule} from '@angular/material/chips';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {IndexSearchModule} from '../search/search.module';
import {IndexVersionModule} from '../index-version/index-version.module';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  declarations: [IndexPlayerComponent],
  exports: [IndexPlayerComponent],
  imports: [
    CommonModule,
    TranslateModule,
    PlayerRoutingModule,
    MatCardModule,
    MatProgressBarModule,
    IndexTableModule,
    PipesModule,
    MatChipsModule,
    MatTabsModule,
    IndexSearchModule,
    IndexVersionModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class IndexPlayerModule { }
