import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TownRoutingModule } from './town-routing.module';
import { TownComponent } from './town.component';


@NgModule({
  declarations: [TownComponent],
  imports: [
    CommonModule,
    TownRoutingModule
  ]
})
export class TownModule { }
