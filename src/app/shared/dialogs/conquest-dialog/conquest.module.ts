import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ConquestDialog} from './conquest.component';
import {ConquestModule} from '../../components/conquest/conquest.module';


@NgModule({
  declarations: [ConquestDialog],
  exports: [ConquestDialog],
  imports: [
    CommonModule,
    TranslateModule,
    ConquestModule
  ]
})
export class ConquestDialogModule { }
