import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerRoutingModule } from './player-routing.module';
import {IndexPlayerComponent} from './player.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {IndexTableModule} from '../table/table.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {MatInputModule} from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {IndexSearchModule} from '../search/search.module';
import {IndexVersionModule} from '../index-version/index-version.module';
import {MatIconModule} from '@angular/material/icon';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [IndexPlayerComponent],
  imports: [
    CommonModule,
    PlayerRoutingModule,
    MatCardModule,
    MatProgressBarModule,
    IndexTableModule,
    PipesModule,
    MatInputModule,
    MatChipsModule,
    MatTabsModule,
    IndexSearchModule,
    IndexVersionModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class IndexPlayerModule { }
