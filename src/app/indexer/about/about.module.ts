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
import {MatInputModule} from '@angular/material/input';
import {TranslateModule} from '@ngx-translate/core';
import {NewIndexDialogModule} from '../../shared/dialogs/new-index-dialog/new-index.module';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [AboutComponent],
  exports: [AboutComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatIconModule,
    PipesModule,
    FormsModule,
    MatCardModule,
    MatProgressBarModule,
    FlexLayoutModule,
    FaqModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    NewIndexDialogModule,
    RouterModule
  ]
})
export class AboutModule { }
