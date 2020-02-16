import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AboutComponent} from './about.component';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {FormsModule} from '@angular/forms';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FaqModule} from '../faq/faq.module';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';


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
    FlexLayoutModule,
    FaqModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule
  ]
})
export class AboutModule { }
