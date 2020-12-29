import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {IndexerService} from '../../indexer.service';
import {JwtService} from '../../../auth/services/jwt.service';
import {SearchService} from '../../../search/search.service';

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
  providers: [IndexerService, SearchService]
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
  typingTimer;
  debounceTime = 300;

  constructor(
    private authService: JwtService,
    private searchService: SearchService,
    private indexService: IndexerService
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
      this.indexService.createNewLink(access_token, this.index.key)
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
    if (this.userInput.length > 1) {
      this.searching = true;
      this.authService.accessToken().then(access_token => {
        this.searchService.searchUsers(access_token, this.userInput, 0, 10, this.index.world)
          .subscribe(
            (response) => this.renderUserOutput(response),
            (error) => this.renderUserOutput(null)
          );
      });
    } else {
      this.searching = false;
    }
  }

  selectUser(user) {
    console.log(user);
  }

  renderUserOutput(users) {
    if (users && 'results' in users) {
      this.users = users.results;
    }
    this.searched = true;
    this.searching = false;
  }

}
