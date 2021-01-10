import {Component, OnInit, ViewChild} from '@angular/core';
import {JwtService} from '../services/jwt.service';
import {RecaptchaComponent} from 'ng-recaptcha';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  providers: [JwtService, RecaptchaComponent]
})
export class ResetPasswordComponent implements OnInit {

  @ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;

  environment = environment;
  loginForm: FormGroup;
  submitted = false;
  loading = false;
  success = false;
  captcha = '';
  error = '';
  token = '';
  recaptcha_key = environment.recaptcha;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService : JwtService) {

    this.authService.accessToken().then(access_token => {
      this.router.navigate(['/profile']);
    });

    this.route.params.subscribe((params) => {
      if ('token' in params) {
        this.token = params.token
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      password: ['', Validators.required],
      password2: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
    this.sendRequest();
  }

  public sendRequest() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
      return;
    }

    if (this.f.password.value.length < 8) {
      this.error = 'Your password must be at least 8 characters long.';
      this.loginForm.controls.password.setErrors({'incorrect': true});
      this.loginForm.controls.password2.setErrors({'incorrect': true});
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
      return;
    }

    if (this.f.password.value != this.f.password2.value) {
      this.error = 'Passwords do not match.';
      this.loginForm.controls.password.setErrors({'incorrect': true});
      this.loginForm.controls.password2.setErrors({'incorrect': true});
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
      return;
    }

    let new_password = this.f.password.value;

    this.loading = true;
    this.authService.changePasswordWithToken(this.token, new_password, this.captcha!=''?this.captcha:'dev').subscribe(
      (response) => {
        // console.log(response);
        this.error = '';
        this.loading = false;
        this.success = true;
      },
      (error) => {
        console.log(error);
        this.captcha = '';
        this.error = "Unable to update your password. Please try again later or contact us if this error persists.";

        if ('error_code' in error.error && error.error.error_code == 3006) {
          this.error = "Your password reset token has expired. Please request a new password reset email."
        } else if (error.error.message != undefined && error.error.message.search('Invalid captcha') != -1) {
          this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
        }

        this.loading = false;
        if (this.captchaRef != undefined) {
          this.captchaRef.reset();
        }
      },
    );

  }

}
