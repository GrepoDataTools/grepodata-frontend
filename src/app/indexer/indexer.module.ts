import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndexerRoutingModule } from './indexer-routing.module';
import { IndexerComponent } from './indexer.component';
import {IndexHomeModule} from './index-home/index-home.module';
import {AboutModule} from './about/about.module';


@NgModule({
  declarations: [IndexerComponent],
  imports: [
    CommonModule,
    AboutModule,
    IndexerRoutingModule,
    IndexHomeModule
  ]
})
export class IndexerModule { }
