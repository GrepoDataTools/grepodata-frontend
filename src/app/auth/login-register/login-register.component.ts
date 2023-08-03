import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {RecaptchaComponent} from 'ng-recaptcha';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {environment} from "../../../environments/environment";
import {Router} from '@angular/router';
import {JwtService} from '../services/jwt.service';
import {IndexAuthService} from '../services/index.service';
import {BasicDialog} from '../../shared/dialogs/basic/basic.component';
import {MatDialog} from '@angular/material/dialog';
import {Globals} from '../../globals';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss'],
  providers: [IndexAuthService]
})
export class LoginRegisterComponent implements OnInit, AfterViewInit {
  @ViewChild(RecaptchaComponent, { static: false }) captchaRef: RecaptchaComponent;

  @Input() useCallback: boolean;
  @Input() require_explicit_action = false; // Require interaction with form before redirecting

  @Output() onEmbeddedCallback: EventEmitter<any> = new EventEmitter();

  environment = environment;
  resetForm: UntypedFormGroup;
  loginForm: UntypedFormGroup;
  registerForm: UntypedFormGroup;
  register_submitted = false;
  login_submitted = false;
  reset_submitted = false;
  register_loading = false;
  login_loading = false;
  reset_loading = false;
  register_success = false;
  login_success = false;
  reset_success = false;
  register_error = '';
  login_error = '';
  reset_error = '';
  captcha = '';
  recaptcha_key = environment.recaptcha;

  execute_login = false;
  execute_register = false;
  forgotPassswordForm = false;

