import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionRoutingModule } from './action-routing.module';
import { ActionComponent } from './action.component';


@NgModule({
  declarations: [ActionComponent],
  imports: [
    CommonModule,
    ActionRoutingModule
  ]
})
export class ActionModule { }
