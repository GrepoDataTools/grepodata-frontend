import { AfterViewInit, ChangeDetectorRef, Component, Inject } from "@angular/core";
import { PlayerService } from "../../services/player.service";
import { AllianceService } from "../../services/alliance.service";
import { Router } from "@angular/router";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-player-overview-dialog',
  templateUrl: './player-overview-dialog.component.html',
  styleUrls: ['./player-overview-dialog.component.scss'],
  providers: [PlayerService, AllianceService]
})
export class PlayerOverviewDialogComponent implements AfterViewInit {

  world;
  date;
  player_id;
  player_name;
  hourRaw;
  hourStart;
  data;

  error;
  loading = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    public dialogRef: MatDialogRef<PlayerOverviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private playerService: PlayerService,
    private allianceService: AllianceService,
    public dialog: MatDialog) {
    this.world = dialogData.world;
    this.date = dialogData.date;
    this.player_id = dialogData.id;
    this.player_name = dialogData.name;
    console.log(this.player_id);
    console.log(this.player_name);

    this.loading = true;
    this.playerService.loadDayDifferences(this.world, this.date, this.player_id)
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

  public openOverviewDialog(hour) {
    // TODO
    // let dialogRef = this.dialog.open(OverviewDialogComponent, {
    //   // width: '90%',
    //   // height: '80%',
    //   autoFocus: false,
    //   data: {
    //     world: this.world,
    //     date: this.date,
    //     hour: hour
    //   }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result === 'navigate') {
    //     this.onNoClick();
    //     this.cdr.detectChanges();
    //     setTimeout(_ => this.cdr.detectChanges(), 250);
    //   }
    // });
    // this.cdr.detectChanges();
    // setTimeout(_ => this.cdr.detectChanges(), 250);
  }

  onSelect(event) {
    let hour = event.series;
    this.dialogRef.close('navigate');
    this.openOverviewDialog(hour);
  }

  renderResults(json) {
    this.data = json;
    this.loading = false;
    this.cdr.detectChanges();
    setTimeout(_ => this.cdr.detectChanges(), 250);
  }
}
