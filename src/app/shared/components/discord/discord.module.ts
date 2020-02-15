import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscordRoutingModule } from './discord-routing.module';
import { DiscordComponent } from './discord.component';


@NgModule({
  declarations: [DiscordComponent],
  imports: [
    CommonModule,
    DiscordRoutingModule
  ]
})
export class DiscordModule { }
