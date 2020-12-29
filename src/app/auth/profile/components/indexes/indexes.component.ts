import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {IndexList, ProfileService} from '../../../services/profile.service';
import {JwtService} from '../../../services/jwt.service';
import {Router} from '@angular/router';
import {WorldService} from '../../../../services/world.service';
import {IndexerService} from '../../../../indexer/indexer.service';
import {CaptchaService} from '../../../../services/captcha.service';
import {environment} from '../../../../../environments/environment';
import {RecaptchaComponent} from 'ng-recaptcha';
import {NewIndexDialog} from '../../../../shared/dialogs/new-index/new-index.component';
import {MatDialog} from '@angular/material/dialog';
import {IndexSettingsDialog} from '../../../../shared/dialogs/index-settings/index-settings.component';
import {IndexMembersDialog} from '../../../../shared/dialogs/index-members/index-members.component';
import {ShareIndexDialog} from '../../../../shared/dialogs/share-index/share-index.component';

@Component({
  selector: 'app-indexes',
  templateUrl: './indexes.component.html',
  styleUrls: ['./indexes.component.scss'],
  providers: [IndexerService, WorldService, CaptchaService],
  encapsulation: ViewEncapsulation.None
})
export class IndexesComponent implements OnInit {
  @ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;

  indexes: IndexList[] = [];
  loading = true;
  confirmed = true;
  form_opened = false;
  import_opened = false;

  loading_new_index = false;
  new_index_created = false;
  new_index_imported = false;
  captcha = '';
  error = '';
  index_name = '';
  import_key_input = '';
  world = '';
  server: any = '';
  worldData = '';
  servers = [];
  worlds = [];
  recaptcha_key = environment.recaptcha;

  readonly ROLE_ADMIN = environment.ROLE_ADMIN;
  readonly ROLE_OWNER = environment.ROLE_OWNER;

  constructor(
    public captchaService : CaptchaService,
    private authService: JwtService,
    private profileService: ProfileService,
    private router: Router,
    private dialog: MatDialog,
    private indexerService : IndexerService,
    private worldService: WorldService,
  ) {
    this.server = worldService.getDefaultServer();

    indexerService.getWorlds().subscribe((response) => this.loadWorlds(response));
  }

  ngOnInit() {
    this.loadIndexes();
  }

  public routing(url) {
    this.router.navigate([url]);
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

  public newIndex() {
    let dialogRef = this.dialog.open(NewIndexDialog, {
      // width: '80%',
      // height: '90%'
      autoFocus: false,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadIndexes();
    });
  }

  public openIndexSettings(index) {
    let dialogRef = this.dialog.open(IndexSettingsDialog, {
      // width: '80%',
      // height: '90%'
      autoFocus: false,
      disableClose: false,
      data: {
        index: index
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadIndexes();
    });
  }

  public openIndexMembers(index) {
    let dialogRef = this.dialog.open(IndexMembersDialog, {
      minWidth: '50%',
      // height: '90%'
      autoFocus: false,
      disableClose: false,
      data: {
        index: index
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadIndexes();
    });
  }

  public openShareIndexDialog(index) {
    let dialogRef = this.dialog.open(ShareIndexDialog, {
      // width: '80%',
      // height: '90%'
      autoFocus: false,
      disableClose: false,
      data: {
        index: index
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadIndexes();
    });
  }

  // updateWorlds(event) {
  //   this.server = event;
  //   this.world = '';
  //   this.loadWorlds(this.worldData)
  // }

  loadIndexes() {
    this.authService.accessToken().then(access_token => {
      this.profileService.getIndexes(access_token).subscribe(
        (response) => {
          this.indexes = response.items;
          this.loading = false;
        },
        (error) => {
          console.log(error);

          if (error.status === 401) {
            console.log('Redirecting to login');
            this.authService.logout();
          } else if (error.error.error_code == 3010) {
            console.error(error.error);
            this.confirmed = false;
          } else {
            console.error(error.error);
          }

          this.loading = false;
        },
      );
    });
  }

  enableContributions(index) {
    console.log(index)
  }


}
