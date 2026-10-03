import { Component, OnInit } from '@angular/core';
import {JwtService} from '../auth/services/jwt.service';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ContactDialog} from '../header/header.component';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html'
})
export class FaqComponent implements OnInit {

  logged_in : boolean = false;
  routed : boolean = false;

  constructor(
    private authService: JwtService,
    private route: ActivatedRoute,
    public dialog: MatDialog
	) {
    if (authService.refreshToken) {
      this.logged_in = true;
    }
    this.routed = route.component === FaqComponent;
  }

  showContactDialog() {
    let dialogRef = this.dialog.open(ContactDialog, {
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  ngOnInit() {
  }

}