  constructor(
    private router: Router,
    private globals: Globals,
    private authService : JwtService,
    private formBuilder: UntypedFormBuilder,
    private indexAuthService: IndexAuthService
  ) {
  }

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      resetmail: ['', Validators.required]
    });
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.registerForm = this.formBuilder.group({
      newusername: ['', Validators.required],
      mail: ['', Validators.required],
      newpassword: ['', Validators.required],
      privacy: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    if (!this.require_explicit_action) {
      this.authService.accessToken(false).then(access_token => {
        if (access_token && access_token != 'refresh_failed') {
          console.log('already logged in, redirecting..');
          this.loginComplete(access_token);
        }
      },
      rejected => {
        console.log(rejected);
      });
    }
  }

  // convenience getter for easy access to form fields
  get lf() { return this.loginForm.controls; }
  get rf() { return this.registerForm.controls; }
  get resetf() { return this.resetForm.controls; }

  resolved_captcha(captchaResponse: string) {
    this.captcha = captchaResponse;
    if (this.execute_login && this.forgotPassswordForm) {
      this.executeForgot()
    } else if (this.execute_login) {
      this.executeLogin()
    } else {
      this.executeRegister()
    }
  }

  togglePasswordForm() {
    this.reset_success = false;
    this.login_submitted = false;
    this.reset_submitted = false;
    this.resetForm.reset();
    this.loginForm.reset();
    this.forgotPassswordForm = !this.forgotPassswordForm;
  }

  doForgot() {
    this.execute_login = true;
    this.execute_register = false;
    if (environment.production==true) {
      this.captchaRef.execute()
    } else {
      this.executeForgot();
    }
  }

  doLogin() {
    this.execute_login = true;
    this.execute_register = false;
    if (environment.production==true) {
      this.captchaRef.execute()
    } else {
      this.executeLogin();
    }
  }

  doRegister() {
    this.execute_login = false;
    this.execute_register = true;
    if (environment.production==true) {
      this.captchaRef.execute()
    } else {
      this.executeRegister();
    }
  }

  executeLogin() {
    console.log("Login");
    this.login_submitted = true;
    if (this.loginForm.invalid) {
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
      return;
    }

    this.login_loading = true;
    this.authService
      .login(this.lf.username.value, this.lf.password.value, this.captcha != '' ? this.captcha : 'dev')
      .subscribe(
        (response) => {
          this.login_error = '';
          this.login_success = true;

          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);

          // handle login complete
          this.loginComplete(response.access_token);
        },
        (error) => {
          this.captcha = '';
          this.login_error = '';
          console.log(error);
          if (error.error.message != undefined && error.error.message.search('Invalid captcha') != -1) {
            this.login_error =
              'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
          }
          if (error.error.error_code != undefined && error.error.error_code == 3004) {
            this.loginForm.controls.username.setErrors({'custom': 'No user found with this username or email address.'});
          } else if (error.error.error_code != undefined && error.error.error_code == 3005) {
            this.loginForm.controls.password.setErrors({'custom': 'Invalid password for this user.'});
          } else {
            this.login_error = 'Unable to login, please try again later.';
          }
          this.login_loading = false;
          if (this.captchaRef != undefined) {
            this.captchaRef.reset();
          }
        }
      );
  }

  executeRegister() {
    console.log("Register");
    this.register_submitted = true;
    let has_error = false;

    if (!this.rf.privacy.invalid && this.rf.privacy.value !== true) {
      this.registerForm.controls.privacy.setErrors({'custom': 'Accept our privacy policy to continue'});
      has_error = true;
    }

    if (!this.rf.newusername.invalid && this.rf.newusername.value.length < 4) {
      this.registerForm.controls.newusername.setErrors({'custom': 'Your username must be at least 4 characters long'});
      has_error = true;
    }

    if (!this.rf.newpassword.invalid && this.rf.newpassword.value.length < 8) {
      this.registerForm.controls.newpassword.setErrors({'custom': 'Your password must be at least 8 characters long'});
      has_error = true;
    }

    let mailreg = new RegExp(/^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i);
    if (!this.rf.mail.invalid && !mailreg.test(this.rf.mail.value)) {
      this.registerForm.controls.mail.setErrors({'custom': 'Enter a valid email address (e.g. john@example.com)'});
      has_error = true;
    }

    if (has_error || this.registerForm.invalid) {
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
      return;
    }

    this.register_loading = true;
    this.authService.register(this.rf.newusername.value, this.rf.mail.value, this.rf.newpassword.value, this.captcha!=''?this.captcha:'dev').subscribe(
      (response) => {
        // console.log(response);
        this.register_error = '';
        this.register_success = true;

        // handle login complete
        if (response.access_token != undefined) {
          this.loginComplete(response.access_token);
        } else {
          this.register_error = "Sorry, something went wrong. Please try again later or contact us if this error persists.";
          this.register_loading = false;
        }
      },
      (error) => {
        this.captcha = '';
        this.register_error = "";
        console.log(error);
        if (error.error.message != undefined && error.error.message.search('Invalid captcha') != -1) {
          this.register_error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
        } else if (error.error.error_code != undefined && error.error.error_code == 3030) {
          this.registerForm.controls.mail.setErrors({'custom': 'The email address you entered is already in use. Please reset your password or use a different address.'});
        } else if (error.error.error_code != undefined && error.error.error_code == 3032) {
          this.registerForm.controls.newusername.setErrors({'custom': 'The username you entered is already in use. Please enter a different username.'});
        } else if (error.error.error_code != undefined && error.error.error_code == 3033) {
          this.registerForm.controls.newusername.setErrors({'custom': 'The username you entered is too short. Please enter a different username.'});
        } else if (error.error.error_code != undefined && error.error.error_code == 3034) {
          this.registerForm.controls.newusername.setErrors({'custom': 'The username you entered is too long. Please enter a different username.'});
        } else if (error.error.error_code != undefined && error.error.error_code == 3035) {
          this.registerForm.controls.mail.setErrors({'custom': 'This is not a valid email address; we can not send emails to this mail box. Please try to register using a different email address.'});
        } else {
          this.register_error = "Sorry, something went wrong. Please try again later or contact us if this error persists.";
        }
        this.register_loading = false;
        if (this.captchaRef != undefined) {
          this.captchaRef.reset();
        }
      },
    );
  }

  executeForgot() {
    console.log("Forgot");
    this.reset_submitted = true;
    if (this.resetForm.invalid) {
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
      return;
    }

    this.reset_loading = true;
    this.authService.forgot(this.resetf.resetmail.value, this.captcha!=''?this.captcha:'dev').subscribe(
      (response) => {
        console.log(response);
        this.reset_error = '';
        this.reset_success = true;
        this.reset_loading = false;
      },
      (error) => {
        this.captcha = '';
        this.reset_error = '';
        console.log(error);
        if (error.error.message != undefined && error.error.message.search('Invalid captcha') != -1) {
          this.reset_error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
        } else if (error.error.error_code != undefined && error.error.error_code == 3004) {
          this.resetForm.controls.resetmail.setErrors({'custom': 'Unknown email address. If you created an index before April 2021: please register for a new account using the form on the left. You can use the same email address again.'});
        } else {
          this.reset_error = 'Sorry, something went wrong. Please try again later or contact us if this error persists.';
        }
        this.reset_loading = false;
        if (this.captchaRef != undefined) {
          this.captchaRef.reset();
        }
      },
    );
  }

  loginComplete(access_token) {
    console.log("login complete")

    // Login callback
    if (!this.useCallback) {
      // No callback specified, try to use redirect url
      let redirect_url = this.globals.get_redirect_url();
      if (redirect_url) {
        console.log('Redirecting to: ', redirect_url);
        this.globals.set_redirect_url(null);
        this.router.navigate([redirect_url]);
      } else {
        // No redirect needed. direct to profile
        console.log('no redirect required.');
        this.router.navigate(['/profile']);
      }
    } else {
      // Execute callback event
      this.onEmbeddedCallback.emit([access_token]);
    }

    this.login_loading = false;
    this.register_loading = false;
  }

}
