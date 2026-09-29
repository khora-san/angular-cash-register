import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Formula, Product } from '../../models';
import { Note } from '../../services/note';
import { EurosPipe } from '../../shared/euros-pipe';

@Component({
  imports: [EurosPipe],
  selector: 'app-formula-picker',
  styleUrl: './formula-picker.css',
  templateUrl: './formula-picker.html',
})
export class FormulaPicker {
  formula = input.required<Formula>();
  products = input.required<Product[]>();
  closed = output<void>();

  protected readonly noteService = inject(Note);

  selectedMain = signal<Product | null>(null);
  selectedDrink = signal<Product | null>(null);
  selectedDessert = signal<Product | null>(null);

  mainCandidates = computed(() =>
    this.products().filter((p) => p.category === this.formula().mainCategory),
  );
  drinkCandidates = computed(() => this.products().filter((p) => p.category === 'BOISSON'));
  dessertCandidates = computed(() => this.products().filter((p) => p.category === 'DESSERT'));

  availableStock(product: Product): number {
    return product.stock - (this.noteService.quantityByProduct().get(product.id) ?? 0);
  }

  canConfirm = computed(
    () =>
      this.selectedMain() !== null &&
      this.selectedDrink() !== null &&
      this.selectedDessert() !== null,
  );

  /**
   * `canConfirm` guards the button in the template, but TypeScript can't infer
   * from that these signals are non-null here — hence the explicit guard.
   */
  onConfirm() {
    const main = this.selectedMain();
    const drink = this.selectedDrink();
    const dessert = this.selectedDessert();
    if (!main || !drink || !dessert) {
      return;
    }
    this.noteService.addFormula(this.formula(), main, drink, dessert);
    this.closed.emit();
  }

  onCancel() {
    this.closed.emit();
  }
}
