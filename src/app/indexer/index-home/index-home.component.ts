import { Component, OnInit } from '@angular/core';
import {Globals} from '../../globals';
import {Md5} from 'ts-md5/dist/md5';
import {IndexerService} from '../../shared/services/indexer.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ContactDialog} from '../../shared/dialogs/contact/contact.component';

@Component({
  selector: 'app-index-home',
  templateUrl: './index-home.component.html',
  styleUrls: ['./index-home.component.scss'],
  providers: [IndexerService]
})
export class IndexHomeComponent implements OnInit {

  world = '';
  key = '';
  data: any = '';
  encrypted: any;
  error = '';
  moved = false;
  clicked = false;
  loading = true;
  toggleMore = false;
  openingIndex = true;
  latest_intel: any = [];

  csa:any = false;

  constructor(
    private globals: Globals,
    private indexerService: IndexerService,
    public router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog) {
    this.route.params.subscribe( params => this.load(params));
  }

  ngOnInit(): void {
  }

  private load(params) {
    // Reset
    this.world = '';
    this.key = '';
    this.error = '';
    this.moved = false;
    this.latest_intel = [];
    // this.data = '';

    // Save params
    if (typeof params['key'] != 'undefined' && params['key'].length == 8) {
      this.encrypted = Md5.hashAsciiStr(params['key']);
      this.indexerService.getIndex(params['key']).subscribe(
        (response) => this.loadIndex(response, params['key']),
        (error) => {
          this.globals.set_active_index('');
          this.router.navigate(['/indexer']);
        });
    } else {
      // redirect to /indexer home
      this.openingIndex = false;
      this.router.navigate(['/indexer']);
    }
  }

  public refresh(): void {
    window.location.reload();
  }

  cleanupLogout() {
    //LocalCacheService.set('csa'+this.key, false, 0);
    this.csa = false;
    this.router.navigate(['/indexer/'+this.key]);
  }

  public newIndex() {
    // let dialogRef = this.dialog.open(NewIndexDialog, {
    //   // width: '80%',
    //   // height: '90%'
    //   autoFocus: false,
    //   disableClose: true
    // });
    //
    // dialogRef.afterClosed().subscribe(result => {});
  }

  private loadIndex(data, key) {
    if (data.moved == true) {
      this.moved = true;
      this.key = key;
    } else {
      this.globals.set_active_index(key);
      this.globals.set_active_intel(data.world, key);
      this.key = key;
      //this.csa = LocalCacheService.get('csa'+this.key);
      this.world = data.world;
      this.data = data;
      if (data.latest_intel) {
        this.latest_intel = data.latest_intel;
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

  public showChangekeyDialog(): void {
    // let dialogRef = this.dialog.open(ChangekeyDialog, {
    //   // width: '600px',
    //   autoFocus: false,
    //   data: {
    //     key: this.key
    //   }
    // });
    //
    // dialogRef.afterClosed().subscribe(result => {});
  }

  public showEditOwnersDialog(): void {
    // let dialogRef = this.dialog.open(EditOwnersDialog, {
    //   // width: '600px',
    //   // height: '80%',
    //   autoFocus: false,
    //   data: {
    //     key: this.key,
    //     world: this.world,
    //     owners: this.data['owners']
    //   }
    // });
    //
    // dialogRef.afterClosed().subscribe(result => {});
  }

  public showCleanupDialog(): void {
    // let dialogRef = this.dialog.open(CleanIntelDialog, {
    //   // width: '600px',
    //   autoFocus: false,
    //   data: {
    //     key: this.key
    //   }
    // });
    //
    // dialogRef.afterClosed().subscribe(result => {});
  }

  public indexDisclaimer() {
    // let dialogRef = this.dialog.open(IndexDisclaimerDialog, {
    //   width: '90%',
    //   height: '80%',
    //   autoFocus: false,
    // });
    //
    // dialogRef.afterClosed().subscribe(result => {});
  }

  public openInstalldialog() {
    // let dialogRef = this.dialog.open(InstallDialog, {
    //   // width: '90%',
    //   // height: 'auto',
    //   autoFocus: false,
    //   data: {
    //     key: this.key
    //   }
    // });
    //
    // dialogRef.afterClosed().subscribe(result => {});
  }

  public showContactDialog(): void {
    let dialogRef = this.dialog.open(ContactDialog, {
      // width: '600px',
      // height: '90%'
      autoFocus: false
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

    // let dialogRef = this.dialog.open(BBDialog, {
    //   // width: '90%',
    //   // height: '80%',
    //   autoFocus: false,
    //   data: {
    //     dataBB: dataBB,
    //     type: type
    //   }
    // });
    //
    // dialogRef.afterClosed().subscribe(result => {});
  }
}
