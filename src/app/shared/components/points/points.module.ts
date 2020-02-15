import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PointsRoutingModule } from './points-routing.module';
import { PointsComponent } from './points.component';


@NgModule({
  declarations: [PointsComponent],
  imports: [
    CommonModule,
    PointsRoutingModule
  ]
})
export class PointsModule { }
