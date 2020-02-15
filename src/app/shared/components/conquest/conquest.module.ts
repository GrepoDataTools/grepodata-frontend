import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConquestRoutingModule } from './conquest-routing.module';
import { ConquestComponent } from './conquest.component';


@NgModule({
  declarations: [ConquestComponent],
  imports: [
    CommonModule,
    ConquestRoutingModule
  ]
})
export class ConquestModule { }
