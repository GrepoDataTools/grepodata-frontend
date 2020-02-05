import {Component, OnInit, ViewChild} from '@angular/core';
import {JwtService} from "../services/jwt.service";
import {RecaptchaComponent} from "ng-recaptcha";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
	providers: [JwtService, RecaptchaComponent]
})
export class ForgotComponent implements OnInit {
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
			this.router.navigate(['/profile'])
		}
	}

	ngOnInit(): void {
		this.loginForm = this.formBuilder.group({
			mail: ['', Validators.required]
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

		this.loading = true;
		this.authService.forgot(this.f.mail.value, this.captcha!=''?this.captcha:'dev').subscribe(
			(response) => {
				// console.log(response);
				this.error = '';
				this.loading = false;
				this.success = true;
			},
			(error) => {
				this.captcha = '';
				this.error = "Invalid email address.";
				console.log(error);
				if (error.error.message != undefined && error.error.message.search('Invalid captcha') != -1) {
					this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
				} else {
					this.loginForm.controls.mail.setErrors({'incorrect': true});
				}
				this.loading = false;
				if (this.captchaRef != undefined) {
					this.captchaRef.reset();
				}
			},
		);

	}

}
