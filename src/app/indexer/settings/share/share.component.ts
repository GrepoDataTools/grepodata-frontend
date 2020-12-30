import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {IndexerService} from '../../indexer.service';
import {JwtService} from '../../../auth/services/jwt.service';
import {SearchService} from '../../../search/search.service';
import {IndexAuthService} from '../../../auth/services/index.service';
import {IndexMembersDialog} from '../../../shared/dialogs/index-members/index-members.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-share',
  animations: [
    trigger('rotate', [
      state('open', style({
        transform: 'rotate(360deg)'
      })),
      state('closed', style({
        transform: 'rotate(0deg)'
      })),
      // transition('open => closed', [
      //   animate('1s')
      // ]),
      transition('closed => open', [
        animate('.7s ease-in-out')
      ]),
    ]),
  ],
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
  providers: [IndexerService, SearchService, IndexAuthService]
})
export class ShareComponent implements OnInit {

  @ViewChild('username_input', {static: false}) username_input:ElementRef;

  @Input() indexInput: any;

  copied = false;
  loadingLink = false;
  animate_refresh = false;
  share_link = '';
  index: any = {
    name: 'loading'
  };

  // search
  users = [];
  userInput = '';
  updating_users = false;
  searched = false;
  searching = false;
  too_short = false;
  typingTimer;
  debounceTime = 300;

  // Adding user
  adding_error = '';
  adding_success = '';
  adding_user = false;
  already_member = '';
  added_users = [];

  constructor(
    private authService: JwtService,
    private searchService: SearchService,
    private indexerService: IndexerService,
    private indexAuthService: IndexAuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    console.log(this.indexInput);
    this.index = this.indexInput;
    this.share_link = 'https://grepodata.com/share/' + this.index.key + '/' + this.index.share_link

    setTimeout(() => this.username_input.nativeElement.focus());
  }

  copyLink() {
    navigator.clipboard.writeText(this.share_link).then(() => {});
    this.copied = true;
    window.setTimeout(()=>{this.copied = false;}, 6000);
  }

  getNewLink() {
    this.loadingLink = true;
    this.copied = false;
    this.animate_refresh = true;
    let that = this;
    setTimeout(function() {
      that.animate_refresh = false;
    }, 1000);
    this.authService.accessToken().then(access_token => {
      this.indexerService.createNewLink(access_token, this.index.key)
        .subscribe(
          (response) => {
            this.loadingLink = false;
            console.log(response);
            if ('success_code' in response && response.success_code === 1200) {
              this.share_link = 'https://grepodata.com/share/' + this.index.key + '/' + response.share_link;
            }
          },
          (error) => {
            this.loadingLink = false;
          }
        );
    });
  }

  searchUsers($event) {
    if (typeof $event != 'undefined') this.userInput = $event.target.value;

    clearTimeout(this.typingTimer);
    let that = this;
    this.typingTimer = setTimeout(function () {
      that.doSearchUsers();
    }, this.debounceTime);
  }

  doSearchUsers() {
    this.users = [];
    clearTimeout(this.typingTimer);
    if (this.userInput.length >= 4) {
      this.too_short = false;
      this.searching = true;
      this.authService.accessToken().then(access_token => {
        this.searchService.searchUsers(access_token, this.userInput)
          .subscribe(
            (response) => this.renderUserOutput(response),
            (error) => this.renderUserOutput(null)
          );
      });
    } else {
      this.searching = false;
      this.too_short = true;
    }
  }

  selectUser(user) {
    this.adding_error = '';
    this.adding_success = '';
    this.adding_user = true;
    this.already_member = '';
    // added_users = [];
    console.log(user);
    this.authService.accessToken().then(access_token => {
      this.indexAuthService.addIndexUser(access_token, this.index.key, user.uid)
        .subscribe(
          (response) => {
            if (response && 'success_code' in response) {
              this.adding_success = "User <span class='gd-primary'><strong>"+user.username+"</strong></span> has been added to your index.";
              let added_user = response.data;
              this.added_users.push(added_user);
              this.users = [];
              this.searching = false;
              this.searched = false;
              this.too_short = false;
            } else if ('error_code' in response && response.error_code === 7570) {
              this.already_member = user.username;
              this.users = [];
              this.searching = false;
              this.searched = false;
              this.too_short = false;
            } else {
              this.adding_error = 'Unable to add user to this index. Please try again later or contact us if this error persists.';
            }
            this.adding_user = false;
          },
          (error) => {
            this.adding_error = 'Unable to add user to this index. Please try again later or contact us if this error persists.';
            this.adding_user = false;
          }
        );
    });
  }

  renderUserOutput(users) {
    if (users && 'data' in users) {
      this.users = users.data;
    }
    this.searched = true;
    this.searching = false;
  }

  openMembersDialog() {
    let dialogRef = this.dialog.open(IndexMembersDialog, {
      minWidth: '60%',
      // height: '90%'
      autoFocus: false,
      disableClose: false,
      data: {
        index: this.index
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.load({key: this.key});
    });
  }
}
