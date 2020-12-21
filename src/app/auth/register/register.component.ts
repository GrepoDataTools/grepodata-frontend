import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {JwtService} from "../services/jwt.service";
import {RecaptchaComponent} from "ng-recaptcha";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
	providers: [JwtService, RecaptchaComponent]
})
export class RegisterComponent implements OnInit {
	@ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;

	environment = environment;
	loginForm: FormGroup;
	submitted = false;
	loading = false;
	success = false;
	captcha = '';
	error = '';
	recaptcha_key = environment.recaptcha;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private authService : JwtService) {
    this.authService.accessToken().then(access_token => {
      this.router.navigate(['/profile']);
    });
	}

	ngOnInit(): void {
		this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
			mail: ['', Validators.required],
			password: ['', Validators.required],
			password2: ['', Validators.required],
			privacy: ['', Validators.required]
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

    if (this.f.username.value.length < 3) {
      this.error = 'Your username must be at least 3 characters long.';
      this.loginForm.controls.username.setErrors({'incorrect': true});
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

		this.loading = true;
		this.authService.register(this.f.username.value, this.f.mail.value, this.f.password.value, this.captcha!=''?this.captcha:'dev').subscribe(
			(response) => {
				// console.log(response);
				this.error = '';
				this.loading = false;
				this.success = true;
				this.router.navigate(['/profile'])
			},
			(error) => {
				this.captcha = '';
				this.error = "Invalid email address or password.";
				console.log(error);
				if (error.error.message != undefined && error.error.message.search('Invalid captcha') != -1) {
					this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
				}
				if (error.error.error_code != undefined && error.error.error_code == 3030) {
					this.error = 'The email address you entered is already in use. Please reset your password or use a different address.';
				}
				if (error.error.error_code != undefined && error.error.error_code == 3032) {
					this.error = 'The username you entered is already in use. Please enter a different username.';
          this.loginForm.controls.username.setErrors({'incorrect': true});
				}
				this.loading = false;
				if (this.captchaRef != undefined) {
					this.captchaRef.reset();
				}
			},
		);

	}


}
