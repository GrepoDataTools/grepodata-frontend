import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {JwtService} from '../../../auth/services/jwt.service';
import {IndexerService} from '../../../indexer/indexer.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {WorldService} from '../../../services/world.service';
import {LocalCacheService} from '../../../services/local-cache.service';

@Component({
  selector: 'app-index-settings',
  templateUrl: './intel-source.component.html',
  styleUrls: ['./intel-source.component.scss'],
  providers: [IndexerService, WorldService, LocalCacheService]
})
export class IntelSourceDialog {

  index_list: any = {};
  intel_record: any = {};
  intel_type: string = 'incoming'; // 'incoming' => shared with me, 'outgoing' => who is my intel shared with
  index_info: any = [];
  expanded_info_available = false;
  world : null;
  breadcrumb_data : any = {};

  constructor(
    private indexService: IndexerService,
    public dialogRef: MatDialogRef<IntelSourceDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.intel_record = data.intel;
    this.index_list = data.index_list;
    this.intel_type = data.intel_type;
    this.index_info = [];
    this.index_list.forEach(index_key => {
      let localinfo = this.indexService.getLocalIndexInfo(index_key);
      let expanded_index = {
        key: index_key
      }
      if (localinfo) {
        this.world = localinfo.world;
        this.expanded_info_available = true;
        expanded_index = localinfo
      }
      this.index_info.push(expanded_index)
    });
    this.buildBreadcrumbData();
    console.log(this.index_info);
  }

  close(): void {
    this.dialogRef.close();
  }

  private buildBreadcrumbData() {
    this.breadcrumb_data = {
      world: this.world,
      player: {
        name: this.intel_record.player_name,
        id: this.intel_record.player_id,
      },
      alliance: {
        name: this.intel_record.alliance_name,
        id: this.intel_record.alliance_id,
      },
      town: {
        name: this.intel_record.town_name,
        id: this.intel_record.town_id,
      }
    }
  }

}
