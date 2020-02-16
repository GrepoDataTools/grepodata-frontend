import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {IndexerService} from '../../shared/services/indexer.service';
import {LocalStorageService} from '../../shared/services/local-storage.service';

@Component({
  selector: 'intel-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [IndexerService, LocalStorageService]
})
export class IndexTableComponent implements OnInit, AfterViewInit {
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

  csa = false;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private indexerService: IndexerService,
    public cdr: ChangeDetectorRef
  ) { }

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

    // Check cleanup token
    this.csa = LocalStorageService.get('csa'+this.key);
  }

  deleteIntel(id) {
    if (this.csa != false) {
      LocalStorageService.set('csa'+this.key, this.csa, (31 * 24 * 60));
      this.indexerService.deleteRecordById(this.csa, this.key, id).subscribe(_=>{});
    }
  }

  deleteIntelUndo(id) {
    if (this.csa != false) {
      LocalStorageService.set('csa'+this.key, this.csa, (31 * 24 * 60));
      this.indexerService.deleteRecordUndo(this.csa, this.key, id).subscribe(_=>{});
    }
  }

  cleanupLogout() {
    LocalStorageService.set('csa'+this.key, false, 0);
    this.csa = false;
    this.router.navigate(['/indexer/'+this.key]);
  }

  ngAfterViewInit() {
    this.cdr.detach();
    this.loading = false;
    this.cdr.detectChanges();
  }

  public openBBdialog() {
    let dataBB = {
      data: this.iterator,
      contains_duplicates: this.containsDuplicates,
      key: this.key,
      world: this.world,
      id: this.id,
      name: this.playerName,
      a_name: this.allianceName
    };

    // let dialogRef = this.dialog.open(BBDialog, {
    //   autoFocus: false,
    //   data: {
    //     dataBB: dataBB,
    //     type: 'player_' + this.type
    //   }
    // });
    //
    // dialogRef.afterClosed().subscribe(result => {});
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