import { Component, OnInit } from '@angular/core';
import {IndexerService} from "../indexer.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LocalCacheService} from "../../services/local-cache.service";

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
  providers: [IndexerService, LocalCacheService]
})
export class ActionComponent implements OnInit {

  token = '';
  error = '';
  moved_to_index = '';
  key = '';
  alliance_name = '';
  loading = true;
  moved = false;
  redirect = false;
  action = '';

  constructor(
  	private indexerService: IndexerService,
		public router: Router,
		private route: ActivatedRoute) {
    this.route.params.subscribe( params => this.load(params));
  }

  ngOnInit() {
  }

  private load(params) {
  	// this.loading = false;
  	// this.moved = false;
  	// this.action = 'reset_index_owner';
    if (typeof params['token'] != 'undefined' && params['token'].length == 32) {
      this.token = params['token'];
      this.indexerService.confirmAction(params['token']).subscribe(
        (response) => this.actionResult(response),
        (error) => this.actionResult(null)
      );
    } else {
      this.error = 'Invalid action token!';
      this.loading = false;
    }
  }

  private redirectTo(url) {
		this.router.navigate([url]);
	}

  public actionResult(data) {
    if (data === null) {
      this.error = 'Invalid action token!';
    } else {
      if (data.action === "moved") {
        this.error = '';
        this.action = data.action;
        this.moved = true;
        this.moved_to_index = data.new_key;
      } else if (data.action === "exclude_index_owner" || data.action === "include_index_owner") {
        this.error = '';
        this.action = data.action;
        this.key = data.key;
        this.alliance_name = data.data.alliance_name;
      } else if (data.action === "reset_index_owner") {
        this.error = '';
        this.action = data.action;
        this.key = data.key;
      } else if (data.action === "cleanup_session_activated") {
        this.error = '';
        this.action = data.action;
        this.key = data.key;
        this.redirect = true;
				LocalCacheService.set('csa'+this.key, this.token, (31 * 24 * 60));
        this.redirectTo('/indexer/'+this.key);
      } else {
        this.error = 'Oops, something went wrong. Please try again later or contact us if this error persists.';
      }
    }
    this.loading = false;
  }
}
