import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndexerRoutingModule } from './indexer-routing.module';
import { IndexerComponent } from './indexer.component';
import {IndexHomeModule} from './index-home/index-home.module';
import {AboutModule} from './about/about.module';
import {TranslateModule} from '@ngx-translate/core';
import { IndexVersionComponent } from './index-version/index-version.component';


@NgModule({
  declarations: [IndexerComponent],
  imports: [
    CommonModule,
    AboutModule,
    IndexerRoutingModule,
    IndexHomeModule,
    TranslateModule
  ]
})
export class IndexerModule { }
