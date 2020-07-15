import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {BBDialog} from "../indexer.component";
import {MatDialog} from "@angular/material/dialog";
import {LocalCacheService} from "../../services/local-cache.service";
import {IndexerService} from "../indexer.service";
import {Router} from "@angular/router";
import {Globals} from '../../globals';

@Component({
  selector: 'intel-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [IndexerService]
})
export class TableComponent implements OnInit, AfterViewInit {
  @Input() type: string;
  @Input() containsDuplicates: boolean = false;
  @Input() seaTowns: any = [];
  @Input() landTowns: any = [];
  @Input() key: string;
  @Input() world: string;
  @Input() id: any;
  @Input() playerName: any;
  @Input() allianceName: any;
  @Input() parentType: string = 'player'; // Parent component is either player or alliance

  tableHeader:string = '';
  headerClass:string = '';
  iterator:any = [];
  isSeaUnit = false;
  isLandUnit = false;
  loading = true;
  showNonPriority = false;
  hideAvailable = false;

  private csa = false;

  constructor(
    private globals: Globals,
    private router: Router,
    public dialog: MatDialog,
    private indexerService: IndexerService,
    private cdr: ChangeDetectorRef) {
    globals.duplicateVisChange.subscribe(visible => {
      if (this.parentType == 'player' && this.hideAvailable && this.showNonPriority != visible) {
        this.showNonPriority = visible;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnInit() {
    switch (this.type) {
      case 'fire':
        this.tableHeader = this.world.substring(0, 2)=='en'?'Light ships':'Fireships';
        this.headerClass = '';
        this.iterator = this.seaTowns;
        this.isSeaUnit = true;
        break;
      case 'bir':
        this.tableHeader = 'Biremes';
        this.headerClass = 'blue';
        this.iterator = this.seaTowns;
        this.isSeaUnit = true;
        break;
      case 'trir':
        this.tableHeader = 'Trirems';
        this.headerClass = 'orange';
        this.iterator = this.seaTowns;
        this.isSeaUnit = true;
        break;
      case 'myth':
        this.tableHeader = 'Mythical units';
        this.headerClass = '';
        this.iterator = this.landTowns;
        this.isLandUnit = true;
        break;
      case 'off':
        this.tableHeader = 'Offensive units';
        this.headerClass = '';
        this.iterator = this.landTowns;
        this.isLandUnit = true;
        break;
      case 'def':
        this.tableHeader = 'Defensive units';
        this.headerClass = 'blue';
        this.iterator = this.landTowns;
        this.isLandUnit = true;
        break;
      default:
        this.tableHeader = 'Units';
        this.iterator = [];
    }
    this.hideAvailable = this.containsDuplicates && this.iterator.length > (this.parentType == 'player' ? 10 : 6);
    this.showNonPriority = !this.hideAvailable;
    if (this.hideAvailable && this.parentType == 'player') {
      this.showNonPriority = this.globals.get_show_duplicates();
    }

    // Check cleanup token
    this.csa = LocalCacheService.get('csa'+this.key);
  }

  deleteIntel(id) {
    if (this.csa != false) {
      LocalCacheService.set('csa'+this.key, this.csa, (31 * 24 * 60));
      this.indexerService.deleteRecordById(this.csa, this.key, id).subscribe(_=>{});
    }
  }

  deleteIntelUndo(id) {
    if (this.csa != false) {
      LocalCacheService.set('csa'+this.key, this.csa, (31 * 24 * 60));
      this.indexerService.deleteRecordUndo(this.csa, this.key, id).subscribe(_=>{});
    }
  }

  cleanupLogout() {
    LocalCacheService.set('csa'+this.key, false, 0);
    this.csa = false;
    this.router.navigate(['/indexer/'+this.key]);
  }

  ngAfterViewInit() {
    this.cdr.detach();
    this.loading = false;
    this.cdr.detectChanges();
  }

  saveDuplicateVisibility() {
    if (this.parentType == 'player') {
      this.globals.set_show_duplicates(this.showNonPriority);
    }
  }

  public openBBdialog(type) {
    let dataBB = {
      data: this.iterator,
      contains_duplicates: this.containsDuplicates,
      key: this.key,
      world: this.world,
      id: this.id,
      name: this.playerName,
      a_name: this.allianceName
    };

    let dialogRef = this.dialog.open(BBDialog, {
      autoFocus: false,
      data: {
        dataBB: dataBB,
        type: 'player_' + this.type
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }
}

// export interface SeaUnitTown {
// 	town_id: any,
// 	town_name: any,
// 	date: any,
// 	units: any,
// 	count: any,
// }
//
// export interface LandUnitTown {
// 	town_id: any,
// 	town_name: any,
// 	date: any,
// 	units: Unit[],
// }
//
// export interface Unit {
// 	name: any,
// 	count: any,
// 	killed: any,
// }