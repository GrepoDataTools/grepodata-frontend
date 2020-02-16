import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqComponent } from './faq.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [FaqComponent],
  exports: [FaqComponent],
  imports: [
    CommonModule,
    MatIconModule
  ]
})
export class FaqModule { }
