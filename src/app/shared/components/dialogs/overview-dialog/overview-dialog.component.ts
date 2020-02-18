import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { PlayerService } from "../../../services/player.service";
import { AllianceService } from "../../../services/alliance.service";
import { Router } from "@angular/router";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { PlayerOverviewDialogComponent } from "../player-overview-dialog/player-overview-dialog.component";

@Component({
  selector: 'app-overview-dialog',
  templateUrl: './overview-dialog.component.html',
  styleUrls: ['./overview-dialog.component.scss'],
  providers: [PlayerService, AllianceService]
})
export class OverviewDialogComponent implements AfterViewInit {

  world;
  date;
  hour;
  hourRaw;
  hourStart;
  data;

  error;
  loading = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    public dialogRef: MatDialogRef<OverviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private playerService: PlayerService,
    private allianceService: AllianceService,
    public dialog: MatDialog) {
    this.world = dialogData.world;
    this.date = dialogData.date;
    this.hourRaw = dialogData.hour;
    this.hour = this.hourRaw.replace(":00","").replace(/^0+/, '');
    this.hourStart = (this.hour < 10 ? '0':'') + (this.hour-1) + ':00';

    this.loading = true;
    this.playerService.loadHourDifferences(this.world, this.date, this.hour)
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

  onDefSelect(event) {
    let player = this.data.def.filter(obj => obj.name === event.name);
    this.dialogRef.close('navigate');
    // this.router.navigate(['/player/'+this.world+'/'+player[0].id]);
    this.openPlayerOverviewdialog(player[0].id, event.name);
    this.cdr.detectChanges();
    setTimeout(_ => this.cdr.detectChanges(), 250);
  }

  onAttSelect(event) {
    let player = this.data.att.filter(obj => obj.name === event.name);
    this.dialogRef.close('navigate');
    // this.router.navigate(['/player/'+this.world+'/'+player[0].id]);
    this.openPlayerOverviewdialog(player[0].id, event.name);
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

  renderResults(json) {
    this.data = json;
    this.loading = false;
    //console.log(json);
    this.cdr.detectChanges();
    setTimeout(_ => this.cdr.detectChanges(), 250);
  }

}
