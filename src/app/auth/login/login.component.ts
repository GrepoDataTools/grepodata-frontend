import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {RecaptchaComponent} from "ng-recaptcha";
import {JwtService} from "../services/jwt.service";
import {environment} from "../../../environments/environment";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {CaptchaService} from '../../shared/services/captcha.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
	providers: [JwtService, CaptchaService, RecaptchaComponent]
})
export class LoginComponent implements OnInit {
	@ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;

	@Input() embedded: boolean;
	@Input() embeddedCallback: any;

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
		private authService : JwtService,
		private dialogRef: MatDialog) {
		if (authService.loggedIn) {
			this.router.navigate(['/auth/profile'])
		}
	}

	ngOnInit(): void {
		this.loginForm = this.formBuilder.group({
			mail: ['', Validators.required],
			password: ['', Validators.required]
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
		this.authService.login(this.f.mail.value, this.f.password.value, this.captcha!=''?this.captcha:'dev').subscribe(
			(response) => {
				// console.log(response);
				this.error = '';
				this.loading = false;
				this.success = true;
				if (!this.embedded) {
					this.router.navigate(['/auth/profile']);
				} else {
					this.embeddedCallback();
				}
			},
			(error) => {
				this.captcha = '';
				this.error = "Invalid email address or password.";
				console.log(error);
				if (error.error.message != undefined && error.error.message.search('Invalid captcha') != -1) {
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
