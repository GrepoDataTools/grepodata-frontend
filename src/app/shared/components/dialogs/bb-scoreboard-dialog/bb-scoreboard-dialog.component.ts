import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { GoogleAnalyticsEventsService } from "../../../services/google-analytics-events.service";

@Component({
  selector: 'app-bb-scoreboard-dialog',
  templateUrl: './bb-scoreboard-dialog.component.html',
  styleUrls: ['./bb-scoreboard-dialog.component.scss']
})
export class BbScoreboardDialogComponent {

  type: any;
  typeDisplay: any;
  typeBB: any;
  dataBB: any;
  generated_at : any;
  copied = false;
  slider: any = 10;

  constructor(
    public dialogRef: MatDialogRef<BbScoreboardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
    this.type = data.type;

    if (this.type == 'players_att' || this.type == 'players_def' || this.type == 'players_con' || this.type == 'players_los') {
      this.typeDisplay = 'Player';
      this.typeBB = 'player';
    } else if (this.type == 'alliances_att' || this.type == 'alliances_def' || this.type == 'alliances_con' || this.type == 'alliances_los') {
      this.typeDisplay = 'Alliance';
      this.typeBB = 'ally';
      this.slider = 15;
    }

    this.dataBB = data.dataBB;
    this.generated_at = new Date().toLocaleString();

    try {
      this.googleAnalyticsEventsService.emitEvent("BB_scoreboard", "copyBBscore", "copyBBscore", 1);
    } catch (e) {}
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  copyBB() {
    let selection = window.getSelection();
    let txt = document.getElementById('bb_code');
    let range = document.createRange();
    range.selectNodeContents(txt);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();
    this.copied = true;
  }

}
