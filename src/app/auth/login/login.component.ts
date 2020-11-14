import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { RecaptchaComponent } from 'ng-recaptcha';
import { JwtService } from '../services/jwt.service';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [JwtService, RecaptchaComponent],
})
export class LoginComponent implements OnInit {
    @ViewChild(RecaptchaComponent, { static: false }) captchaRef: RecaptchaComponent;

    @Input() embedded: boolean;
    @Input() embeddedCallback: any;

    environment = environment;
    login_user = '';
    login_password = '';
    submitted = false;
    loading = false;
    success = false;
    captcha = '';
    error = '';
    recaptcha_key = environment.recaptcha;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: JwtService,
        private dialogRef: MatDialog,
        protected activatedRoute: ActivatedRoute
    ) {
        if (authService.loggedIn) {
            this.router.navigate(['/profile']);
        }
    }

    ngOnInit(): void {
        if (this.activatedRoute.snapshot.queryParams.code) {
            this.authService
                .loginWithDiscord(this.activatedRoute.snapshot.queryParams.code)
                .subscribe((response) => console.log(response));
        }
    }

    resolved(captchaResponse: string) {
        this.captcha = captchaResponse;
        this.sendRequest();
    }

    public sendRequest() {
        this.submitted = true;
        if (this.login_user == '') {
            this.error = 'Email Address or Username is required';
            return;
        }
        if (this.login_password == '') {
            this.error = 'Password is required';
            return;
        }
        this.loading = true;
        this.authService
            .login(this.login_user, this.login_password, this.captcha != '' ? this.captcha : 'dev')
            .subscribe(
                (response) => {
                    // console.log(response);
                    this.error = '';
                    this.loading = false;
                    this.success = true;
                    if (!this.embedded) {
                        this.router.navigate(['/profile']);
                    } else {
                        this.embeddedCallback();
                    }
                },
                (error) => {
                    this.captcha = '';
                    this.error = 'Unable to login, please try again later.';
                    console.log(error);
                    if (error.error.message != undefined && error.error.message.search('Invalid captcha') != -1) {
                        this.error =
                            'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
                    }
                    if (
                        error.error.error_code != undefined &&
                        (error.error.error_code == 3004 || error.error.error_code == 3005)
                    ) {
                        this.error = 'Invalid email address or password.';
                    }
                    this.loading = false;
                    if (this.captchaRef != undefined) {
                        this.captchaRef.reset();
                    }
                }
            );
    }

    loginWithDiscord() {
        window.location.href = environment.discordLoginUrl;
    }
}
