import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActionComponent } from './action.component';

const routes: Routes = [{ path: '', component: ActionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActionRoutingModule { }
