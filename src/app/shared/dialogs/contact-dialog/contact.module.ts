import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactDialog } from './contact.component';
import {RecaptchaModule} from 'ng-recaptcha';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  declarations: [ContactDialog],
  imports: [
    CommonModule,
    RecaptchaModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    FlexLayoutModule,
    MatInputModule,
    MatCheckboxModule,
    TranslateModule
  ]
})
export class ContactModule { }
