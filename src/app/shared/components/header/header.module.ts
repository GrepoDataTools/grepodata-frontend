import { NgModule } from "@angular/core";
import { HeaderComponent } from './header.component';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {MatDialogModule} from '@angular/material/dialog';
import {ContactModule} from '../../dialogs/contact/contact.module';

@NgModule({
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
  imports: [
    BrowserModule,
    TranslateModule,
    RouterModule,
    MatDialogModule,
    ContactModule
  ]
})

export class HeaderModule { }