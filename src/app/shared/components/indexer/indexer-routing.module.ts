import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexerComponent } from './indexer.component';

const routes: Routes = [{ path: '', component: IndexerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexerRoutingModule { }
