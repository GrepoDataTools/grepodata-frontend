import { Component, OnInit } from '@angular/core';
import {JwtService} from '../auth/services/jwt.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  logged_in : boolean = false;

  constructor(
    private authService: JwtService
	) {
    if (authService.refreshToken) {
      this.logged_in = true;
    }
  }

  ngOnInit() {
  }

}
