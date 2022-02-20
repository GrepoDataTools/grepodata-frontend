import {Component, ElementRef, Inject, Injectable, ViewChild} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SearchService} from '../search/search.service';
import {Globals} from '../globals';
import {WorldService} from '../services/world.service';
import {LocalCacheService} from '../services/local-cache.service';

const apiUrl = environment.apiUrl;

@Injectable()
export class AllianceService {

  constructor(private http: HttpClient) {}

  loadAllianceInfo(world: string, id: string) {
    var url =  '/alliance/info';
    if (typeof world != 'undefined') url += '?world=' + world;
    if (typeof id != 'undefined') url += '&id=' + id;
    return this.http.get(apiUrl + url);
  }

  loadAllianceHistory(world: string, id: string) {
    var url =  '/alliance/history';
    if (typeof world != 'undefined') url += '?world=' + world;
    if (typeof id != 'undefined') url += '&id=' + id;
    return this.http.get(apiUrl + url);
  }

  loadAllianceChanges(world: string, id: any, from: any = undefined, size: any = undefined) {
    var url =  '/alliance/changes';
    if (typeof world != 'undefined') url += '?world=' + world;
    if (typeof id != 'undefined') url += '&id=' + id;
    if (typeof from != 'undefined') url += '&from=' + from;
    if (typeof size != 'undefined') url += '&size=' + size;
    return this.http.get(apiUrl + url);
  }

  loadAllianceHistoryRange(world: string, id: string, from: string, to: string) {
    var url =  '/alliance/rangehistory';
    if (typeof world != 'undefined') url += '?world=' + world;
    if (typeof id != 'undefined') url += '&id=' + id;
    if (typeof from != 'undefined') url += '&from=' + from;
    if (typeof to != 'undefined') url += '&to=' + to;
    return this.http.get(apiUrl + url);
  }

  loadAllianceMembers(world: string, id: string) {
    var url =  '/alliance/members';
    if (typeof world != 'undefined') url += '?world=' + world;
    if (typeof id != 'undefined') url += '&id=' + id;
    return this.http.get(apiUrl + url);
  }

  loadAllianceWars(world: string, id: string) : any {
    var url =  '/alliance/wars';
    if (typeof world != 'undefined') url += '?world=' + world;
    if (typeof id != 'undefined') url += '&id=' + id;
    return this.http.get(apiUrl + url);
  }

  getMailList(world: string, ids: string) {
    var url =  '/alliance/maillist';
    if (typeof world != 'undefined') url += '?world=' + world;
    if (typeof ids != 'undefined') url += '&alliance_ids=' + ids;
    return this.http.get(apiUrl + url);
  }

}

@Component({
  selector: 'maillist-dialog',
  templateUrl: 'maillist-dialog.html',
  providers: [AllianceService, SearchService, WorldService, LocalCacheService]
})
export class MailListDialog {

  @ViewChild("searchInputList") searchInputList: ElementRef;

  params: any;
  copied : boolean = false;
  world = '';
  maillist = '';
  selected_alliances = [];
  parent_id;
  parent_name;

  // search
  alliances;
  allianceInput = '';
  searched = false;
  searching = false;
  typingTimer;
  debounceTime = 300;

  constructor(
    private allianceService: AllianceService,
    private searchService: SearchService,
    private globals: Globals,
    public dialogRef: MatDialogRef<MailListDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.params = data;
    this.world = data.world;
    if ('id' in data.alliance) {
      this.parent_id = data.alliance.id;
      this.parent_name = data.alliance.name;
      this.maillist = data.alliance.members.join('; ') + '; ';
    }
    this.addAllianceToSelection(this.parent_id, this.parent_name);
  }

  addAllianceToSelection(id, name) {
    this.removeAllianceById(id, false);
    this.selected_alliances.push({
      id: id,
      name: name
    });
    this.loadMaillist();
  }

  removeAllianceById(id, reload=true) {
    this.selected_alliances = this.selected_alliances.filter(item => item.id != id);
    if (reload) {
      if (this.selected_alliances.length <= 0) {
        this.maillist = '';
      } else {
        this.loadMaillist();
      }
    }
  }

  loadMaillist() {
    this.allianceService.getMailList(this.world, this.selected_alliances.map(i => i.id).join(',')).subscribe((response: any) => {
      if (response.success == true) {
        this.maillist = response.mail_list;
      }
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
      this.searchService.searchAlliances(this.allianceInput, 0, 30, this.world)
        .subscribe(
          (response) => this.renderAllianceOutput(response),
          (error) => this.renderAllianceOutput(null)
        );
    } else {
      this.searching = false;
    }
  }

  selectAlliance(alliance_id, alliance_name) {
    this.addAllianceToSelection(alliance_id, alliance_name);
    this.searched = false;
    this.searchInputList.nativeElement.value = "";
  }

  renderAllianceOutput(alliances) {
    if (alliances != null) {
      this.alliances = alliances.results;
    }
    this.searched = true;
    this.searching = false;
  }

  copyList() : void {
    let selection = window.getSelection();
    let txt = document.getElementById('bb_code');
    let range = document.createRange();
    range.selectNodeContents(txt);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();
    this.copied = true;
    window.setTimeout(()=>{this.copied = false;}, 5000);
    this.globals.showSnackbar(
      `<h4>Mailing list copied to clipboard</h4>`,
      'success', '', true,5000);
  }

}
