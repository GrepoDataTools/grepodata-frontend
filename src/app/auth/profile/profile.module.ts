import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RecaptchaModule} from 'ng-recaptcha';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProfileComponent} from './profile.component';
import {ProfileRoutingModule} from './profile-routing.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';


@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    RecaptchaModule,
    ProfileRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    MatCardModule,
    MatProgressBarModule
  ]
})
export class ProfileModule { }
