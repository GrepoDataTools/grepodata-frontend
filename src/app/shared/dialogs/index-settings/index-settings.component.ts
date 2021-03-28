import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IndexAuthService} from '../../../auth/services/index.service';
import {JwtService} from '../../../auth/services/jwt.service';
import {SearchService} from '../../../search/search.service';

@Component({
  selector: 'app-index-settings',
  templateUrl: './index-settings.component.html',
  styleUrls: ['./index-settings.component.scss'],
  providers: [IndexAuthService, SearchService]
})
export class IndexSettingsDialog {

  @ViewChild('alliance_input', {static: false}) alliance_input:ElementRef;

  updating_owners: boolean = false;
  updating_v1join: boolean = false;
  updating_days: boolean = false;
  updating_days_success: boolean = false;
  updating_v1join_success: boolean = false;
  adding_alliance: boolean = false;

  owners: any = [];
  owners_error = '';
  days_error = '';
  v1join_error = '';
  owners_success = '';

  num_days = 0;
  allow_join_v1_key = true;

  index: any = {
    name: 'loading'
  };

  // search
  alliances;
  allianceInput = '';
  searched = false;
  searching = false;
  typingTimer;
  debounceTime = 300;

  constructor(
    public dialogRef: MatDialogRef<IndexSettingsDialog>,
    private authService: JwtService,
    private indexerService: IndexAuthService,
    private searchService: SearchService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data.index);
    this.index = data.index;

    if ('num_days' in this.index) {
      this.num_days = this.index.num_days;
    }

    if ('allow_join_v1_key' in this.index) {
      this.allow_join_v1_key = this.index.allow_join_v1_key == 1;
    }

