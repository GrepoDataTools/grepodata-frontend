import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TownComponent } from './town.component';

const routes: Routes = [{ path: '', component: TownComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TownRoutingModule { }
