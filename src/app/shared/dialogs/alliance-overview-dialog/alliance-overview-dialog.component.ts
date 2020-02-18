import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { PlayerService } from "../../services/player.service";
import { AllianceService } from "../../services/alliance.service";
import { Router } from "@angular/router";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { PlayerOverviewDialogComponent } from "../player-overview-dialog/player-overview-dialog.component";

@Component({
  selector: 'app-alliance-overview-dialog',
  templateUrl: './alliance-overview-dialog.component.html',
  styleUrls: ['./alliance-overview-dialog.component.scss'],
  providers: [PlayerService, AllianceService]
})
export class AllianceOverviewDialogComponent implements AfterViewInit {

  world;
  date;
  alliance_id;
  alliance_name;
  hourRaw;
  hourStart;
  data;

  error;
  loading = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    public dialogRef: MatDialogRef<AllianceOverviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private playerService: PlayerService,
    private allianceService: AllianceService,
    public dialog: MatDialog) {
    this.world = dialogData.world;
    this.date = dialogData.date;
    this.alliance_id = dialogData.id;
    this.alliance_name = dialogData.name;

    this.loading = true;
    this.allianceService.loadDayDifferences(this.world, this.date, this.alliance_id)
      .subscribe(
        (response) => this.renderResults(response),
        (error) => {console.log(error); this.error = true; this.loading = false;}
      );
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.cdr.detectChanges();
    setTimeout(_ => this.cdr.detectChanges(), 250);
  }

  ngAfterViewInit() {
    this.cdr.detach();
    this.cdr.detectChanges();
    setTimeout(_ => this.cdr.detectChanges(), 250);
  }

  public openPlayerOverviewdialog(id, name) {
    let dialogRef = this.dialog.open(PlayerOverviewDialogComponent, {
      autoFocus: false,
      data: {
        world: this.world,
        date: this.date,
        id: id,
        name: name
      }
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  onSelect(event) {
    let player = this.data.filter(obj => obj.name === event.series)[0];
    this.dialogRef.close('navigate');
    this.openPlayerOverviewdialog(player.id, player.name);
  }

  renderResults(json) {
    this.data = json;
    this.loading = false;
    this.cdr.detectChanges();
    setTimeout(_ => this.cdr.detectChanges(), 250);
  }

}
