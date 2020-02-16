import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerRoutingModule } from './player-routing.module';
import { PlayerComponent } from './player.component';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [PlayerComponent],
  imports: [
    CommonModule,
    PlayerRoutingModule
  ]
})
export class PlayerModule { }
