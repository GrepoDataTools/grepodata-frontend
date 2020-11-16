import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {IndexList, ProfileService} from '../../../services/profile.service';
import {JwtService} from '../../../services/jwt.service';
import {Router} from '@angular/router';
import {WorldService} from '../../../../services/world.service';
import {IndexerService} from '../../../../indexer/indexer.service';
import {CaptchaService} from '../../../../services/captcha.service';
import {environment} from '../../../../../environments/environment';
import {RecaptchaComponent} from 'ng-recaptcha';

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

  constructor(
    public captchaService : CaptchaService,
    private authService: JwtService,
    private profileService: ProfileService,
    private router: Router,
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

  updateWorlds(event) {
    this.server = event;
    this.world = '';
    this.loadWorlds(this.worldData)
  }

  loadIndexes() {
    this.profileService.getIndexes().subscribe(
    	(response) => {
    		this.indexes = response.items;
    		this.loading = false;
    	},
    	(error) => {
    		console.log(error);

        if (error.status === 401) {
          console.log('Redirecting to login');
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (error.error.error_code == 3010) {
          console.error(error.error);
          this.confirmed = false;
        } else {
          console.error(error.error);
        }

        this.loading = false;
    	},
    );
  }

  createNewIndex(event) {
    this.captcha = event;
    if (this.index_name == '') {
      this.error = 'Index name is required';
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
    } else if (this.world == '') {
      this.error = 'Please select a world';
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
    } else if (this.captcha == undefined || this.captcha == '' || this.captcha == null) {
      this.error = 'Sorry, we could not verify the captcha. Please try again later or contact us if this error persists.';
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
    } else {
      this.loading_new_index = true;
      this.indexerService.createNewIndex(this.index_name, this.world, this.captcha).subscribe(
        (response) => {
          this.loading_new_index = false;
          this.new_index_created = true;
          if (response.key) {
            this.indexes.unshift({
              'key': response.key,
              'name': this.index_name,
              'world': this.world,
              'role': 'owner',
              'contribute': 1,
              'overview': null,
            });
          }
          if (this.captchaRef != undefined) { this.captchaRef.reset(); }
        },
        (error) => {
          this.loading_new_index = false;
          this.error = 'Invalid response. Please try again or contact us if this error persists.';
          if (this.captchaRef != undefined) { this.captchaRef.reset(); }
        }
      );
    }
  }

  enableContributions(index) {
    console.log(index)
  }


}
