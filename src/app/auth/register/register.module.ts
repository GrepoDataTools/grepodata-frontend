import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RecaptchaModule} from 'ng-recaptcha';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RegisterRoutingModule} from './register-routing.module';
import {RegisterComponent} from './register.component';


@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    RecaptchaModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RegisterModule { }
