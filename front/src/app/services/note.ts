import { computed, Service, signal } from '@angular/core';
import { Product } from '../models';

export interface ProductLine {
  product: Product;
  quantity: number;
}

@Service()
export class Note {
  private readonly linesSignal = signal<ProductLine[]>([]);
  readonly lines = this.linesSignal.asReadonly();
  readonly total = computed(() =>
    this.lines().reduce((sum, line) => sum + line.product.price * line.quantity, 0),
  );
  readonly quantityByProduct = computed(() => {
    const map = new Map<number, number>();
    for (const line of this.lines()) {
      map.set(line.product.id, line.quantity);
    }
    return map;
  });

  /**
   * Adds a product to the note, or increments its quantity if it's already there.
   * Rebuilds a new array rather than mutating in place, so the signal's change
   * detection (reference equality) picks it up.
   */
  add(product: Product) {
    this.linesSignal.update((lines) => {
      const existing = lines.find((line) => line.product.id === product.id);
      if (existing) {
        return lines.map((line) =>
          line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line,
        );
      }
      return [...lines, { product, quantity: 1 }];
    });
  }

  decrease(product: Product) {
    this.linesSignal.update((lines) =>
      lines
        .map((line) =>
          line.product.id === product.id ? { ...line, quantity: line.quantity - 1 } : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }

  remove(product: Product) {
    this.linesSignal.update((lines) => lines.filter((line) => line.product.id !== product.id));
  }

  clear() {
    this.linesSignal.set([]);
  }
}
