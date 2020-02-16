import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IndexHomeComponent} from './index-home.component';
import {IndexHomeRoutingModule} from './index-home-routing.module';


@NgModule({
  declarations: [IndexHomeComponent],
  imports: [
    CommonModule,
    IndexHomeRoutingModule
  ]
})
export class IndexHomeModule { }
