import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {MatInputModule} from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RecaptchaModule} from 'ng-recaptcha';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NewIndexDialog} from './new-index.component';
import {RouterModule} from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {LoginModule} from '../../../auth/login/login.module';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [NewIndexDialog],
  exports: [NewIndexDialog],
  imports: [
    CommonModule,
    RecaptchaModule,
    RouterModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    TranslateModule,
    LoginModule
  ]
})
export class NewIndexDialogModule { }
