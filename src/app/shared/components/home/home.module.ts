import { NgModule } from "@angular/core";
import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { PreviewBoxModule } from './preview-box/preview-box.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {HomeRoutingModule} from './home-routing.module';

@NgModule({
  declarations: [HomeComponent],
  exports: [HomeComponent],
  imports: [
    CommonModule,
    PreviewBoxModule,
    FontAwesomeModule,
    HomeRoutingModule
  ]
})

export class HomeModule {}
