import {Component, OnInit, ViewChild} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../../environments/environment';
import {JwtService} from '../../../services/jwt.service';
import {RecaptchaComponent} from 'ng-recaptcha';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  @ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;
  recaptcha_key = environment.recaptcha;

  environment = environment;
  passwordForm: UntypedFormGroup;

  error = '';
  captcha = '';
  success = false;
  loading = false;
  submitted = false;

  constructor(
    private authService: JwtService,
    private formBuilder: UntypedFormBuilder
  ) { }

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      oldpassword: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required],
    });
  }

  get f() { return this.passwordForm.controls; }

  public sendRequest() {
    this.submitted = true;
    if (this.captchaRef != undefined) {
      this.captchaRef.reset();
    }

    if (this.passwordForm.invalid) {
      return;
    }

    if (this.f.oldpassword.value.length <= 0) {
      this.error = 'Please enter your old password.';
      this.passwordForm.controls.old_password.setErrors({'incorrect': true});
      return;
    }

    if (this.f.password.value.length < 8) {
      this.error = 'Your password must be at least 8 characters long.';
      this.passwordForm.controls.password.setErrors({'incorrect': true});
      this.passwordForm.controls.password2.setErrors({'incorrect': true});
      return;
    }

    if (this.f.password.value != this.f.password2.value) {
      this.error = 'Passwords do not match.';
      this.passwordForm.controls.password.setErrors({'incorrect': true});
      this.passwordForm.controls.password2.setErrors({'incorrect': true});
      return;
    }

    let old_password = this.f.oldpassword.value;
    let new_password = this.f.password.value;

    this.loading = true;
    this.authService.accessToken().then(access_token => {
      this.authService.changeActivePassword(access_token, old_password, new_password, this.captcha != '' ? this.captcha : 'dev').subscribe(
        (response) => {
          // console.log(response);
          this.error = '';
          this.loading = false;
          this.success = true;
        },
        (error) => {
          console.log(error);
          this.error = "Unable to update your password. Please try again later or contact us if this error persists.";
          if ('error_code' in error.error && error.error.error_code == 3005) {
            this.error = "Invalid current password. Please enter your current active password.";
            this.passwordForm.controls.old_password.setErrors({'incorrect': true});
          }
          this.loading = false;
        },
      );
    });

  }

  resolved_captcha(captchaResponse: string) {
    this.captcha = captchaResponse;
    this.sendRequest();
  }
}
