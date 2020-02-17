import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerRoutingModule } from './player-routing.module';
import { PlayerComponent } from './player.component';
import {IndexPlayerModule} from '../../../indexer/player/player.module';


@NgModule({
  declarations: [PlayerComponent],
  imports: [
    CommonModule,
    PlayerRoutingModule,
    IndexPlayerModule
  ]
})
export class PlayerModule { }
