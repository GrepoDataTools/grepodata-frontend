import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ContactDialog} from '../../../header/header.component';
import {MatDialog} from '@angular/material/dialog';
import {JwtService} from '../../../auth/services/jwt.service';
import {OpsHelpDialog} from '../help/help.component';
import {IndexerService} from '../../indexer.service';
import {WorldService} from '../../../services/world.service';
import {NewIndexDialog} from '../../../shared/dialogs/new-index/new-index.component';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss'],
  providers: [IndexerService, WorldService]
})
export class OperationsComponent implements OnInit, OnDestroy {

  teams = []
  loading_teams = true;
  error = '';
  timer_load_interval
  no_operations = false;
  no_teams = false;

  constructor(
    public dialog: MatDialog,
    private authService: JwtService,
    private indexerService: IndexerService
  ) {
    this.loading_teams = true;
    this.getActiveTeams();

    // Timer interval
    this.timer_load_interval = setInterval(_ => {this.getActiveTeams()}, 30000);
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    clearInterval(this.timer_load_interval);
  }

  public getActiveTeams() {
    this.authService.accessToken().then(access_token => {
      this.indexerService.getActiveTeams(access_token).subscribe(
        response => this.parseActiveTeams(response),
        error => this.parseActiveTeams(error)
        )
    });
  }

  parseActiveTeams(response) {
    if (response.status === 503) {
      // Killswitch active
      this.error = 'Service unavailable';
      if (response.error && 'message' in response.error) {
        this.error = response.error.message;
      }
    } else if ('success_code' in response && response.success_code == 1000) {
      this.error = '';
      this.teams = response.operations;
      if ('active' in response && response.active != true) {
        this.no_operations = true;
      } else {
        this.no_operations = false;
      }
    } else if ('error_code' in response) {
      switch (response.error_code) {
        case 7202:
          // user has no teams
          this.error = '';
          this.no_teams = true;
          break;
        case 8010:
          // no active ops
          this.error = '';
          this.no_operations = true;
          break;
        default:
          this.error = 'Unknown error. Please try again later or contact us if this issue persists.';
      }
    }
    this.loading_teams = false;
  }

  public newIndexDialog() {
    let dialogRef = this.dialog.open(NewIndexDialog, {
      autoFocus: false,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getActiveTeams();
    });
  }

  showHelpDialog() {
    this.dialog.open(OpsHelpDialog, {autoFocus: false});
  }

  showContactDialog() {
    this.dialog.open(ContactDialog, {autoFocus: false, data: {custom_title: 'Feedback', context: 'cmd_feedback'}});
  }
}
