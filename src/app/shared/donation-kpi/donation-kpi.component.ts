import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DonationService } from '../../services/donation.service';
import { formatDonationAmount } from '../../services/donation.service';
import { DonateDialog } from '../dialogs/donate/donate.component';
import { HOSTING_COST_PER_MONTH } from '../hosting-cost';

@Component({
  selector: 'app-donation-kpi',
  templateUrl: './donation-kpi.component.html',
  host: { class: 'inline-flex' },
})
export class DonationKpiComponent implements OnInit {
  @Input() dark = false;

  loading = true;
  percent = 0;
  tier: 'red' | 'orange' | 'green' = 'red';
  tooltip = 'Donations this month — click to donate';

  constructor(
    private donationService: DonationService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.donationService.getDonationKpi().subscribe((state) => {
      this.percent = state.percent;
      this.tier = state.tier;
      this.tooltip = `Current month funding: €${formatDonationAmount(state.total)} of €${HOSTING_COST_PER_MONTH} hosting cost (${state.percent}% funded) — click to donate`;
      this.loading = false;
      // ensures the view updates even when embedded under an OnPush ancestor (e.g. the infeed ad)
      this.cdr.markForCheck();
    });
  }

  openDonate(): void {
    this.dialog.open(DonateDialog, { autoFocus: false });
  }

  get badgeClasses(): string {
    if (this.loading) {
      return this.dark ? 'bg-white/10 text-slate-400' : 'bg-slate-100 text-slate-400';
    }
    const palette = {
      red: this.dark ? 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25' : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20 hover:bg-rose-100',
      orange: this.dark ? 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25' : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 hover:bg-amber-100',
      green: this.dark ? 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25' : 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/25 hover:bg-emerald-100',
    };
    return palette[this.tier];
  }
}
