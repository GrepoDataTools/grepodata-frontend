import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {IndexService} from '../../../auth/services/index.service';
import {environment} from '../../../../environments/environment';
import {BasicDialog} from '../basic/basic.component';
import {JwtService} from '../../../auth/services/jwt.service';
import * as jwt_decode from 'jwt-decode';
import {ContactDialog} from '../../../header/header.component';
import {ShareIndexDialog} from '../share-index/share-index.component';

@Component({
  selector: 'app-index-members',
  templateUrl: './index-members.component.html',
  styleUrls: ['./index-members.component.scss'],
  providers: [IndexService]
})
export class IndexMembersDialog {

  index: any = {
    name: 'loading'
  };

  loading_users = true;
  updating_roles = false;
  user_removed = '';

  my_id: number = 0;
  my_role: string = '';
  users: any = [];
  user_error: string = '';

  readonly ROLE_ADMIN = environment.ROLE_ADMIN;
  readonly ROLE_OWNER = environment.ROLE_OWNER;
  readonly ROLE_READ = environment.ROLE_READ;
  readonly ROLE_WRITE = environment.ROLE_WRITE;

  constructor(
    public dialogRef: MatDialogRef<IndexMembersDialog>,
    private dialog: MatDialog,
    private authService: JwtService,
    private indexService: IndexService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    console.log(data.index);
    this.index = data.index;

    this.loadUsers();
  }

  close(): void {
    this.dialogRef.close();
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
    this.user_removed = '';
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
              } else if (response.error_code && response.error_code === 7501) {
                this.user_error = 'You have to be an owner of this index to make that change.';
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

  public showConfirmDialog(user): void {
    const dialogRef = this.dialog.open(BasicDialog, {
      // minWidth: '40%',
      autoFocus: false,
      data: {
        title: '',
        show_close: false,
        messageHtml: '<div class="text-center"><h3>User <span class="gd-primary">' + user.username + '</span> will be removed from index <span class="gd-primary">' + this.index.name + '</span></h3></div>',
        cancel_action: 'Cancel',
        action_type: 'danger',
        action: 'Remove user',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

      if (result === true) {
        this.updating_roles = true;
        this.user_removed = '';
        this.authService.accessToken().then(access_token => {
          this.indexService.removeIndexUser(access_token, this.index.key, user.user_id)
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
                  } else if (response.error_code && response.error_code === 7501) {
                    this.user_error = 'You have to be an owner of this index to make that change.';
                  } else if (response.success_code && response.success_code === 1300) {
                    this.users = this.users.filter((indexuser) => indexuser.user_id !== user.user_id);
                    this.user_removed = user.username;
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

    });
  }

  removeUser(user) {
    this.showConfirmDialog(user);
  }

  showShareDialog() {
    let dialogRef = this.dialog.open(ShareIndexDialog, {
      minWidth: '60%',
      // height: '90%'
      autoFocus: false,
      disableClose: false,
      data: {
        index: this.index
      }
    });

    this.close();
  }
}