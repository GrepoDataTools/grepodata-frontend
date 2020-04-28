import {Component, Inject, OnInit, Pipe, PipeTransform, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {IndexerService} from "./indexer.service";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatStepper } from "@angular/material/stepper";
import {ContactDialog} from "../header/header.component";
import {CaptchaService} from "../services/captcha.service";
import {Md5} from 'ts-md5/dist/md5';
import {GoogleAnalyticsEventsService} from "../services/google-analytics-events.service";
import {SearchService} from "../search/search.service";
import {Globals} from '../globals';
import {environment} from "../../environments/environment";
import { trigger, style, transition, animate, group }
  from '@angular/animations';
import {RecaptchaComponent} from 'ng-recaptcha';
import {WorldService} from "../services/world.service";
import {LocalCacheService} from "../services/local-cache.service";
import {JwtService} from "../auth/services/jwt.service";

@Component({
  selector: 'app-indexer',
  templateUrl: './indexer.component.html',
  styleUrls: ['./indexer.component.scss'],
  providers: [IndexerService, LocalCacheService],
})
export class IndexerComponent implements OnInit {

  @ViewChild('trigger', {static: false}) trigger: MatAutocompleteTrigger;

  world = '';
  key = '';
  encrypted: any;
  data: any = '';
  stats: any = '';
  error = '';
  key_input: any = '';
  moved = false;
  loading = true;
  clicked = false;
  toggleMore = false;
  openingIndex = true;
  max_retries = 100;
  all_indexes: any = {};
  latest_intel: any = [];
  recent_conquests: any = [];
  objectKeys = Object.keys;

  private csa:any = false;

  constructor(
    private globals: Globals,
    private indexerService: IndexerService,
    public router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog) {
    this.route.params.subscribe( params => this.load(params));
  }

  ngOnInit() {
  }

  openAutocompleteIndex() {
    if (this.trigger.panelOpen) {
      setTimeout(_ => this.trigger.closePanel());
    } else {
      setTimeout(_ => this.trigger.openPanel());
    }
  }

  private load(params) {
    // Reset
    this.world = '';
    this.key = '';
    this.error = '';
    this.moved = false;
    this.latest_intel = [];
    this.recent_conquests = [];
    // this.data = '';

    // Save params
    if (typeof params['key'] != 'undefined' && params['key'].length == 8) {
      this.encrypted = Md5.hashAsciiStr(params['key']);
      this.indexerService.getIndex(params['key']).subscribe(
        (response) => this.loadIndex(response, params['key']),
        (error) => {
          this.globals.set_active_index('');
          this.router.navigate(['/indexer/0']);
        });
    } else if (typeof params['key'] != 'undefined' && params['key'].length == 1 && params['key'] == 0) {
      if (this.globals.get_active_index() !== false) {
        this.key_input = this.globals.get_active_index();
      }
      if (this.globals.get_active_intel() !== false) {
        this.all_indexes = this.globals.get_active_intel();
        if (this.objectKeys(this.all_indexes).length < 2) {
          this.all_indexes = {};
        }
      }
      this.openingIndex = false;
      this.loadStats();
    } else if (this.globals.get_active_index() !== false) {
      this.router.navigate(['/indexer/'+this.globals.get_active_index()])
    } else {
      this.openingIndex = false;
      this.loadStats();
    }
  }

  public loadStats(): void {
    this.loading = false;
    this.indexerService.getStats().subscribe(
      (response) => this.stats = response,
      (error) => this.stats = ''

    );
  }

  cleanupLogout() {
    LocalCacheService.set('csa'+this.key, false, 0);
    this.csa = false;
    this.router.navigate(['/indexer/'+this.key]);
  }

  public refresh(): void {
    window.location.reload();
  }

  public showForgotDialog(): void {
    let dialogRef = this.dialog.open(ForgotKeysDialog, {
      // width: '600px',
      // height: '90%'
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  public showContactDialog(): void {
    let dialogRef = this.dialog.open(ContactDialog, {
      // width: '600px',
      // height: '90%'
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  public newIndex() {
    let dialogRef = this.dialog.open(NewIndexDialog, {
      // width: '80%',
      // height: '90%'
      autoFocus: false,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  private openIndex() {
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

  private loadIndex(data, key) {
    if (data.moved == true) {
      this.moved = true;
      this.key = key;
    } else {
      this.globals.set_active_index(key);
      this.globals.set_active_intel(data.world, key);
      this.key = key;
      this.csa = LocalCacheService.get('csa'+this.key);
      this.world = data.world;
      this.data = data;
      if (data.latest_intel) {
        this.latest_intel = data.latest_intel;
      }
      if (data.recent_conquests) {
        this.recent_conquests = data.recent_conquests;
      }
      // if (data.total_reports != undefined && data.total_reports <= 0 && this.max_retries > 0) {
      //   setTimeout(()=>{
      //     this.max_retries -= 1;
      //     this.indexerService.getIndex(key).subscribe(
      //       (response) => this.loadIndex(response, key));
      //   }, 5000);
      // }
    }
    this.openingIndex = false;
    this.loading = false;
  }

  public loadConquestDetails(conquest): void {
    let dialogRef = this.dialog.open(ConquestReportDialog, {
      autoFocus: false,
      data: {
        key: this.key,
        world: this.world,
        conquest: conquest,
        get_by_id: false,
      }
    });
  }

  public loadSiegeListDialog(): void {
    let dialogRef = this.dialog.open(SiegeListDialog, {
      autoFocus: false,
      data: {
        key: this.key,
        world: this.world
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  public showChangekeyDialog(): void {
    let dialogRef = this.dialog.open(ChangekeyDialog, {
      // width: '600px',
      autoFocus: false,
      data: {
        key: this.key
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  public showEditOwnersDialog(): void {
    let dialogRef = this.dialog.open(EditOwnersDialog, {
      // width: '600px',
      // height: '80%',
      autoFocus: false,
      data: {
        key: this.key,
        world: this.world,
        owners: this.data['owners']
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  public showCleanupDialog(): void {
    let dialogRef = this.dialog.open(CleanIntelDialog, {
      // width: '600px',
      autoFocus: false,
      data: {
        key: this.key
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  public indexDisclaimer() {
    let dialogRef = this.dialog.open(IndexDisclaimerDialog, {
      width: '90%',
      height: '80%',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  public openInstalldialog() {
    let dialogRef = this.dialog.open(InstallDialog, {
      // width: '90%',
      // height: 'auto',
      autoFocus: false,
      data: {
        key: this.key
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  public openBBdialog(type) {
    let dataBB = {
      data: {},
      key: this.key,
      world: this.world
    };
    if (type == 'players_indexed') {
      dataBB.data = this.data['players_indexed']
    } else if (type == 'alliances_indexed') {
      dataBB.data = this.data['alliances_indexed']
    } else {
      return false;
    }

    let dialogRef = this.dialog.open(BBDialog, {
      // width: '90%',
      // height: '80%',
      autoFocus: false,
      data: {
        dataBB: dataBB,
        type: type
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

}

@Component({
  selector: 'action-changekey',
  templateUrl: 'action-changekey.html',
  providers: [IndexerService, CaptchaService, RecaptchaComponent]
})
export class ChangekeyDialog {
  @ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;

  contact_mail = '';
  key = '';
  submitted = false;
  captcha = '';
  error = '';
  loading = false;
  recaptcha_key = environment.recaptcha;

  login_required = false;
  login_callback() {
    // this.login_required = !this.authService.loggedIn
  }

  constructor(
    public captchaService : CaptchaService,
    public dialogRef: MatDialogRef<ChangekeyDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private indexerService : IndexerService,
    private authService: JwtService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
    // this.login_required = !this.authService.loggedIn;

    this.key = data.key;

    try {
      this.googleAnalyticsEventsService.emitEvent("indexer", "changeKeyDialog", "changeKeyDialog", 1);
    } catch (e) {}
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
    this.sendRequest();
  }

  public sendRequest() {
    if (this.contact_mail == '') {
      this.error = 'Email address is required';
      if (this.captchaRef != undefined) { if (this.captchaRef != undefined) { this.captchaRef.reset(); } }
    } else if (this.captcha == '' || this.captcha == null) {
      this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
      if (this.captchaRef != undefined) { if (this.captchaRef != undefined) { this.captchaRef.reset(); } }
    } else {
      let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
      let valid_mail = re.test(this.contact_mail);
      if (!valid_mail) {
        this.error = 'Invalid email address (format: name@example.com)';
        if (this.captchaRef != undefined) { this.captchaRef.reset(); }
      } else {
        try {
          this.googleAnalyticsEventsService.emitEvent("indexer", "changeKeySendRequest", "changeKeySendRequest", 1);
        } catch (e) {
        }

        this.loading = true;
        this.indexerService.updateIndexKey(this.key, this.contact_mail, this.captcha).subscribe(
          (response) => {
            try {
              this.googleAnalyticsEventsService.emitEvent("indexer", "changeKeySuccess", "changeKeySuccess", 1);
            } catch (e) {
            }

            let data = response;
            this.error = '';
            if (data.status !== undefined && data.status === false) {
              this.captcha = '';
              this.error = 'Sorry, our servers are currently not able to handle that request. Please try again later or contact us if this error persists.'
            } else {
              this.submitted = true;
            }
            this.loading = false;

            if (this.captchaRef != undefined) {
              this.captchaRef.reset();
            }
          },
          (error) => {
            try {
              this.googleAnalyticsEventsService.emitEvent("indexer", "changeKeyInvalidMail", "changeKeyInvalidMail", 1);
            } catch (e) {
            }

            this.captcha = '';
            this.error = "The email address you entered does not match the address that was used to create this index. If you feel this is incorrect please contact us."
            if (error._body != undefined && error._body.search('Invalid captcha') != -1) {
              this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
            } else {
              this.contact_mail = '';
            }
            this.loading = false;
            if (this.captchaRef != undefined) {
              this.captchaRef.reset();
            }
          },
        );
      }
    }
  }

}

@Component({
  selector: 'action-forgotkeys',
  templateUrl: 'action-forgotkeys.html',
  providers: [IndexerService, CaptchaService, RecaptchaComponent]
})
export class ForgotKeysDialog {
  @ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;

  contact_mail = '';
  submitted = false;
  captcha = '';
  error = '';
  loading = false;
  recaptcha_key = environment.recaptcha;

  constructor(
    public captchaService : CaptchaService,
    public dialogRef: MatDialogRef<ForgotKeysDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private indexerService : IndexerService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
    try {
      this.googleAnalyticsEventsService.emitEvent("indexer", "forgotKeysDialog", "forgotKeysDialog", 1);
    } catch (e) {}
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
    this.sendRequest();
  }

  public sendRequest() {
    if (this.contact_mail == '') {
      this.error = 'Email address is required';
      if (this.captchaRef != undefined) { if (this.captchaRef != undefined) { this.captchaRef.reset(); } }
    } else if (this.captcha == '' || this.captcha == null) {
      this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
      if (this.captchaRef != undefined) { if (this.captchaRef != undefined) { this.captchaRef.reset(); } }
    } else {
      let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
      let valid_mail = re.test(this.contact_mail);
      if (!valid_mail) {
        this.error = 'Invalid email address (format: name@example.com)';
        if (this.captchaRef != undefined) { this.captchaRef.reset(); }
      } else {
        try {
          this.googleAnalyticsEventsService.emitEvent("indexer", "forgotKeysSendRequest", "forgotKeysSendRequest", 1);
        } catch (e) {
        }

        this.loading = true;
        this.indexerService.forgotIndexKeys(this.contact_mail, this.captcha).subscribe(
          (response) => {
            try {
              this.googleAnalyticsEventsService.emitEvent("indexer", "forgotKeysSuccess", "forgotKeysSuccess", 1);
            } catch (e) {
            }

            let data = response;
            this.error = '';
            if (data.status !== undefined && data.status === false) {
              this.captcha = '';
              this.error = 'Sorry, our servers are currently not able to handle that request. Please try again later or contact us if this error persists.'
            } else {
              this.submitted = true;
            }
            this.loading = false;

            if (this.captchaRef != undefined) {
              if (this.captchaRef != undefined) {
                this.captchaRef.reset();
              }
            }
          },
          (error) => {
            try {
              this.googleAnalyticsEventsService.emitEvent("indexer", "forgotKeysInvalidMail", "forgotKeysInvalidMail", 1);
            } catch (e) {
            }

            this.captcha = '';
            this.error = "The email address you entered does not own any indexes. If you feel this is incorrect please contact us.";
            if (error._body != undefined && error._body.search('Invalid captcha') != -1) {
              this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
            } else {
              this.contact_mail = '';
            }
            this.loading = false;
            if (this.captchaRef != undefined) {
              this.captchaRef.reset();
            }
          },
        );
      }
    }
  }

}

@Component({
  selector: 'action-resetowners',
  templateUrl: 'action-resetowners.html',
  providers: [IndexerService, CaptchaService, SearchService, RecaptchaComponent]
})
export class ResetOwnersDialog {
  @ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;

  contact_mail = '';
  key = '';
  world = '';
  action = '';
  alliance_id = '';
  alliance_name = '';
  submitted = false;
  captcha = '';
  error = '';
  loading = false;
  recaptcha_key = environment.recaptcha;

  // search
  alliances;
  allianceInput = '';
  searched = false;
  searching = false;
  typingTimer;
  debounceTime = 300;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(
    public captchaService : CaptchaService,
    public dialogRef: MatDialogRef<ResetOwnersDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private indexerService : IndexerService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    private searchService: SearchService,
    private _formBuilder: FormBuilder) {

    this.key = data.key;
    this.action = data.action;
    this.world = data.world;
    this.alliance_id = data.id;
    this.alliance_name = data.name;

    try {
      this.googleAnalyticsEventsService.emitEvent("indexer", "EditOwnersConfirmDialog"+this.action, "EditOwnersConfirmDialog"+this.action, 1);
    } catch (e) {}

  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['']
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['']
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  searchAlliances($event) {
    if (typeof $event != 'undefined') this.allianceInput = $event.target.value;

    clearTimeout(this.typingTimer);
    let that = this;
    this.typingTimer = setTimeout(function () {
      that.doSearchAlliances();
    }, this.debounceTime);
  }

  doSearchAlliances() {
    this.alliances = [];
    clearTimeout(this.typingTimer);
    if (this.allianceInput.length > 1) {
      this.searching = true;
      this.searchService.searchAlliances(this.allianceInput, 0, 30, this.key)
        .subscribe(
          (response) => this.renderAllianceOutput(response),
          (error) => this.renderAllianceOutput(null)
        );
    } else {
      this.searching = false;
    }
  }

  selectAlliance(alliance_id, alliance_name, stepper: MatStepper) {
    this.alliance_id = alliance_id;
    this.alliance_name = alliance_name;
    stepper.next();
  }

  renderAllianceOutput(alliances) {
    if (alliances != null) {
      this.alliances = alliances.results;
    }
    this.searched = true;
    this.searching = false;
  }

  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
    this.sendRequest();
  }

  public sendRequest() {
    if (this.action == 'include') {
      this.contact_mail = this.secondFormGroup.getRawValue().secondCtrl;
    }

    if (this.contact_mail == '') {
      this.error = 'Email address is required';
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
    } else if (this.captcha == '' || this.captcha == null) {
      this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
    } else {
      let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
      let valid_mail = re.test(this.contact_mail);
      if (!valid_mail) {
        this.error = 'Invalid email address (format: name@example.com)';
        if (this.captchaRef != undefined) { this.captchaRef.reset(); }
      }
      else {
        try {
          this.googleAnalyticsEventsService.emitEvent("indexer", "EditOwnersSendRequest"+this.action, "EditOwnersSendRequest"+this.action, 1);
        } catch (e) {}

        if (this.action == 'reset') {
          this.loading = true;
          this.indexerService.resetIndexOwners(this.key, this.contact_mail, this.captcha).subscribe(
            (response) => {
              let data = response;
              this.error = '';
              if (data.status !== undefined && data.status === false) {
                this.captcha = '';
                this.error = 'Sorry, our servers are currently not able to handle that request. Please try again later or contact us if this error persists.'
              } else {
                this.submitted = true;
              }
              this.loading = false;

              try {
                this.googleAnalyticsEventsService.emitEvent("indexer", "ResetOwnersSuccess", "ResetOwnersSuccess", 1);
              } catch (e) {}

              if (this.captchaRef != undefined) { this.captchaRef.reset(); }
            },
            (error) => {
              this.captcha = '';
              this.error = "The email address you entered does not match the address that was used to create this index.";
              if (error._body != undefined && error._body.search('Invalid captcha') != -1) {
                this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
              } else {
                this.contact_mail = '';
              }
              this.loading = false;
              try {
                this.googleAnalyticsEventsService.emitEvent("indexer", "ResetOwnersInvalidMail", "ResetOwnersInvalidMail", 1);
              } catch (e) {}
              if (this.captchaRef != undefined) { this.captchaRef.reset(); }
            },
          );
        } else if (this.action == 'exclude') {
          if (this.alliance_id == '') {
            this.error = 'Select an alliance first';
            if (this.captchaRef != undefined) { this.captchaRef.reset(); }
          } else {
            this.loading = true;
            this.indexerService.excludeIndexOwner(this.key, this.contact_mail, this.captcha, this.alliance_id).subscribe(
              (response) => {
                let data = response;
                this.error = '';
                if (data.status !== undefined && data.status === false) {
                  this.captcha = '';
                  this.error = 'Sorry, our servers are currently not able to handle that request. Please try again later or contact us if this error persists.'
                } else {
                  this.submitted = true;
                }
                this.loading = false;

                try {
                  this.googleAnalyticsEventsService.emitEvent("indexer", "IncludeOwnersSuccess", "IncludeOwnersSuccess", 1);
                } catch (e) {}

                if (this.captchaRef != undefined) { this.captchaRef.reset(); }
              },
              (error) => {
                this.captcha = '';
                this.error = "The email address you entered does not match the address that was used to create this index.";
                if (error._body != undefined && error._body.search('Invalid captcha') != -1) {
                  this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
                } else {
                  this.contact_mail = '';
                }
                this.loading = false;
                try {
                  this.googleAnalyticsEventsService.emitEvent("indexer", "IncludeOwnersInvalidMail", "IncludeOwnersInvalidMail", 1);
                } catch (e) {}
                if (this.captchaRef != undefined) { this.captchaRef.reset(); }
              },
            );
          }
        } else if (this.action == 'include') {
          if (this.alliance_id == '') {
            this.error = 'Select an alliance first';
            if (this.captchaRef != undefined) { this.captchaRef.reset(); }
          } else {
            this.loading = true;
            this.indexerService.includeIndexOwner(this.key, this.contact_mail, this.captcha, this.alliance_id).subscribe(
              (response) => {
                let data = response;
                this.error = '';
                if (data.status !== undefined && data.status === false) {
                  this.captcha = '';
                  this.error = 'Sorry, our servers are currently not able to handle that request. Please try again later or contact us if this error persists.'
                } else {
                  this.submitted = true;
                }
                this.loading = false;

                try {
                  this.googleAnalyticsEventsService.emitEvent("indexer", "IncludeOwnersSuccess", "IncludeOwnersSuccess", 1);
                } catch (e) {}

                if (this.captchaRef != undefined) { this.captchaRef.reset(); }
              },
              (error) => {
                this.captcha = '';
                this.error = "The email address you entered does not match the address that was used to create this index.";
                if (error._body != undefined && error._body.search('Invalid captcha') != -1) {
                  this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
                } else {
                  this.contact_mail = '';
                }
                this.loading = false;
                try {
                  this.googleAnalyticsEventsService.emitEvent("indexer", "IncludeOwnersInvalidMail", "IncludeOwnersInvalidMail", 1);
                } catch (e) {}
                if (this.captchaRef != undefined) { this.captchaRef.reset(); }
              },
            );
          }
        }
      }
    }
  }

}


@Component({
  selector: 'action-editowners',
  templateUrl: 'action-editowners.html',
  providers: [IndexerService, CaptchaService]
})
export class EditOwnersDialog {

  contact_mail = '';
  key = '';
  owners = '';
  world = '';
  submitted = false;
  captcha = '';
  error = '';
  loading = false;
  login_required = false;
  login_callback() {
    // this.login_required = !this.authService.loggedIn
  }

  constructor(
    public captchaService : CaptchaService,
    public dialogRef: MatDialogRef<EditOwnersDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private indexerService : IndexerService,
    private authService: JwtService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    public dialog: MatDialog) {
    // this.login_required = !this.authService.loggedIn;

    this.key = data.key;
    this.owners = data.owners;
    this.world = data.world;

    try {
      this.googleAnalyticsEventsService.emitEvent("indexer", "EditOwnersDialog", "EditOwnersDialog", 1);
    } catch (e) {}

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
  }

  public showResetOwnersDialog(action : string, id : number, name : string): void {
    let dialogRef = this.dialog.open(ResetOwnersDialog, {
      // height: '80%',
      // width: '90%',
      autoFocus: false,
      data: {
        key: this.key,
        world: this.world,
        action: action,
        id: id,
        name: name,
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

}


@Component({
  selector: 'action-cleanintel',
  templateUrl: 'action-cleanintel.html',
  providers: [IndexerService, CaptchaService, RecaptchaComponent]
})
export class CleanIntelDialog {
  @ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;

  contact_mail = '';
  key = '';
  submitted = false;
  captcha = '';
  error = '';
  loading = false;
  recaptcha_key = environment.recaptcha;

  login_required = false;
  login_callback() {
    // this.login_required = !this.authService.loggedIn
  }

  constructor(
    public captchaService : CaptchaService,
    public dialogRef: MatDialogRef<CleanIntelDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private indexerService : IndexerService,
    private authService: JwtService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
    // this.login_required = !this.authService.loggedIn;

    this.key = data.key;

    try {
      this.googleAnalyticsEventsService.emitEvent("indexer", "cleanIntelDialog", "cleanIntelDialog", 1);
    } catch (e) {}
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
    this.sendRequest();
  }

  public sendRequest() {
    if (this.contact_mail == '') {
      this.error = 'Email address is required';
      if (this.captchaRef != undefined) { if (this.captchaRef != undefined) { this.captchaRef.reset(); } }
    } else if (this.captcha == '' || this.captcha == null) {
      this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
      if (this.captchaRef != undefined) { if (this.captchaRef != undefined) { this.captchaRef.reset(); } }
    } else {
      let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
      let valid_mail = re.test(this.contact_mail);
      if (!valid_mail) {
        this.error = 'Invalid email address (format: name@example.com)';
        if (this.captchaRef != undefined) { this.captchaRef.reset(); }
      } else {
        try {
          this.googleAnalyticsEventsService.emitEvent("indexer", "cleanIntelSendRequest", "cleanIntelSendRequest", 1);
        } catch (e) {
        }

        this.loading = true;
        this.indexerService.requestCleanupSession(this.key, this.contact_mail, this.captcha).subscribe(
          (response) => {
            try {
              this.googleAnalyticsEventsService.emitEvent("indexer", "cleanIntelSuccess", "cleanIntelSuccess", 1);
            } catch (e) {
            }

            let data = response;
            this.error = '';
            if (data.status !== undefined && data.status === false) {
              this.captcha = '';
              this.error = 'Sorry, our servers are currently not able to handle that request. Please try again later or contact us if this error persists.'
            } else {
              this.submitted = true;
            }
            this.loading = false;

            if (this.captchaRef != undefined) {
              this.captchaRef.reset();
            }
          },
          (error) => {
            try {
              this.googleAnalyticsEventsService.emitEvent("indexer", "cleanIntelInvalidMail", "cleanIntelInvalidMail", 1);
            } catch (e) {
            }

            this.captcha = '';
            this.error = "The email address you entered does not match the address that was used to create this index. If you feel this is incorrect please contact us.";
            if (error._body != undefined && error._body.search('Invalid captcha') != -1) {
              this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
            } else {
              this.contact_mail = '';
            }
            this.loading = false;
            if (this.captchaRef != undefined) {
              this.captchaRef.reset();
            }
          },
        );
      }
    }
  }

}

@Component({
  selector: 'new-index',
  templateUrl: 'new-index.html',
  styleUrls: ['./indexer.component.scss'],
  providers: [WorldService, IndexerService, CaptchaService, RecaptchaComponent, LocalCacheService, JwtService]
})
export class NewIndexDialog {
  @ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;

  contact_mail = '';
  privacy_agreed = false;
  world = '';
  server: any = '';
  key = '';
  submitted = false;
  building = false;
  captcha = '';
  error = '';
  worldData = '';
  servers = [];
  worlds = [];
  createError = '';
  recaptcha_key = environment.recaptcha;

  login_required = false;
  login_callback() {
    // this.login_required = !this.authService.loggedIn;
  }

  constructor(
    public captchaService : CaptchaService,
    public dialogRef: MatDialogRef<NewIndexDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private indexerService : IndexerService,
    private worldService: WorldService,
    private router: Router,
    private authService: JwtService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
    // this.login_required = !this.authService.loggedIn;
    this.server = worldService.getDefaultServer();

    indexerService.getWorlds().subscribe((response) => this.loadWorlds(response));

    try {
      this.googleAnalyticsEventsService.emitEvent("indexer", "newIndexDialog", "newIndexDialog", 1);
    } catch (e) {}
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  loadWorlds(data) {
    this.servers = [];
    this.worldData = data;
    this.worlds = [];
    for (let i of this.worldData) {
      this.servers.push((<any>i).server);
      if ((<any>i).server == this.server) {
        for (let w of (<any>i).worlds) {
          this.worlds.push(w);
        }
      }
    }
  }

  updateWorlds(event) {
    this.server = event;
    this.world = '';
    this.loadWorlds(this.worldData)
  }

  public createNewIndex(event) {
    this.captcha = event;
    if (this.privacy_agreed == false) {
      this.error = 'Agree to our privacy policy to continue';
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
    } else if (this.contact_mail == '') {
      this.error = 'Mail is required';
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
    } else if (this.world == '') {
      this.error = 'Please select a world';
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
    } else if (this.captcha == undefined || this.captcha == '' || this.captcha == null) {
      this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
    } else {
      let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
      let valid_mail = re.test(this.contact_mail);
      if (!valid_mail) {
        this.error = 'Invalid email address (format: name@example.com)';
        if (this.captchaRef != undefined) { this.captchaRef.reset(); }
      }
      else {
        try {
          this.googleAnalyticsEventsService.emitEvent("indexer", "newIndexSendRequest", "newIndexSendRequest", 1);
        } catch (e) {}

        this.building = true;
        this.indexerService.createNewIndex(this.contact_mail, this.world, this.captcha).subscribe(
          (response) => {
            this.buildIndex(response);
            if (this.captchaRef != undefined) { this.captchaRef.reset(); }
          },
          (error) => {
            this.building = false;
            this.error = 'Invalid response. Please try again or contact us if this error persists.';
            if (this.captchaRef != undefined) { this.captchaRef.reset(); }
          }
        );
      }
    }
  }

  public buildIndex(data) {
    if (data.status == 'ok') {
      this.router.navigate(['/indexer/'+data.key]);
      this.dialogRef.close();
    }
    this.key = data.key;
    this.createError = 'You will receive an email with your index information as soon as it becomes available (this may take a day or two)';
    this.building = false;
    this.submitted = true;
  }
}

@Component({
  selector: 'index-disclaimer',
  templateUrl: 'index-disclaimer.html',
  providers: []
})
export class IndexDisclaimerDialog {

  constructor(
    public dialogRef: MatDialogRef<IndexDisclaimerDialog>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'install-dialog',
  templateUrl: 'install.html',
  providers: []
})
export class InstallDialog {

  key: any;
  encrypted: any;
  clicked: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<InstallDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.key = data.key;
    this.encrypted = Md5.hashAsciiStr(data.key);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'bb-dialog',
  templateUrl: 'bb.html',
  providers: []
})
export class BBDialog {

  type: any;
  dataBB: any;
  generated_at : any;
  copied = false;
  hiddenKey: boolean = false;
  hideAvailable: boolean = false;
  showNonPriority: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<BBDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
    this.type = data.type;
    this.dataBB = data.dataBB;
    this.generated_at = new Date().toLocaleString();

    this.hideAvailable = this.dataBB.contains_duplicates && this.dataBB.data.length > 6;
    this.showNonPriority = !this.hideAvailable;

    try {
      this.googleAnalyticsEventsService.emitEvent("BB_code", "copyBB", "copyBB", 1);
    } catch (e) {}
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  copyBB() {
    let selection = window.getSelection();
    let txt = document.getElementById('bb_code');
    let range = document.createRange();
    range.selectNodeContents(txt);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();
    this.copied = true;
  }

}

@Component({
  selector: 'conquest-dialog',
  templateUrl: 'conquest-report.html',
  providers: [IndexerService]
})
export class ConquestReportDialog {

  key: any;
  world: any;
  conquest: any;
  loading: any  = true;
  error: any  = false;
  getById: any  = false;
  reports: any  = [];
  objectKeys = Object.keys;
  allianceNames = {};

  constructor(
    public dialogRef: MatDialogRef<ConquestReportDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public indexerService: IndexerService,
  ) {
    this.key = data.key;
    this.world = data.world;
    this.conquest = data.conquest;
    this.getById = data.get_by_id;

    this.indexerService.getConquestReports(this.key, this.conquest.conquest_id, this.getById).subscribe(
      (response) => this.renderReports(response),
      (error) => {
        this.error = true;
        this.loading = false;
        console.log(error);
      });
  }

  renderReports(data) {
    if (
      (this.getById && data.conquest && data.intel)
      || (!this.getById && data.intel)
    ) {
      this.reports = data.intel;
      if (this.getById) {
        this.conquest = data.conquest;
      }
      if (this.conquest.belligerent_all) {
        Object.keys(this.conquest.belligerent_all).forEach(key => {
          this.allianceNames[this.conquest.belligerent_all[key].alliance_id] = this.conquest.belligerent_all[key].alliance_name
        });
      }
    } else {
      console.log(data);
      this.error = true;
    }
    this.loading = false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'siegelist-dialog',
  templateUrl: 'all-sieges.html',
  providers: [IndexerService]
})
export class SiegeListDialog {

  key: any;
  world: any;
  loading: any  = true;
  error: any  = false;
  sieges: any  = [];
  objectKeys = Object.keys;

  constructor(
    public dialogRef: MatDialogRef<SiegeListDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public indexerService: IndexerService,
    public dialog: MatDialog
  ) {
    this.key = data.key;
    this.world = data.world;

    this.indexerService.getSiegeList(this.key).subscribe(
      (response) => this.renderSieges(response),
      (error) => {
        this.error = true;
        this.loading = false;
        console.log(error);
      });
  }

  renderSieges(data) {
    if (data.sieges) {
      this.sieges = data.sieges;
    } else {
      console.log(data);
      this.error = true;
    }
    this.loading = false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public loadConquestDetails(conquest): void {
    let dialogRef = this.dialog.open(ConquestReportDialog, {
      autoFocus: false,
      data: {
        key: this.key,
        world: this.world,
        conquest: conquest,
      }
    });
  }

}

@Pipe({ name: 'HideNoLossPipe',  pure: false })
export class HideNoLossPipe implements PipeTransform {
  transform(value: any, stripBrackets: any = false): any {
    if (typeof value == 'string') {
      let str = value.replace('(-0)', '');
      if (str.includes('(')) {
        let index = value.indexOf('(');
        let first = value.substr(0, index);
        let index2 = value.indexOf(')')+1;
        let second = value.substr(index, index2 - index);
        let third = value.substr(index2);
        if (stripBrackets === true) {
          second = second.replace('(','');
          second = second.replace(')','');
        }
        str = first + ' <span class="diff-neg">'+second+'</span>' + third;
      }
      return str;
    } else if (value instanceof Array) {
      let temp = '';
      let count = 0;
      for (let i in value) {
        count ++;
        temp += this.transform(value[i]);
        if (count < (value.length)) temp += ', ';
      }
      return temp;
    } else {
      return value;
    }
  }
}

@Pipe({ name: 'UnitIconPipe',  pure: false })

export class UnitIconPipe implements PipeTransform {
  transform(value: any): any {
    let unitString = '';
    for (let i in value) {
      let unit = value[i];
      // console.log(unit);
      if (unitString != '') {unitString+=', ';}
      unitString += unit.count + ' ';
      if (unit.killed > 0) {unitString += '(-'+unit.killed+') '}
      unitString += unit.name;
    }
    unitString = unitString.replace(/_/g, ' ');
    return unitString;
    // if (typeof value == 'string') {
    //   let markup = '';
    //   let units = value.split(", ");
    //   for (let u in units) {
    //     let icon = '';
    //     // switch (true) {
    //     //   case units[u].indexOf('manti') !== -1: icon = 'icon-manti-sm'; break;
    //     //   case units[u].indexOf('erinyes') !== -1: icon = 'icon-erinyen-sm'; break;
    //     //   case units[u].indexOf('slingers') !== -1: icon = 'icon-slinger-sm'; break;
    //     //   case units[u].indexOf('griff') !== -1: icon = 'icon-griff-sm'; break;
    //     //   case units[u].indexOf('horsemen') !== -1: icon = 'icon-horseman-sm'; break;
    //     //   case units[u].indexOf('catapults') !== -1: icon = 'icon-catapult-sm'; break;
    //     //   default: break;
    //     // }
    //     markup += units[u] + (icon != '' ? '<div class="gd-icon-sm '+icon+'"></div>' : icon) + "<br/>";
    //   }
    //   return markup;
    // } else {
    //   return value;
    // }
  }
}

@Pipe({ name: 'BBLossPipe',  pure: false })
export class BBLossPipe implements PipeTransform {
  transform(value: any): any {
    if (typeof value == 'string') {
      let str = value.replace('(-0)', '');
      if (str.includes('(')) {
        let index = value.indexOf('(');
        let first = value.substr(0, index);
        let index2 = value.indexOf(')')+1;
        let second = value.substr(index, index2 - index);
        let third = value.substr(index2);
        str = first + ' [color=#C11717]'+second+'[/color]' + third;
      }
      return str;
    } else if (value instanceof Array) {
      let temp = '';
      let count = 0;
      for (let i in value) {
        count ++;
        temp += this.transform(value[i]);
        if (count < (value.length)) temp += ', ';
      }
      return temp;
    } else {
      return value;
    }
  }
}
