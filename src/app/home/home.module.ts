import { NgModule } from "@angular/core";
import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { PreviewBoxModule } from '../shared/preview-box/preview-box.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [HomeComponent],
  exports: [HomeComponent],
  imports: [
    CommonModule,
    PreviewBoxModule,
    FontAwesomeModule
  ]
})

export class HomeModule {}
