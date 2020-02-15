import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RankingRoutingModule } from './ranking-routing.module';
import { RankingComponent } from './ranking.component';


@NgModule({
  declarations: [RankingComponent],
  imports: [
    CommonModule,
    RankingRoutingModule
  ]
})
export class RankingModule { }
