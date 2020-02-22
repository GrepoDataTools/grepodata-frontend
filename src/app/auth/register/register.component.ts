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
		if (authService.loggedIn) {
			this.router.navigate(['/auth/profile'])
		}
	}

	ngOnInit(): void {
		this.loginForm = this.formBuilder.group({
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
		this.authService.register(this.f.mail.value, this.f.password.value, this.captcha!=''?this.captcha:'dev').subscribe(
			(response) => {
				// console.log(response);
				this.error = '';
				this.loading = false;
				this.success = true;
				this.router.navigate(['/auth/profile'])
			},
			(error) => {
				this.captcha = '';
				this.error = "Invalid email address or password.";
				console.log(error);
				if (error.error.message != undefined && error.error.message.search('Invalid captcha') != -1) {
					this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
				}
				if (error.error.message != undefined && error.error.message.search('already in use') != -1) {
					this.error = 'The email address you entered is already in use. Please reset your password or use a different address.';
				}
				this.loading = false;
				if (this.captchaRef != undefined) {
					this.captchaRef.reset();
				}
			},
		);

	}


}
