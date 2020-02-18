import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndexerRoutingModule } from './indexer-routing.module';
import { IndexerComponent } from './indexer.component';
import {IndexHomeModule} from './index-home/index-home.module';
import {AboutModule} from './about/about.module';
import {TranslateModule} from '@ngx-translate/core';
import { IndexVersionComponent } from './index-version/index-version.component';
import { WorldService } from '../shared/services/world.service';
import { LocalStorageService } from '../shared/services/local-storage.service';


@NgModule({
  declarations: [IndexerComponent],
  imports: [
    CommonModule,
    AboutModule,
    IndexerRoutingModule,
    IndexHomeModule,
    TranslateModule
  ],
  providers: [WorldService, LocalStorageService]
})
export class IndexerModule { }
