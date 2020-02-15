import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangesComponent } from './changes.component';

const routes: Routes = [{ path: '', component: ChangesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangesRoutingModule { }
