import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndexerRoutingModule } from './indexer-routing.module';
import { IndexerComponent } from './indexer.component';


@NgModule({
  declarations: [IndexerComponent],
  imports: [
    CommonModule,
    IndexerRoutingModule
  ]
})
export class IndexerModule { }