    this.loadOwners();
  }

  close(): void {
    this.dialogRef.close();
  }

  loadOwners() {
    this.updating_owners = true;
    this.authService.accessToken().then(access_token => {
      this.indexerService.getIndexOwners(access_token, this.index.key)
        .subscribe(
          (response) => this.renderOwners(response),
          (error) => this.renderOwners(null)
        );
    });
  }

  renderOwners(response) {
    console.log(response);
    this.owners_error = '';
    this.owners_success = '';
    if (!response || !('data' in response)) {
      this.owners_error = 'Unable to load index owners. Please try again later or contact us if this error persists.';
    } else {
      this.owners = response.data;
      console.log(this.owners);
    }
    this.updating_owners = false;
  }

  removeOwner(owner) {
    console.log(owner);
    this.updating_owners = true;
    this.authService.accessToken().then(access_token => {
      this.indexerService.removeIndexOwner(access_token, this.index.key, owner.alliance_id)
        .subscribe(
          (response) => {
            this.owners_error = '';
            this.owners_success = '';
            if (response) {
              if ('success_code' in response && response.success_code === 1000) {
                let removed_id = response.removed_id;
                this.owners = this.owners.filter((e) => e.alliance_id !== removed_id);
                this.owners_success = 'Alliance \'' + owner.alliance_name + '\' has been removed from the list of index owners.';
              } else {
                this.owners_error = 'Unable to remove owner. Please try again later or contact us if this error persists.';
              }
            } else {
              this.owners_error = 'Unable to remove owner. Please try again later or contact us if this error persists.';
            }
            this.updating_owners = false;
          },
          (error) => {
            this.owners_error = 'Unable to remove owner. Please try again later or contact us if this error persists.';
            this.owners_success = '';
            this.updating_owners = false;
          }
        );
    });
  }

  toggleIntelDisplay(owner) {
    this.updating_owners = true;
    this.authService.accessToken().then(access_token => {
      this.indexerService.setIndexOwnerHidden(access_token, this.index.key, owner.alliance_id, !owner.hide_intel)
        .subscribe(
          (response) => {
            this.owners_error = '';
            this.owners_success = '';
            if (response) {
              if ('success_code' in response && response.success_code === 1000) {
                let updated_owner = response.data;
                this.owners = this.owners.map(ownerm => {
                  return ownerm.alliance_id === updated_owner.alliance_id ? updated_owner : ownerm
                });
                this.owners_success = 'All town intelligence for alliance ' + updated_owner.alliance_name + ' will now be ';
                if (updated_owner.hide_intel===true) {
                  this.owners_success += 'hidden in this index.'
                } else {
                  this.owners_success += 'available to index members.'
                }
              } else {
                this.owners_error = 'Unable to update owners. Please try again later or contact us if this error persists.';
              }
            } else {
              this.owners_error = 'Unable to update owners. Please try again later or contact us if this error persists.';
            }
            this.updating_owners = false;
          },
          (error) => {
            this.owners_error = 'Unable to update owners. Please try again later or contact us if this error persists.';
            this.owners_success = '';
            this.updating_owners = false;
          }
        );
    });
  }

  setIndexDeleteDays() {
    this.updating_days = true;
    this.updating_days_success = false;
    this.authService.accessToken().then(access_token => {
      this.indexerService.setIndexDeleteDays(access_token, this.index.key, this.num_days)
        .subscribe(
          (response) => {
            this.days_error = '';
            if (response) {
              if ('success_code' in response && response.success_code === 1250) {
                this.updating_days_success = true;
                window.setTimeout(()=>{this.updating_days_success = false;}, 8000);
                this.num_days = response.num_days;
              } else {
                this.days_error = 'Unable to update intel retention. Please try again later or contact us if this error persists.';
              }
            } else {
              this.days_error = 'Unable to update intel retention. Please try again later or contact us if this error persists.';
            }
            this.updating_days = false;
          },
          (error) => {
            this.days_error = 'Unable to update intel retention. Please try again later or contact us if this error persists.';
            this.updating_days = false;
          }
        );
    });
  }

  setIndexJoinV1() {
    this.updating_v1join = true;
    this.updating_v1join_success = false;
    this.authService.accessToken().then(access_token => {
      this.indexerService.setIndexV1Join(access_token, this.index.key, this.allow_join_v1_key)
        .subscribe(
          (response) => {
            this.v1join_error = '';
            if (response) {
              if ('success_code' in response && response.success_code === 1260) {
                this.updating_v1join_success = true;
                window.setTimeout(()=>{this.updating_v1join_success = false;}, 8000);
                this.allow_join_v1_key = response.allow_join_v1_key;
              } else {
                this.v1join_error = 'Unable to update this setting. Please try again later or contact us if this error persists.';
              }
            } else {
              this.v1join_error = 'Unable to update this setting. Please try again later or contact us if this error persists.';
            }
            this.updating_v1join = false;
          },
          (error) => {
            this.v1join_error = 'Unable to update this setting. Please try again later or contact us if this error persists.';
            this.updating_v1join = false;
          }
        );
    });
  }

  getExistingOwnerIds() {
    console.log(this.owners.map(i => i.alliance_id));
    return this.owners.map(i => i.alliance_id);
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
      this.searchService.searchAlliances(this.allianceInput, 0, 10, this.index.world)
        .subscribe(
          (response) => this.renderAllianceOutput(response),
          (error) => this.renderAllianceOutput(null)
        );
    } else {
      this.searching = false;
    }
  }

  selectAlliance(alliance) {
    console.log(alliance);
    this.updating_owners = true;
    this.authService.accessToken().then(access_token => {
      this.indexerService.addIndexOwner(access_token, this.index.key, alliance.id)
        .subscribe(
          (response) => {
            this.owners_error = '';
            this.owners_success = '';
            if (response) {
              if ('success_code' in response && response.success_code === 1000) {
                let added_owner = response.data;
                this.owners.push(added_owner);
                this.owners_success = 'Alliance \'' + added_owner.alliance_name + '\' has been added as an owner of this index.';
                this.adding_alliance=false;
                this.allianceInput='';
                this.alliances=[];
                this.searched=false;
              } else if ('error_code' in response && response.error_code === 7533) {
                this.owners_error = 'Alliance \''+alliance.name+'\' is already an owner of this index.';
              } else if ('error_code' in response && response.error_code === 2040) {
                this.owners_error = 'Alliance \''+alliance.name+'\' no longer exists.';
              } else {
                this.owners_error = 'Unable to add owner. Please try again later or contact us if this error persists.';
              }
            } else {
              this.owners_error = 'Unable to add owner. Please try again later or contact us if this error persists.';
            }
            this.updating_owners = false;
          },
          (error) => {
            this.owners_error = 'Unable to add owner. Please try again later or contact us if this error persists.';
            this.owners_success = '';
            this.updating_owners = false;
          }
        );
    });
  }

  renderAllianceOutput(alliances) {
    if (alliances && 'results' in alliances) {
      this.alliances = alliances.results;
    }
    this.searched = true;
    this.searching = false;
  }

  openAllianceSearch() {
    this.adding_alliance = true;
    setTimeout(() => this.alliance_input.nativeElement.focus());
  }
}
