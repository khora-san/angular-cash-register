import { Component, input } from '@angular/core';
import { DatePipe, formatDate } from '@angular/common';
import { DailyTotal } from '../../models';
import { EurosPipe } from '../../shared/euros-pipe';

@Component({
  imports: [DatePipe, EurosPipe],
  selector: 'app-daily-totals',
  styleUrl: './daily-totals.css',
  templateUrl: './daily-totals.html',
})
export class DailyTotals {
  dailyTotals = input.required<DailyTotal[]>();

  protected readonly today = formatDate(new Date(), 'yyyy-MM-dd', 'fr');
}
