import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DonatedRoutingModule } from './donated-routing.module';
import { DonatedComponent } from './donated.component';


@NgModule({
  declarations: [DonatedComponent],
  imports: [
    CommonModule,
    DonatedRoutingModule
  ]
})
export class DonatedModule { }
