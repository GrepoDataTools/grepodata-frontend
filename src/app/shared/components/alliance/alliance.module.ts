import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllianceRoutingModule } from './alliance-routing.module';
import { AllianceComponent } from './alliance.component';
import {IndexAllianceModule} from '../../../indexer/alliance/alliance.module';


@NgModule({
  declarations: [AllianceComponent],
  imports: [
    CommonModule,
    AllianceRoutingModule,
    IndexAllianceModule
  ]
})
export class AllianceModule { }
