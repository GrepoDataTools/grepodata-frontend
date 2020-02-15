import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConquestComponent } from './conquest.component';

const routes: Routes = [{ path: '', component: ConquestComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConquestRoutingModule { }
