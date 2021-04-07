import {Component, OnInit} from '@angular/core';
import {WorldService} from '../../services/world.service';
import {LocalCacheService} from '../../services/local-cache.service';
import {IndexerService} from '../indexer.service';
import {JwtService} from '../../auth/services/jwt.service';
import {Globals} from '../../globals';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ContactDialog} from '../../header/header.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  providers: [IndexerService, LocalCacheService, WorldService],
})
export class LandingPageComponent implements OnInit {
  stats: any = '';
  loading = true;

  constructor(
    private globals: Globals,
    private indexerService: IndexerService,
    public router: Router,
    public authService: JwtService,
    public dialog: MatDialog) {
    if (authService.refreshToken) {
      this.router.navigate(['/profile']);
    }
  }

  ngOnInit() {
    this.indexerService.getStats().subscribe(
      (response) => this.stats = response,
      (error) => this.stats = ''
    );
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }

  loginCallback() {
    this.router.navigate(['/profile']);
  }
}
