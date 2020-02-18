import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndexAllianceRoutingModule } from './alliance-routing.module';
import { IndexAllianceComponent } from './alliance.component';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {MatCardModule} from '@angular/material/card';
import {IndexSearchModule} from '../search/search.module';
import {IndexVersionModule} from '../index-version/index-version.module';
import {IndexTableModule} from '../table/table.module';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {FormsModule} from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import {TranslateModule} from '@ngx-translate/core';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  declarations: [IndexAllianceComponent],
  exports: [IndexAllianceComponent],
  imports: [
    CommonModule,
    TranslateModule,
    IndexAllianceRoutingModule,
    PipesModule,
    IndexSearchModule,
    IndexVersionModule,
    IndexTableModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressBarModule
  ]
})
export class IndexAllianceModule { }
