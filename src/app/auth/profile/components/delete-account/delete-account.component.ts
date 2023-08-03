import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {JwtService} from '../../../services/jwt.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss']
})
export class DeleteAccountComponent implements OnInit {

  confirmed = false;
  passwordForm: UntypedFormGroup;

  error = '';
  success = false;
  deleted = false;
  loading = false;
  submitted = false;
  confirmNeeded = false;

  constructor(
    private authService: JwtService,
    private formBuilder: UntypedFormBuilder
  ) { }

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      password: ['', Validators.required],
    });
  }

  get f() { return this.passwordForm.controls; }

  signOut() {
    this.authService.logout();
  }

  deleteAccount() {
    this.submitted = true;

    if (!this.confirmed) {
      this.confirmNeeded = true;
      return;
    } else {
      this.confirmNeeded = false;
    }

    if (this.passwordForm.invalid) {
      return;
    }

    if (this.f.password.value.length < 4) {
      this.error = 'Please enter your full password.';
      this.passwordForm.controls.password.setErrors({'incorrect': true});
      this.passwordForm.controls.password2.setErrors({'incorrect': true});
      return;
    }

    this.loading = true;
    this.authService.accessToken().then(access_token => {
      this.authService.deleteAccount(access_token, this.f.password.value).subscribe(
        (response) => {
          console.log(response);
          this.error = '';
          this.loading = false;
          this.success = true;

          if ('status' in response && response.status === 'Account deleted') {
            // Account has not been confirmed, so account was deleted already.
            this.deleted = true;
            this.authService.logout(false);
          } else {
            this.deleted = false;
          }
        },
        (error) => {
          console.log(error);
          this.error = "Unable to complete your request. Please try again later or contact us if this error persists.";
          if ('error_code' in error.error && error.error.error_code == 3005) {
            this.error = "Invalid current password. Please enter your current active password.";
            this.passwordForm.controls.password.setErrors({'incorrect': true});
          }
          this.loading = false;
        },
      );
    });

  }
}
