import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiscordComponent } from './discord.component';

const routes: Routes = [{ path: '', component: DiscordComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscordRoutingModule { }
