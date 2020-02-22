import {Component, OnInit, ViewChild} from '@angular/core';
import {IndexerService} from '../../shared/services/indexer.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {Globals} from '../../globals';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../shared/services/auth.service';
import {NewIndexDialog} from '../../shared/dialogs/new-index-dialog/new-index.component';

@Component({
  selector: 'indexer-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  providers: [IndexerService, AuthService]
})
export class AboutComponent implements OnInit {
  @ViewChild('trigger', {static: false}) trigger: MatAutocompleteTrigger;

  stats: any = '';
  error = '';
  key_input: any = '';
  loggedIn = false;
  openingIndex = false;
  all_indexes: any = {};
  objectKeys = Object.keys;

  constructor(
    private indexerService: IndexerService,
    private authService: AuthService,
    private route: ActivatedRoute,
    public router: Router,
    private globals: Globals,
    public dialog: MatDialog
  ) {
    this.loggedIn = this.authService.loggedIn;
    this.route.params.subscribe( params => this.load(params));
  }

  ngOnInit(): void {
  }

  private load(params) {
    if (this.globals.get_active_index() !== false) {
      this.key_input = this.globals.get_active_index();
    }

    this.indexerService.getStats().subscribe(
      (response) => this.stats = response,
      (error) => this.stats = ''
    );

    if (this.globals.get_active_intel() !== false) {
      this.all_indexes = this.globals.get_active_intel();
      if (this.objectKeys(this.all_indexes).length < 2) {
        this.all_indexes = {};
      }
    }
  }

  openAutocompleteIndex() {
    if (this.trigger.panelOpen) {
      setTimeout(_ => this.trigger.closePanel());
    } else {
      setTimeout(_ => this.trigger.openPanel());
    }
  }

  openIndex() {
    this.openingIndex = true;
    this.indexerService.isValid(this.key_input).subscribe(
      (response) => {
        this.router.navigate(['/indexer/'+this.key_input])
        // console.log("Valid!");
      },
      (error) => {
        this.error = 'Invalid index key!';
        this.openingIndex = false;
      });
  }

  newIndex() {
    // if (this.authService.loggedIn) {
    //
    // }
    let dialogRef = this.dialog.open(NewIndexDialog, {
      // width: '80%',
      // height: '90%'
      autoFocus: false,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  showForgotDialog() {
    // let dialogRef = this.dialog.open(ForgotKeysDialog, {
    //   // width: '600px',
    //   // height: '90%'
    //   autoFocus: false
    // });
    //
    // dialogRef.afterClosed().subscribe(result => {});
  }

}
