import { inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { formatCurrency } from '@angular/common';

@Pipe({
  name: 'euros',
})
export class EurosPipe implements PipeTransform {
  private readonly locale = inject(LOCALE_ID);

  transform(cents: number): string {
    return formatCurrency(cents / 100, this.locale, '€');
  }
}
