import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DonatedComponent } from './donated.component';

const routes: Routes = [{ path: '', component: DonatedComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonatedRoutingModule { }
