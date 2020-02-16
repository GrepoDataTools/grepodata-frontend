import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {IndexHomeComponent} from './index-home.component';

const routes: Routes = [{ path: '', component: IndexHomeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexHomeRoutingModule { }
