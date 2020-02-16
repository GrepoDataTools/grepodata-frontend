import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IndexHomeComponent} from './index-home.component';
import {IndexHomeRoutingModule} from './index-home-routing.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {ContactModule} from '../../shared/dialogs/contact/contact.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [IndexHomeComponent],
  imports: [
    CommonModule,
    TranslateModule,
    IndexHomeRoutingModule,
    PipesModule,
    MatCardModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    MatTabsModule,
    ContactModule,
    FlexLayoutModule
  ]
})
export class IndexHomeModule { }
