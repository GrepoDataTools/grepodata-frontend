import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {RecaptchaComponent} from "ng-recaptcha";
import {AuthService} from "../../shared/services/auth.service";
import {environment} from "../../../environments/environment";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {CaptchaService} from '../../shared/services/captcha.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
	providers: [AuthService, CaptchaService, RecaptchaComponent]
})
export class LoginComponent implements OnInit {
	@ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;

	@Input() embedded: boolean;
	@Output() onLoggedIn: EventEmitter<any> = new EventEmitter();

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
		private authService : AuthService,
		private dialogRef: MatDialog) { }

	ngOnInit(): void {
    if (this.authService.loggedIn) {
      this.router.navigate(['/auth/profile'])
    }

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
				this.error = '';
				this.loading = false;
				this.success = true;
				if (!this.embedded) {
					this.router.navigate(['/auth/profile']);
				} else {
          this.onLoggedIn.emit([true]);
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
