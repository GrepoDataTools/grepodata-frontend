import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HOSTING_COST_PER_MONTH } from '../shared/hosting-cost';

const apiUrl = environment.apiUrl;
const HOSTING_COST = HOSTING_COST_PER_MONTH;

export interface DonationKpi {
  total: number;
  percent: number;
  tier: 'red' | 'orange' | 'green';
}

export function formatDonationAmount(value: number): string {
  const num = +value || 0;
  return Number.isInteger(num) ? `${num}` : num.toFixed(2);
}

@Injectable()
export class DonationService {

  // shareReplay(1) ensures this endpoint is only ever requested once, no matter how many
  // components subscribe to getDonationKpi()
  private state$: Observable<DonationKpi> = this.http.get<{ total: number }>(apiUrl + '/donations/get-donation-state').pipe(
    map((res) => this.toState(res.total)),
    shareReplay(1)
  );

  constructor(private http: HttpClient) {}

  getAllDonations() {
    let url = '/donations/get-all-donations';
    return this.http.get(apiUrl + url);
  }

  getDonationKpi(): Observable<DonationKpi> {
    return this.state$;
  }

  private toState(total: number): DonationKpi {
    const percent = Math.round((total / HOSTING_COST) * 100);
    const tier = percent < 40 ? 'red' : percent < 80 ? 'orange' : 'green';
    return { total, percent, tier };
  }

}

