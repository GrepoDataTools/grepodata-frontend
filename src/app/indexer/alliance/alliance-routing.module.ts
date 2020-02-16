import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllianceComponent } from './alliance.component';

const routes: Routes = [{ path: '', component: AllianceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllianceRoutingModule { }
