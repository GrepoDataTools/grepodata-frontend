import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RecaptchaModule} from 'ng-recaptcha';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ForgotComponent} from './forgot.component';
import {ForgotRoutingModule} from './forgot-routing.module';


@NgModule({
  declarations: [ForgotComponent],
  imports: [
    CommonModule,
    ForgotRoutingModule,
    RecaptchaModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ForgotModule { }
