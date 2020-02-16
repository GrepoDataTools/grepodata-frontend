import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndexTownRoutingModule } from './town-routing.module';
import { IndexTownComponent } from './town.component';
import {MatCardModule} from '@angular/material/card';
import {TranslateModule} from '@ngx-translate/core';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {IndexSearchModule} from '../search/search.module';
import {IndexVersionModule} from '../index-version/index-version.module';


@NgModule({
  declarations: [IndexTownComponent],
  imports: [
    CommonModule,
    TranslateModule,
    IndexTownRoutingModule,
    MatCardModule,
    PipesModule,
    MatTooltipModule,
    MatProgressBarModule,
    IndexSearchModule,
    IndexVersionModule
  ]
})
export class IndexTownModule { }
