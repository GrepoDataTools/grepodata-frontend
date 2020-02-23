import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {RecaptchaComponent} from "ng-recaptcha";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from "../../../environments/environment";
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
	providers: [AuthService, RecaptchaComponent]
})
export class ResetComponent implements OnInit {
	@ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;

	environment = environment;
	loginForm: FormGroup;
	submitted = false;
	loading = false;
	success = false;
	invalid_token = false;
	captcha = '';
	error = '';
	reset_token = '';
	recaptcha_key = environment.recaptcha;

	constructor(
		private formBuilder: FormBuilder,
    private route: ActivatedRoute,
		private router: Router,
		private authService : AuthService) {
    this.route.params.subscribe( params => {
      if (params.token) {
        this.reset_token = params.token;
      } else {
        this.router.navigate(['/auth/forgot'])
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
      this.loginForm.controls.password.setErrors({'required': true});
      this.loginForm.controls.password2.setErrors({'required': true});
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
      return;
    }

    if (this.f.password.value != this.f.password2.value) {
      this.error = 'Passwords do not match.';
      this.loginForm.controls.password.setErrors({'required': true});
      this.loginForm.controls.password2.setErrors({'required': true});
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
      return;
    }

		this.loading = true;
		this.authService.resetPassword(this.reset_token, this.f.password.value, this.captcha!=''?this.captcha:'dev').subscribe(
			(response) => {
				// console.log(response);
				this.error = '';
				this.loading = false;
				this.success = true;
			},
      (error: HttpErrorResponse) => {
        if (error.status === 500) {
          this.error = "Sorry, we are unable to handle this request right now.";
        } else {
          this.error = "Invalid password.";
          console.log(error);
          if (error.error.message) {
            this.error = error.error.message;
          } else if (error.error.message != undefined && error.error.message.search('Invalid captcha') != -1) {
            this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
          }
          if (error.error.error_code == 3006) {
            this.invalid_token = true;
          }
        }

        this.captcha = '';
        this.loading = false;
        if (this.captchaRef != undefined) {
          this.captchaRef.reset();
        }
      },
		);

	}

}
