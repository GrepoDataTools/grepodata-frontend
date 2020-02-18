import { NgModule } from "@angular/core";
import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { PreviewBoxModule } from './preview-box/preview-box.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {HomeRoutingModule} from './home-routing.module';
import { ScoreTableModule } from '../shared/components/score-table/score-table.module';
import { ScoreTableComponent } from './score-table/score-table.component';

@NgModule({
  declarations: [HomeComponent, ScoreTableComponent],
  exports: [HomeComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    HomeRoutingModule,
    ScoreTableModule
  ]
})

export class HomeModule {}
