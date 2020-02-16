import { NgModule } from "@angular/core";
import { ScoreTableComponent } from './score-table.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ScoreTableComponent],
  exports: [ScoreTableComponent],
  imports: [
    CommonModule,
    TranslateModule
  ]
})

export class ScoreTableModule {}
