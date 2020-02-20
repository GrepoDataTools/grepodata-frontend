import { Component, OnInit } from '@angular/core';
import {ForgotKeysDialog} from "../indexer/indexer.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  constructor(
		public dialog: MatDialog
	) { }

  ngOnInit() {
  }

	public showForgotDialog(): void {
		let dialogRef = this.dialog.open(ForgotKeysDialog, {
			// width: '600px',
			// height: '90%'
			autoFocus: false
		});

		dialogRef.afterClosed().subscribe(result => {});
	}

}
