import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import * as moment from 'moment';
import {Globals} from '../../../globals';
import {GoogleAnalyticsEventsService} from "../../../services/google-analytics-events.service";
import {DonationService} from "../../../services/donation.service";
import {HOSTING_COST_PER_MONTH} from "../../hosting-cost";

const HOSTING_COST = HOSTING_COST_PER_MONTH;
const MONTHS_SHOWN = 12;
const POSITIVE_EMOJIS = ['🎉', '🥳', '❤️', '🙌', '👏', '🔥', '⭐', '💪', '🚀', '🤗', '😍', '✨'];

@Component({
  selector: 'app-donate-dialog',
  templateUrl: './donate.component.html'
})
export class DonateDialog implements OnInit {

  chartLoading = true;
  chartData: any[] = [];
  rawDonations: any[] = [];
  marqueeDonations: any[] = [];
  listExpanded = false;
  showProof = false;
  readonly hostingCost = HOSTING_COST_PER_MONTH;

  constructor(
    public dialog: MatDialog,
    private globals: Globals,
    public dialogRef: MatDialogRef<DonateDialog>,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    private donationService: DonationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.addPanelClass('team-dialog');
    try {
      this.googleAnalyticsEventsService.emitEvent("donate", "openDonateDialog", "openDonateDialog", 1);
    } catch (e) {
      console.log(e);
    }
  }

  ngOnInit(): void {
    this.donationService.getAllDonations().subscribe(
      (response: any) => this.renderChart(response),
      (error) => { this.chartLoading = false; }
    );
  }

  donationChartColor = (name: string) => name === 'Hosting costs' ? '#F97316' : '#2A78D6';

  donationChartWidth = (name: string) => name === 'Hosting costs' ? 3 : 2;

  toggleList(): void {
    this.listExpanded = !this.listExpanded;
  }

  toggleNote(row: any): void {
    row.noteExpanded = !row.noteExpanded;
  }

  private renderChart(response: any): void {
    const donations: any[] = response?.items || [];
    const cutoff = moment().subtract(MONTHS_SHOWN - 1, 'months').startOf('month');

    this.rawDonations = donations
      .filter((row) => moment(row.date, 'YYYY-MM-DD HH:mm:ss').isSameOrAfter(cutoff))
      .sort((a, b) => moment(b.date, 'YYYY-MM-DD HH:mm:ss').valueOf() - moment(a.date, 'YYYY-MM-DD HH:mm:ss').valueOf())
      .map((row) => ({
        ...row,
        noteText: row.note ? row.note.replace(/<[^>]*>/g, '').trim() : '',
        dateText: moment(row.date, 'YYYY-MM-DD HH:mm:ss').format('D MMM YYYY')
      }));

    this.marqueeDonations = this.rawDonations.map((row) => ({
      ...row,
      emoji: POSITIVE_EMOJIS[Math.floor(Math.random() * POSITIVE_EMOJIS.length)]
    }));

    // Build the last MONTHS_SHOWN month-start dates, oldest first, including the current month
    const months = [];
    for (let i = MONTHS_SHOWN - 1; i >= 0; i--) {
      months.push(moment().subtract(i, 'months').startOf('month'));
    }

    const totals = months.map((month) => {
      const total = donations
        .filter((row) => moment(row.date, 'YYYY-MM-DD HH:mm:ss').isSame(month, 'month'))
        .reduce((sum, row) => sum + (+row.donation || 0), 0);
      return { name: month.format('YYYY-MM-DD'), value: total };
    });

    this.chartData = [
      { name: 'Donations', series: totals },
      { name: 'Hosting costs', series: months.map((month) => ({ name: month.format('YYYY-MM-DD'), value: HOSTING_COST })) }
    ];
    this.chartLoading = false;
  }

  close(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  copyText(target) {
    let selection = window.getSelection();
    let txt = document.getElementById(target);
    let range = document.createRange();
    range.selectNodeContents(txt);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();
    this.globals.showSnackbar(
      `<h4>Copied to clipboard</h4>`,
      'success', '', true,5000);
  }

}
