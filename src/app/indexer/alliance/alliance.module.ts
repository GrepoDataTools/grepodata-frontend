import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllianceRoutingModule } from './alliance-routing.module';
import { AllianceComponent } from './alliance.component';


@NgModule({
  declarations: [AllianceComponent],
  imports: [
    CommonModule,
    AllianceRoutingModule
  ]
})
export class AllianceModule { }
