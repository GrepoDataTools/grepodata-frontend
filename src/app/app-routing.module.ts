import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'alliance', loadChildren: () => import('./shared/components/alliance/alliance.module').then(m => m.AllianceModule) },
  { path: 'changelog', loadChildren: () => import('./shared/components/changelog/changelog.module').then(m => m.ChangelogModule) },
  { path: 'compare', loadChildren: () => import('./shared/components/compare/compare.module').then(m => m.CompareModule) },
  { path: 'conquest', loadChildren: () => import('./shared/components/conquest/conquest.module').then(m => m.ConquestModule) },
  { path: 'player', loadChildren: () => import('./shared/components/player/player.module').then(m => m.PlayerModule) },
  { path: 'indexer', loadChildren: () => import('./shared/components/indexer/indexer.module').then(m => m.IndexerModule) },
  { path: 'indexer/player', loadChildren: () => import('./shared/components/indexer/player/player.module').then(m => m.PlayerModule) },
  { path: 'indexer/alliance', loadChildren: () => import('./shared/components/indexer/alliance/alliance.module').then(m => m.AllianceModule) },
  { path: 'indexer/town', loadChildren: () => import('./shared/components/indexer/town/town.module').then(m => m.TownModule) },
  { path: 'indexer/action', loadChildren: () => import('./shared/components/indexer/action/action.module').then(m => m.ActionModule) },
  { path: 'indexer/faq', loadChildren: () => import('./shared/components/indexer/faq/faq.module').then(m => m.FaqModule) },
  { path: 'discord', loadChildren: () => import('./shared/components/discord/discord.module').then(m => m.DiscordModule) },
  { path: 'privacy', loadChildren: () => import('./shared/components/privacy/privacy.module').then(m => m.PrivacyModule) },
  { path: 'donated', loadChildren: () => import('./shared/components/donated/donated.module').then(m => m.DonatedModule) },
  { path: 'ranking', loadChildren: () => import('./shared/components/ranking/ranking.module').then(m => m.RankingModule) },
  { path: 'points', loadChildren: () => import('./shared/components/points/points.module').then(m => m.PointsModule) },
  { path: 'contact', loadChildren: () => import('./shared/components/contact/contact.module').then(m => m.ContactModule) },
  { path: 'changes', loadChildren: () => import('./shared/components/changes/changes.module').then(m => m.ChangesModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
