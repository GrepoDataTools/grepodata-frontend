import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompareComponent } from './compare.component';

const routes: Routes = [{ path: '', component: CompareComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompareRoutingModule { }
