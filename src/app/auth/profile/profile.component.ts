import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {Router} from "@angular/router";
import {IndexList, ProfileService} from "../../shared/services/profile.service";
import { MatDialog } from "@angular/material/dialog";
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
	providers: [ProfileService, AuthService]
})
export class ProfileComponent implements OnInit {
	indexes: IndexList[] = [];
	loading = true;
	confirmed = true;

  constructor(
  	private authService: AuthService,
		private profileService: ProfileService,
		private router: Router,
		public dialog: MatDialog) {
	}

  ngOnInit() {
    this.authService.verifyToken().subscribe(
      (response) => this.load(),
      (error: HttpErrorResponse) => {
        if (error.status === 403) {
          console.log('Email unconfirmed');
          this.confirmed = false;
          this.loading = false;
        } else if (error.status === 401) {
          this.logout();
        } else {
          console.log(error.error);
        }
      },
    );
  }

  logout() {
  	this.authService.logout();
		this.router.navigate(['/auth/login'])
	}

	load() {
  	this.loadIndexes();
	}

	newIndex() {

  }

  changePassword() {
    //TODO
  }

  loadIndexes() {
		this.profileService.getIndexes().subscribe(
			(response) => {
				this.indexes = response;
			  this.loading = false;
      },
			(error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log('Redirecting to login');
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        } else {
          console.error(error.error);
        }
			},
		);
	}

	editOwners(key, world, owners) {
			// let dialogRef = this.dialog.open(EditOwnersDialog, {
			// 	// width: '600px',
			// 	// height: '80%',
			// 	autoFocus: false,
			// 	data: {
			// 		key: key,
			// 		world: world,
			// 		owners: owners
			// 	}
			// });
			// dialogRef.afterClosed().subscribe(result => {});
	}

}

