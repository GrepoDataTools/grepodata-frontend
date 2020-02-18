import { Component, Inject, OnInit } from "@angular/core";
import { ConquestService } from "../../services/conquest.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-conquest-dialog",
  templateUrl: "./conquest-dialog.component.html",
  styleUrls: ["./conquest-dialog.component.scss"]
})
export class ConquestDialogComponent implements OnInit {
  params: unknown;
  name: string;

  constructor(
    private conquestService: ConquestService,
    public dialogRef: MatDialogRef<ConquestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.params = data.filters;
    this.name = data.name;
  }

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
