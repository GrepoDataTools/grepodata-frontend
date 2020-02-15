import { NgModule } from "@angular/core";
import { PreviewBoxComponent } from './preview-box.component';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [PreviewBoxComponent],
  exports: [PreviewBoxComponent],
  imports: [CommonModule, FontAwesomeModule]
})

export class PreviewBoxModule {}
