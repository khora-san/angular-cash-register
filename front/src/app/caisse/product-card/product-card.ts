import { Component, computed, input, output } from '@angular/core';
import { CATEGORIES, Product } from '../../models';
import { EurosPipe } from '../../shared/euros-pipe';

@Component({
  imports: [EurosPipe],
  selector: 'app-product-card',
  styleUrl: './product-card.css',
  templateUrl: './product-card.html',
})
export class ProductCard {
  product = input.required<Product>();
  availableStock = input.required<number>();
  inNote = input<boolean>(false);
  icon = computed(() => CATEGORIES.find((c) => c.code === this.product().category)!.icon);

  selected = output<Product>();

  onSelect() {
    this.selected.emit(this.product());
  }
}
