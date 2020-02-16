import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {IndexPlayerComponent} from './player.component';

const routes: Routes = [{ path: ':key/:world/:id', component: IndexPlayerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayerRoutingModule { }
