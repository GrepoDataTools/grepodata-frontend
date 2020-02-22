import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangelogRoutingModule } from './changelog-routing.module';
import { ChangelogComponent } from './changelog.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [ChangelogComponent],
  imports: [
    CommonModule,
    ChangelogRoutingModule,
    FontAwesomeModule,
  ]
})
export class ChangelogModule { }
