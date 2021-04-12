import {Component, OnInit, ViewChild} from '@angular/core';
import {LinkedAccount, ProfileService} from '../../../services/profile.service';
import {IndexerService} from '../../../../indexer/indexer.service';
import {CaptchaService} from '../../../../services/captcha.service';
import {WorldService} from '../../../../services/world.service';
import {RecaptchaComponent} from 'ng-recaptcha';
import {JwtService} from '../../../services/jwt.service';
import {Router} from '@angular/router';
import {MatStepper} from '@angular/material/stepper';
import {SearchService} from '../../../../search/search.service';
import {Globals} from '../../../../globals';
import {ContactDialog} from '../../../../header/header.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-linked-accounts',
  templateUrl: './linked-accounts.component.html',
  styleUrls: ['./linked-accounts.component.scss'],
  providers: [IndexerService, WorldService, CaptchaService, SearchService],
})
export class LinkedAccountsComponent implements OnInit {
  @ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;

  accounts: LinkedAccount[] = [];
  loading = true;
  confirmed = true;
  linked = false;
  form_opened = false;
  moreinfo = false;

  // search
  players;
  playerInput = '';
  searched = false;
  searching = false;
  typingTimer;
  debounceTime = 300;

  constructor(
    private globals: Globals,
    private authService: JwtService,
    private profileService: ProfileService,
    private router: Router,
    private searchService: SearchService,
    public dialog: MatDialog,
    ) { }

  ngOnInit() {
    this.loadLinkedAccounts();
  }

  loadLinkedAccounts() {
    this.authService.accessToken().then(access_token => {
      this.profileService.getLinkedAccounts(access_token).subscribe(
        (response) => {
          this.accounts = response.items;
          Object.keys(this.accounts).forEach(account => {
            if (this.accounts[account].confirmed) {
              this.linked = true;
            }
          });
          this.loading = false;
        },
        (error) => {
          console.log(error);
          if (error.status === 401) {
            console.log('Redirecting to login');
            this.authService.logout();
          } else if (error.error.error_code && error.error.error_code == 3010) {
            this.confirmed = false;
          }

          this.loading = false;
        },
      );
    });
  }

  unlink(account) {
    this.authService.accessToken().then(access_token => {
      if (!account.confirmed || window.confirm("Are you sure you want to unlink '"+account.player_name+"' from your account?\nYou will lose access to your intelligence for this account.")) {
        this.profileService.unlinkAccount(access_token, account.player_id, account.server).subscribe(
          (response) => {
            account.unlinked = true;
          },
          (error) => {
            account.error = 'Unable to unlink. Please try again later.'
          }
        );
      }
    });
  }

  copyLink(inputElement) {
    let token = inputElement.town_token;
    navigator.clipboard.writeText(token).then(() => {});
    inputElement.copied = true;
    window.setTimeout(()=>{inputElement.copied = false;}, 4000);
  }

  searchPlayers($event) {
    if (typeof $event != 'undefined') this.playerInput = $event.target.value;

    clearTimeout(this.typingTimer);
    let that = this;
    this.typingTimer = setTimeout(function () {
      that.doSearchPlayers();
    }, this.debounceTime);
  }

  doSearchPlayers() {
    this.players = [];
    clearTimeout(this.typingTimer);
    if (this.playerInput.length > 1) {
      this.searching = true;

      let preferred_server = this.globals.get_active_server();
      if (preferred_server===null || preferred_server===false) {
        preferred_server = '';
      }
      this.searchService.searchPlayers(this.playerInput, 0, 100, '', '', false, null, null, false, preferred_server)
        .subscribe(
          (response) => this.renderPlayerOutput(response),
          (error) => this.renderPlayerOutput(null)
        );

    } else {
      this.searching = false;
    }
  }

  selectPlayer(player_id, player_name, server) {
    let account = {} as LinkedAccount;
    account.user_id = '0';
    account.player_id = player_id;
    account.player_name = player_name;
    account.server = server;
    account.confirmed = false;
    account.town_token = '';
    this.accounts.unshift(account);
    this.players = [];
    this.searched = false;
    this.form_opened = false;

    this.authService.accessToken().then(access_token => {
      this.profileService.addLinkedAccounts(access_token, account.player_id, account.player_name, account.server).subscribe(
        (response) => {
          if (response.success == true && response.linked_account) {
            account.town_token = response.linked_account.town_token;
          } else {
            account.town_token = 'error';
            this.loadLinkedAccounts();
          }
        },
        (error) => {
          account.town_token = 'error';
          this.loadLinkedAccounts();
        }
      );
    });
  }

  renderPlayerOutput(players) {
    console.log(players);
    if (players != null) {
      this.players = players.results.filter(
        (item, i, arr) => arr.findIndex(t => t.server === item.server && t.name === item.name) === i
      );
      this.players = this.players.filter(search_result => this.accounts.filter(e => e.player_name == search_result.name).length <= 0);
      console.log(this.players);
    }
    this.searched = true;
    this.searching = false;
  }

  public showContactDialog(): void {
    let dialogRef = this.dialog.open(ContactDialog, {
      // width: '600px',
      // height: '90%'
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

}
