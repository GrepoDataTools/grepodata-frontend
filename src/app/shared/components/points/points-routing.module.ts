import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PointsComponent } from './points.component';

const routes: Routes = [{ path: '', component: PointsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PointsRoutingModule { }
