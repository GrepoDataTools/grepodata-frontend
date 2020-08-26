import {Component, OnInit, ViewChild} from '@angular/core';
import {JwtService} from "../services/jwt.service";
import {ActivatedRoute, Router} from '@angular/router';
import {IndexList, ProfileService} from "../services/profile.service";
import {EditOwnersDialog} from "../../indexer/indexer.component";
import { MatDialog } from "@angular/material/dialog";
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
	providers: [ProfileService]
})
export class ProfileComponent implements OnInit {
	account_confirmed = true;
	collapsed = false;
	active_tab = 'intel';

	active_index = '';
	active_world = '';
	active_id = '';

  constructor(
  	private authService: JwtService,
		private profileService: ProfileService,
		private router: Router,
    private route: ActivatedRoute,
		public dialog: MatDialog,
    private location: Location
  ) {
    this.route.params.subscribe( params => this.load(params));
	}

  ngOnInit() {
  }

  logout() {
  	this.authService.logout();
		this.router.navigate(['/login'])
	}

	load(response) {
    if (response.hasOwnProperty('activetab')) {
      this.active_tab = response.activetab;
    }
    if (response.hasOwnProperty('key')) {
      this.active_index = response.key;
    }
    if (response.hasOwnProperty('world')) {
      this.active_world = response.world;
    }
    if (response.hasOwnProperty('id')) {
      this.active_id = response.id;
    }

    this.authService.verifyToken().subscribe(
      (response) => {this.loadProfile(response);},
      (error) => {this.logout();}
    );
	}

	loadProfile(response) {
    if (response.hasOwnProperty('is_confirmed') && response.is_confirmed === false) {
      this.account_confirmed = false;
    }
  }

  changeTab(tab) {
    this.active_tab = tab;
    this.location.replaceState('/profile/'+tab);
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

