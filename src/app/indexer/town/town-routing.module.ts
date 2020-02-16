import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexTownComponent } from './town.component';

const routes: Routes = [{ path: ':key/:world/:id', component: IndexTownComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexTownRoutingModule { }
