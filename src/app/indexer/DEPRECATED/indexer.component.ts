// import {Component, Inject, OnInit, Pipe, PipeTransform, ViewChild} from '@angular/core';
// import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// import {ActivatedRoute, Router} from "@angular/router";
// import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
// import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
// import { MatStepper } from "@angular/material/stepper";
// import {Md5} from 'ts-md5/dist/md5';
// import {RecaptchaComponent} from 'ng-recaptcha';
// import {IndexerService} from '../indexer.service';
// import {CaptchaService} from '../../services/captcha.service';
// import {environment} from '../../../environments/environment';
// import {JwtService} from '../../auth/services/jwt.service';
// import {GoogleAnalyticsEventsService} from '../../services/google-analytics-events.service';
// import {SearchService} from '../../search/search.service';
//
// @Component({
//   selector: 'action-changekey',
//   templateUrl: 'action-changekey.html',
//   providers: [IndexerService, CaptchaService, RecaptchaComponent]
// })
// export class ChangekeyDialog {
//   @ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;
//
//   contact_mail = '';
//   key = '';
//   submitted = false;
//   captcha = '';
//   error = '';
//   loading = false;
//   recaptcha_key = environment.recaptcha;
//
//   login_required = false;
//   login_callback() {
//     // this.login_required = !this.authService.loggedIn
//   }
//
//   constructor(
//     public captchaService : CaptchaService,
//     public dialogRef: MatDialogRef<ChangekeyDialog>,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private indexerService : IndexerService,
//     private authService: JwtService,
//     public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
//     // this.login_required = !this.authService.loggedIn;
//
//     this.key = data.key;
//
//     try {
//       this.googleAnalyticsEventsService.emitEvent("indexer", "changeKeyDialog", "changeKeyDialog", 1);
//     } catch (e) {}
//   }
//
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
//
//   resolved(captchaResponse: string) {
//     this.captcha = captchaResponse;
//     this.sendRequest();
//   }
//
//   public sendRequest() {
//     if (this.contact_mail == '') {
//       this.error = 'Email address is required';
//       if (this.captchaRef != undefined) { if (this.captchaRef != undefined) { this.captchaRef.reset(); } }
//     } else if (this.captcha == '' || this.captcha == null) {
//       this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
//       if (this.captchaRef != undefined) { if (this.captchaRef != undefined) { this.captchaRef.reset(); } }
//     } else {
//       let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
//       let valid_mail = re.test(this.contact_mail);
//       if (!valid_mail) {
//         this.error = 'Invalid email address (format: name@example.com)';
//         if (this.captchaRef != undefined) { this.captchaRef.reset(); }
//       } else {
//         try {
//           this.googleAnalyticsEventsService.emitEvent("indexer", "changeKeySendRequest", "changeKeySendRequest", 1);
//         } catch (e) {
//         }
//
//         this.loading = true;
//         this.indexerService.updateIndexKey(this.key, this.contact_mail, this.captcha).subscribe(
//           (response) => {
//             try {
//               this.googleAnalyticsEventsService.emitEvent("indexer", "changeKeySuccess", "changeKeySuccess", 1);
//             } catch (e) {
//             }
//
//             let data = response;
//             this.error = '';
//             if (data.status !== undefined && data.status === false) {
//               this.captcha = '';
//               this.error = 'Sorry, our servers are currently not able to handle that request. Please try again later or contact us if this error persists.'
//             } else {
//               this.submitted = true;
//             }
//             this.loading = false;
//
//             if (this.captchaRef != undefined) {
//               this.captchaRef.reset();
//             }
//           },
//           (error) => {
//             try {
//               this.googleAnalyticsEventsService.emitEvent("indexer", "changeKeyInvalidMail", "changeKeyInvalidMail", 1);
//             } catch (e) {
//             }
//
//             this.captcha = '';
//             this.error = "The email address you entered does not match the address that was used to create this index. If you feel this is incorrect please contact us."
//             if (error._body != undefined && error._body.search('Invalid captcha') != -1) {
//               this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
//             } else {
//               this.contact_mail = '';
//             }
//             this.loading = false;
//             if (this.captchaRef != undefined) {
//               this.captchaRef.reset();
//             }
//           },
//         );
//       }
//     }
//   }
//
// }
//
// @Component({
//   selector: 'action-forgotkeys',
//   templateUrl: 'action-forgotkeys.html',
//   providers: [IndexerService, CaptchaService, RecaptchaComponent]
// })
// export class ForgotKeysDialog {
//   @ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;
//
//   contact_mail = '';
//   submitted = false;
//   captcha = '';
//   error = '';
//   loading = false;
//   recaptcha_key = environment.recaptcha;
//
//   constructor(
//     public captchaService : CaptchaService,
//     public dialogRef: MatDialogRef<ForgotKeysDialog>,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private indexerService : IndexerService,
//     public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
//     try {
//       this.googleAnalyticsEventsService.emitEvent("indexer", "forgotKeysDialog", "forgotKeysDialog", 1);
//     } catch (e) {}
//   }
//
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
//
//   resolved(captchaResponse: string) {
//     this.captcha = captchaResponse;
//     this.sendRequest();
//   }
//
//   public sendRequest() {
//     if (this.contact_mail == '') {
//       this.error = 'Email address is required';
//       if (this.captchaRef != undefined) { if (this.captchaRef != undefined) { this.captchaRef.reset(); } }
//     } else if (this.captcha == '' || this.captcha == null) {
//       this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
//       if (this.captchaRef != undefined) { if (this.captchaRef != undefined) { this.captchaRef.reset(); } }
//     } else {
//       let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
//       let valid_mail = re.test(this.contact_mail);
//       if (!valid_mail) {
//         this.error = 'Invalid email address (format: name@example.com)';
//         if (this.captchaRef != undefined) { this.captchaRef.reset(); }
//       } else {
//         try {
//           this.googleAnalyticsEventsService.emitEvent("indexer", "forgotKeysSendRequest", "forgotKeysSendRequest", 1);
//         } catch (e) {
//         }
//
//         this.loading = true;
//         this.indexerService.forgotIndexKeys(this.contact_mail, this.captcha).subscribe(
//           (response) => {
//             try {
//               this.googleAnalyticsEventsService.emitEvent("indexer", "forgotKeysSuccess", "forgotKeysSuccess", 1);
//             } catch (e) {
//             }
//
//             let data = response;
//             this.error = '';
//             if (data.status !== undefined && data.status === false) {
//               this.captcha = '';
//               this.error = 'Sorry, our servers are currently not able to handle that request. Please try again later or contact us if this error persists.'
//             } else {
//               this.submitted = true;
//             }
//             this.loading = false;
//
//             if (this.captchaRef != undefined) {
//               if (this.captchaRef != undefined) {
//                 this.captchaRef.reset();
//               }
//             }
//           },
//           (error) => {
//             try {
//               this.googleAnalyticsEventsService.emitEvent("indexer", "forgotKeysInvalidMail", "forgotKeysInvalidMail", 1);
//             } catch (e) {
//             }
//
//             this.captcha = '';
//             this.error = "The email address you entered does not own any indexes. If you feel this is incorrect please contact us.";
//             if (error._body != undefined && error._body.search('Invalid captcha') != -1) {
//               this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
//             } else {
//               this.contact_mail = '';
//             }
//             this.loading = false;
//             if (this.captchaRef != undefined) {
//               this.captchaRef.reset();
//             }
//           },
//         );
//       }
//     }
//   }
//
// }
//
// @Component({
//   selector: 'action-resetowners',
//   templateUrl: 'action-resetowners.html',
//   providers: [IndexerService, CaptchaService, SearchService, RecaptchaComponent]
// })
// export class ResetOwnersDialog {
//   @ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;
//
//   contact_mail = '';
//   key = '';
//   world = '';
//   action = '';
//   alliance_id = '';
//   alliance_name = '';
//   submitted = false;
//   captcha = '';
//   error = '';
//   loading = false;
//   recaptcha_key = environment.recaptcha;
//
//   // search
//   alliances;
//   allianceInput = '';
//   searched = false;
//   searching = false;
//   typingTimer;
//   debounceTime = 300;
//   firstFormGroup: FormGroup;
//   secondFormGroup: FormGroup;
//
//   constructor(
//     public captchaService : CaptchaService,
//     public dialogRef: MatDialogRef<ResetOwnersDialog>,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private indexerService : IndexerService,
//     public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
//     private searchService: SearchService,
//     private _formBuilder: FormBuilder) {
//
//     this.key = data.key;
//     this.action = data.action;
//     this.world = data.world;
//     this.alliance_id = data.id;
//     this.alliance_name = data.name;
//
//     try {
//       this.googleAnalyticsEventsService.emitEvent("indexer", "EditOwnersConfirmDialog"+this.action, "EditOwnersConfirmDialog"+this.action, 1);
//     } catch (e) {}
//
//   }
//
//   ngOnInit() {
//     this.firstFormGroup = this._formBuilder.group({
//       firstCtrl: ['']
//     });
//     this.secondFormGroup = this._formBuilder.group({
//       secondCtrl: ['']
//     });
//   }
//
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
//
//   searchAlliances($event) {
//     if (typeof $event != 'undefined') this.allianceInput = $event.target.value;
//
//     clearTimeout(this.typingTimer);
//     let that = this;
//     this.typingTimer = setTimeout(function () {
//       that.doSearchAlliances();
//     }, this.debounceTime);
//   }
//
//   doSearchAlliances() {
//     this.alliances = [];
//     clearTimeout(this.typingTimer);
//     if (this.allianceInput.length > 1) {
//       this.searching = true;
//       this.searchService.searchAlliances(this.allianceInput, 0, 30, this.world)
//         .subscribe(
//           (response) => this.renderAllianceOutput(response),
//           (error) => this.renderAllianceOutput(null)
//         );
//     } else {
//       this.searching = false;
//     }
//   }
//
//   selectAlliance(alliance_id, alliance_name, stepper: MatStepper) {
//     this.alliance_id = alliance_id;
//     this.alliance_name = alliance_name;
//     stepper.next();
//   }
//
//   renderAllianceOutput(alliances) {
//     if (alliances != null) {
//       this.alliances = alliances.results;
//     }
//     this.searched = true;
//     this.searching = false;
//   }
//
//   resolved(captchaResponse: string) {
//     this.captcha = captchaResponse;
//     this.sendRequest();
//   }
//
//   public sendRequest() {
//     if (this.action == 'include') {
//       this.contact_mail = this.secondFormGroup.getRawValue().secondCtrl;
//     }
//
//     if (this.contact_mail == '') {
//       this.error = 'Email address is required';
//       if (this.captchaRef != undefined) { this.captchaRef.reset(); }
//     } else if (this.captcha == '' || this.captcha == null) {
//       this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
//       if (this.captchaRef != undefined) { this.captchaRef.reset(); }
//     } else {
//       let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
//       let valid_mail = re.test(this.contact_mail);
//       if (!valid_mail) {
//         this.error = 'Invalid email address (format: name@example.com)';
//         if (this.captchaRef != undefined) { this.captchaRef.reset(); }
//       }
//       else {
//         try {
//           this.googleAnalyticsEventsService.emitEvent("indexer", "EditOwnersSendRequest"+this.action, "EditOwnersSendRequest"+this.action, 1);
//         } catch (e) {}
//
//         if (this.action == 'reset') {
//           this.loading = true;
//           this.indexerService.resetIndexOwners(this.key, this.contact_mail, this.captcha).subscribe(
//             (response) => {
//               let data = response;
//               this.error = '';
//               if (data.status !== undefined && data.status === false) {
//                 this.captcha = '';
//                 this.error = 'Sorry, our servers are currently not able to handle that request. Please try again later or contact us if this error persists.'
//               } else {
//                 this.submitted = true;
//               }
//               this.loading = false;
//
//               try {
//                 this.googleAnalyticsEventsService.emitEvent("indexer", "ResetOwnersSuccess", "ResetOwnersSuccess", 1);
//               } catch (e) {}
//
//               if (this.captchaRef != undefined) { this.captchaRef.reset(); }
//             },
//             (error) => {
//               this.captcha = '';
//               this.error = "The email address you entered does not match the address that was used to create this index.";
//               if (error._body != undefined && error._body.search('Invalid captcha') != -1) {
//                 this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
//               } else {
//                 this.contact_mail = '';
//               }
//               this.loading = false;
//               try {
//                 this.googleAnalyticsEventsService.emitEvent("indexer", "ResetOwnersInvalidMail", "ResetOwnersInvalidMail", 1);
//               } catch (e) {}
//               if (this.captchaRef != undefined) { this.captchaRef.reset(); }
//             },
//           );
//         } else if (this.action == 'exclude') {
//           if (this.alliance_id == '') {
//             this.error = 'Select an alliance first';
//             if (this.captchaRef != undefined) { this.captchaRef.reset(); }
//           } else {
//             this.loading = true;
//             this.indexerService.excludeIndexOwner(this.key, this.contact_mail, this.captcha, this.alliance_id).subscribe(
//               (response) => {
//                 let data = response;
//                 this.error = '';
//                 if (data.status !== undefined && data.status === false) {
//                   this.captcha = '';
//                   this.error = 'Sorry, our servers are currently not able to handle that request. Please try again later or contact us if this error persists.'
//                 } else {
//                   this.submitted = true;
//                 }
//                 this.loading = false;
//
//                 try {
//                   this.googleAnalyticsEventsService.emitEvent("indexer", "IncludeOwnersSuccess", "IncludeOwnersSuccess", 1);
//                 } catch (e) {}
//
//                 if (this.captchaRef != undefined) { this.captchaRef.reset(); }
//               },
//               (error) => {
//                 this.captcha = '';
//                 this.error = "The email address you entered does not match the address that was used to create this index.";
//                 if (error._body != undefined && error._body.search('Invalid captcha') != -1) {
//                   this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
//                 } else {
//                   this.contact_mail = '';
//                 }
//                 this.loading = false;
//                 try {
//                   this.googleAnalyticsEventsService.emitEvent("indexer", "IncludeOwnersInvalidMail", "IncludeOwnersInvalidMail", 1);
//                 } catch (e) {}
//                 if (this.captchaRef != undefined) { this.captchaRef.reset(); }
//               },
//             );
//           }
//         } else if (this.action == 'include') {
//           if (this.alliance_id == '') {
//             this.error = 'Select an alliance first';
//             if (this.captchaRef != undefined) { this.captchaRef.reset(); }
//           } else {
//             this.loading = true;
//             this.indexerService.includeIndexOwner(this.key, this.contact_mail, this.captcha, this.alliance_id).subscribe(
//               (response) => {
//                 let data = response;
//                 this.error = '';
//                 if (data.status !== undefined && data.status === false) {
//                   this.captcha = '';
//                   this.error = 'Sorry, our servers are currently not able to handle that request. Please try again later or contact us if this error persists.'
//                 } else {
//                   this.submitted = true;
//                 }
//                 this.loading = false;
//
//                 try {
//                   this.googleAnalyticsEventsService.emitEvent("indexer", "IncludeOwnersSuccess", "IncludeOwnersSuccess", 1);
//                 } catch (e) {}
//
//                 if (this.captchaRef != undefined) { this.captchaRef.reset(); }
//               },
//               (error) => {
//                 this.captcha = '';
//                 this.error = "The email address you entered does not match the address that was used to create this index.";
//                 if (error._body != undefined && error._body.search('Invalid captcha') != -1) {
//                   this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
//                 } else {
//                   this.contact_mail = '';
//                 }
//                 this.loading = false;
//                 try {
//                   this.googleAnalyticsEventsService.emitEvent("indexer", "IncludeOwnersInvalidMail", "IncludeOwnersInvalidMail", 1);
//                 } catch (e) {}
//                 if (this.captchaRef != undefined) { this.captchaRef.reset(); }
//               },
//             );
//           }
//         }
//       }
//     }
//   }
//
// }
//
//
// @Component({
//   selector: 'action-editowners',
//   templateUrl: 'action-editowners.html',
//   providers: [IndexerService, CaptchaService]
// })
// export class EditOwnersDialog {
//
//   contact_mail = '';
//   key = '';
//   owners = '';
//   world = '';
//   submitted = false;
//   captcha = '';
//   error = '';
//   loading = false;
//   login_required = false;
//   login_callback() {
//     // this.login_required = !this.authService.loggedIn
//   }
//
//   constructor(
//     public captchaService : CaptchaService,
//     public dialogRef: MatDialogRef<EditOwnersDialog>,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private indexerService : IndexerService,
//     private authService: JwtService,
//     public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
//     public dialog: MatDialog) {
//     // this.login_required = !this.authService.loggedIn;
//
//     this.key = data.key;
//     this.owners = data.owners;
//     this.world = data.world;
//
//     try {
//       this.googleAnalyticsEventsService.emitEvent("indexer", "EditOwnersDialog", "EditOwnersDialog", 1);
//     } catch (e) {}
//
//   }
//
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
//
//   resolved(captchaResponse: string) {
//     this.captcha = captchaResponse;
//   }
//
//   public showResetOwnersDialog(action : string, id : number, name : string): void {
//     let dialogRef = this.dialog.open(ResetOwnersDialog, {
//       // height: '80%',
//       // width: '90%',
//       autoFocus: false,
//       data: {
//         key: this.key,
//         world: this.world,
//         action: action,
//         id: id,
//         name: name,
//       }
//     });
//
//     dialogRef.afterClosed().subscribe(result => {});
//   }
//
// }
//
//
// @Component({
//   selector: 'action-cleanintel',
//   templateUrl: 'action-cleanintel.html',
//   providers: [IndexerService, CaptchaService, RecaptchaComponent]
// })
// export class CleanIntelDialog {
//   @ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;
//
//   contact_mail = '';
//   key = '';
//   submitted = false;
//   captcha = '';
//   error = '';
//   loading = false;
//   recaptcha_key = environment.recaptcha;
//
//   login_required = false;
//   login_callback() {
//     // this.login_required = !this.authService.loggedIn
//   }
//
//   constructor(
//     public captchaService : CaptchaService,
//     public dialogRef: MatDialogRef<CleanIntelDialog>,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private indexerService : IndexerService,
//     private authService: JwtService,
//     public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
//     // this.login_required = !this.authService.loggedIn;
//
//     this.key = data.key;
//
//     try {
//       this.googleAnalyticsEventsService.emitEvent("indexer", "cleanIntelDialog", "cleanIntelDialog", 1);
//     } catch (e) {}
//   }
//
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
//
//   resolved(captchaResponse: string) {
//     this.captcha = captchaResponse;
//     this.sendRequest();
//   }
//
//   public sendRequest() {
//     if (this.contact_mail == '') {
//       this.error = 'Email address is required';
//       if (this.captchaRef != undefined) { if (this.captchaRef != undefined) { this.captchaRef.reset(); } }
//     } else if (this.captcha == '' || this.captcha == null) {
//       this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
//       if (this.captchaRef != undefined) { if (this.captchaRef != undefined) { this.captchaRef.reset(); } }
//     } else {
//       let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
//       let valid_mail = re.test(this.contact_mail);
//       if (!valid_mail) {
//         this.error = 'Invalid email address (format: name@example.com)';
//         if (this.captchaRef != undefined) { this.captchaRef.reset(); }
//       } else {
//         try {
//           this.googleAnalyticsEventsService.emitEvent("indexer", "cleanIntelSendRequest", "cleanIntelSendRequest", 1);
//         } catch (e) {
//         }
//
//         this.loading = true;
//         this.indexerService.requestCleanupSession(this.key, this.contact_mail, this.captcha).subscribe(
//           (response) => {
//             try {
//               this.googleAnalyticsEventsService.emitEvent("indexer", "cleanIntelSuccess", "cleanIntelSuccess", 1);
//             } catch (e) {
//             }
//
//             let data = response;
//             this.error = '';
//             if (data.status !== undefined && data.status === false) {
//               this.captcha = '';
//               this.error = 'Sorry, our servers are currently not able to handle that request. Please try again later or contact us if this error persists.'
//             } else {
//               this.submitted = true;
//             }
//             this.loading = false;
//
//             if (this.captchaRef != undefined) {
//               this.captchaRef.reset();
//             }
//           },
//           (error) => {
//             try {
//               this.googleAnalyticsEventsService.emitEvent("indexer", "cleanIntelInvalidMail", "cleanIntelInvalidMail", 1);
//             } catch (e) {
//             }
//
//             this.captcha = '';
//             this.error = "The email address you entered does not match the address that was used to create this index. If you feel this is incorrect please contact us.";
//             if (error._body != undefined && error._body.search('Invalid captcha') != -1) {
//               this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
//             } else {
//               this.contact_mail = '';
//             }
//             this.loading = false;
//             if (this.captchaRef != undefined) {
//               this.captchaRef.reset();
//             }
//           },
//         );
//       }
//     }
//   }
//
// }
//
// @Component({
//   selector: 'index-disclaimer',
//   templateUrl: 'index-disclaimer.html',
//   providers: []
// })
// export class IndexDisclaimerDialog {
//
//   constructor(
//     public dialogRef: MatDialogRef<IndexDisclaimerDialog>,
//     public dialog: MatDialog,
//     @Inject(MAT_DIALOG_DATA) public data: any) { }
//
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
//
// }
//
// @Component({
//   selector: 'install-dialog',
//   templateUrl: 'install.html',
//   providers: []
// })
// export class InstallDialog {
//
//   key: any;
//   encrypted: any;
//   clicked: boolean = false;
//
//   constructor(
//     public dialogRef: MatDialogRef<InstallDialog>,
//     @Inject(MAT_DIALOG_DATA) public data: any) {
//     this.key = data.key;
//     this.encrypted = Md5.hashAsciiStr(data.key);
//   }
//
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
//
// }
//
