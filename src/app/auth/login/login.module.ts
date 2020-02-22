import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {LoginComponent} from './login.component';
import {LoginRoutingModule} from './login-routing.module';
import {RecaptchaModule} from 'ng-recaptcha';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    RecaptchaModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class LoginModule { }
