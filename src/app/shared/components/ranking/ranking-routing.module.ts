import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RankingComponent } from './ranking.component';

const routes: Routes = [{ path: '', component: RankingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RankingRoutingModule { }
