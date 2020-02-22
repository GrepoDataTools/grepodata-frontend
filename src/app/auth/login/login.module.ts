import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {LoginComponent} from './login.component';
import {RecaptchaModule} from 'ng-recaptcha';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  declarations: [LoginComponent],
  exports: [LoginComponent],
  imports: [
    CommonModule,
    RecaptchaModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule
  ]
})
export class LoginModule { }
