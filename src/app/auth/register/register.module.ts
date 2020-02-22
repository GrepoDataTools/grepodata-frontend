import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RecaptchaModule} from 'ng-recaptcha';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RegisterRoutingModule} from './register-routing.module';
import {RegisterComponent} from './register.component';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';


@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    RecaptchaModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCheckboxModule
  ]
})
export class RegisterModule { }
