import {Component, OnInit, ViewChild} from '@angular/core';
import {JwtService} from "../services/jwt.service";
import {Router} from "@angular/router";
import {IndexList, ProfileService} from "../services/profile.service";
import {EditOwnersDialog} from "../../indexer/indexer.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
	providers: [ProfileService]
})
export class ProfileComponent implements OnInit {
	indexes: IndexList[] = [];

  constructor(
  	private authService: JwtService,
		private profileService: ProfileService,
		private router: Router,
		public dialog: MatDialog) {
  	this.authService.verifyToken().subscribe(
			(response) => {this.load();},
			(error) => {this.logout();}
			);
	}

  ngOnInit() {
  }

  logout() {
  	this.authService.logout();
		this.router.navigate(['/login'])
	}

	load() {
  	this.loadIndexes();
	}

  loadIndexes() {
		// this.profileService.getIndexes().subscribe(
		// 	(response) => {
		// 		this.indexes = response;
		// 		// console.log(response);
		// 	},
		// 	(error) => {
		// 		console.log(error);
		// 	},
		// );
	}

	editOwners(key, world, owners) {
			let dialogRef = this.dialog.open(EditOwnersDialog, {
				// width: '600px',
				// height: '80%',
				autoFocus: false,
				data: {
					key: key,
					world: world,
					owners: owners
				}
			});

		dialogRef.afterClosed().subscribe(result => {});
	}

}

