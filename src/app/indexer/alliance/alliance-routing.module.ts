import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexAllianceComponent } from './alliance.component';

const routes: Routes = [{ path: ':key/:world/:id', component: IndexAllianceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexAllianceRoutingModule { }
