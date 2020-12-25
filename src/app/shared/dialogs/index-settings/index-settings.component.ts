import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BasicDialog} from '../basic/basic.component';
import {IndexService} from '../../../auth/services/index.service';
import {JwtService} from '../../../auth/services/jwt.service';
import {environment} from '../../../../environments/environment';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-index-settings',
  templateUrl: './index-settings.component.html',
  styleUrls: ['./index-settings.component.scss'],
  providers: [IndexService]
})
export class IndexSettingsDialog {

  index: any = {
    name: 'loading'
  };

  loading_users = true;
  updating_roles = false;
  unsaved_changes = false;

  my_id: number = 0;
  my_role: string = '';
  users: any = [];
  user_error: string = '';

  readonly ROLE_ADMIN = environment.ROLE_ADMIN;
  readonly ROLE_OWNER = environment.ROLE_OWNER;
  readonly ROLE_READ = environment.ROLE_READ;
  readonly ROLE_WRITE = environment.ROLE_WRITE;

  constructor(
    public dialogRef: MatDialogRef<BasicDialog>,
    private authService: JwtService,
    private indexService: IndexService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;

    console.log(data.index);
    this.index = data.index;

    this.loadUsers();
  }

  close(): void {
    this.dialogRef.close();
  }

  loadOwners() {

  }

  loadUsers() {
    this.authService.accessToken().then(access_token => {
      let payload = jwt_decode(access_token);
      if (payload && 'uid' in payload) {
        this.my_id = payload.uid;
      }
      this.indexService.getIndexUsers(access_token, this.index.key)
        .subscribe(
          (response) => this.renderUserOutput(response),
          (error) => this.renderUserOutput(null)
        );
    });
  }

  loadSettings() {

  }

  renderUserOutput(response) {
    if (!response || !response.success_code || response.success_code != 1000) {
      this.users = [];
    } else {
      this.users = response.data;
      let me = this.users.filter((obj) => obj.user_id === this.my_id)[0];
      if ('role' in me) {
        this.my_role = me.role;
      }
    }
    this.loading_users = false;
  }

  toggleUserRole(user, selected_role) {
    this.updating_roles = true;
    this.authService.accessToken().then(access_token => {
      this.indexService.setIndexUserRole(access_token, this.index.key, user.user_id, selected_role)
        .subscribe(
          (response) => {
            console.log(response);
            this.updating_roles = false;
            this.user_error = '';
            if (response) {
              if (response.error_code && response.error_code === 7520) {
                this.user_error = response.message;
              } else if (response.error_code && response.error_code === 7540) {
                this.user_error = response.message;
              } else if (response.success_code && response.success_code === 1000) {
                let updated_user = response.data;
                console.log(updated_user);
                this.users = this.users.map(user => {
                  console.log(user);
                  return user.user_id === updated_user.user_id ? updated_user : user
                })
              } else {
                this.user_error = 'Unknown error. Please try again later or contact us if this error persists.';
              }
            } else {
              this.user_error = 'Unknown error. Please try again later or contact us if this error persists.';
            }
          },
          (error) => {
            console.log(error);
            this.updating_roles = false;
            this.user_error = 'Unknown error. Please try again later or contact us if this error persists.';
          }
        );
    });
  }
}