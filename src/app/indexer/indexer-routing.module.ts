import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexerComponent } from './indexer.component';

const routes: Routes = [
  { path: '', component: IndexerComponent },
  { path: 'player', loadChildren: () => import('./player/player.module').then(m => m.IndexPlayerModule) },
  { path: 'alliance', loadChildren: () => import('./alliance/alliance.module').then(m => m.IndexAllianceModule) },
  { path: 'town', loadChildren: () => import('./town/town.module').then(m => m.IndexTownModule) },
  { path: 'action', loadChildren: () => import('./action/action.module').then(m => m.ActionModule) },
  { path: 'changelog', loadChildren: () => import('./changelog/changelog.module').then(m => m.ChangelogModule) },
  { path: ':key', loadChildren: () => import('./index-home/index-home.module').then(m => m.IndexHomeModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexerRoutingModule { }
