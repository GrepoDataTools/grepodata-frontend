import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { RecaptchaComponent } from 'ng-recaptcha';
import { JwtService } from '../services/jwt.service';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {Globals} from '../../globals';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BasicDialog} from '../../shared/dialogs/basic/basic.component';

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
  active_tab = '';

  constructor(
    private formBuilder: FormBuilder,
    private globals: Globals,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authService: JwtService,
    private dialogRef: MatDialog,
    protected activatedRoute: ActivatedRoute
  ) {

    this.route.params.subscribe((params) => {
      if ('uid' in params) {
        this.globals.set_active_script_token(params.uid);
      }
    });

    this.authService.accessToken().then(access_token => {
      this.doLogin(access_token);
    });
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

  public doLogin(access_token) {
    // Check script token
    let script_token = this.globals.get_active_script_token();
    if (script_token != false) {
      this.authService.enableScriptLink(access_token, script_token).subscribe((response) => {
          console.log(response);
          if (response.success_code && response.success_code === 1151) {
            // Script auth complete
            this.newBasicDialog(
              'Userscript login complete!',
              '<p>Your userscript has been linked to this GrepoData account. You can now start using the script to collect in-game intel. Happy indexing!</p>'
            );
          } else {
            // script auth failed
            this.snackBar.open('Sorry, we were unable to link your account to the userscript. Please request a new token using the in-game script.', 'Dismiss', {panelClass: 'script-auth-link-error'});
          }
          this.globals.delete_active_script_token();
        },
        (error) => {
          console.log(error);
          if (error.error.error_code && error.error.error_code === 3041) {
            // unknown script token
            this.newBasicDialog(
              'Userscript verification failed',
              '<p>Sorry, your userscript token is <strong>invalid</strong>. Please request a new token using the in-game script.</p>'
            );
          } else if (error.error.error_code && error.error.error_code === 3042) {
            // expired script token
            this.newBasicDialog(
              'Userscript verification failed',
              '<p>Sorry, your userscript token has <strong>expired</strong>. Please request a new token using the in-game script.</p>'
            );
          } else {
            // script auth failed ?
            this.newBasicDialog(
              'Userscript verification failed',
              '<p>Sorry, we were unable to link your account to the userscript. Please request a new token using the in-game script or try again later.</p>'
            );
          }
          this.globals.delete_active_script_token();
        });
    }

    // Continue
    this.loading = false;
    this.router.navigate(['/profile']);
  }

  newBasicDialog(title, content) {
    const dialogRef = this.dialogRef.open(BasicDialog, {
      autoFocus: false,
      data: {
        title: title,
        messageHtml: content
      }
    });
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
          this.error = '';
          this.success = true;
          if (!this.embedded) {
            this.doLogin(response.access_token);
          } else {
            this.loading = false;
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
