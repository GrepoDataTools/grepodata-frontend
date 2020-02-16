import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AboutComponent} from './about.component';
import {MatIconModule} from '@angular/material/icon';
import {AppModule} from '../../app.module';
import {MatCardModule} from '@angular/material/card';
import {FormsModule} from '@angular/forms';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {FlexLayoutModule} from '@angular/flex-layout';


@NgModule({
  declarations: [AboutComponent],
  exports: [AboutComponent],
  imports: [
    CommonModule,
    MatIconModule,
    PipesModule,
    FormsModule,
    MatCardModule,
    MatProgressBarModule,
    FlexLayoutModule
  ]
})
export class AboutModule { }
