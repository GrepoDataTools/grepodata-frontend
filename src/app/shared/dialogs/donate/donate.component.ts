import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import * as moment from 'moment';
import {Globals} from '../../../globals';
import {GoogleAnalyticsEventsService} from "../../../services/google-analytics-events.service";
import {DonationService} from "../../../services/donation.service";
import {formatDonationAmount} from "../../../services/donation.service";
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
  showProof = false;
  targetPercent = 0;
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

  donationChartColors = ['#CBD5E1', '#0E7C67'];
  donationChartLabels = ['Google AdSense', 'Donations'];

  formatAmount(value: number): string {
    return formatDonationAmount(value);
  }

  private renderChart(response: any): void {
    const allDonations: any[] = response?.items || [];
    const donations = allDonations.filter((row) => row.name !== 'Google AdSense');
    const adsense = allDonations.filter((row) => row.name === 'Google AdSense');
    const cutoff = moment().subtract(MONTHS_SHOWN - 1, 'months').startOf('month');

    // ad revenue is automated, not a human supporter, so it's excluded from the table and marquee
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

    const totalFor = (rows: any[], month: moment.Moment) => rows
      .filter((row) => moment(row.date, 'YYYY-MM-DD HH:mm:ss').isSame(month, 'month'))
      .reduce((sum, row) => sum + (+row.donation || 0), 0);

    // bottom-up stacking order: AdSense forms the base, donations stack on top; a month with nothing in it renders no color
    this.chartData = months.map((month) => ({
      name: month.format('MMM YYYY'),
      series: [
        { value: totalFor(adsense, month) },
        { value: totalFor(donations, month) }
      ]
    }));

    const currentMonth = months[months.length - 1];
    const currentMonthTotal = totalFor(adsense, currentMonth) + totalFor(donations, currentMonth);
    this.targetPercent = Math.round((currentMonthTotal / HOSTING_COST) * 100);
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
