import { computed, Service, signal } from '@angular/core';
import { Formula, Product } from '../models';

export interface ProductLine {
  kind: 'product';
  product: Product;
  quantity: number;
}

export interface FormulaLine {
  kind: 'formula';
  id: string;
  formula: Formula;
  main: Product;
  drink: Product;
  dessert: Product;
}

export type NoteLine = ProductLine | FormulaLine;

@Service()
export class Note {
  private readonly linesSignal = signal<NoteLine[]>([]);
  readonly lines = this.linesSignal.asReadonly();

  /**
   * Sums both product lines (unit price × quantity) and formula lines (fixed price),
   * discriminated by `kind`.
   */
  readonly total = computed(() =>
    this.lines().reduce(
      (sum, line) =>
        sum + (line.kind === 'product' ? line.product.price * line.quantity : line.formula.price),
      0,
    ),
  );

  /**
   * Reserved quantity per product, keyed by product id. A formula line reserves
   * one unit of each of its main/drink/dessert products, in addition to plain
   * product lines' quantities.
   */
  readonly quantityByProduct = computed(() => {
    const map = new Map<number, number>();
    const add = (productId: number, amount: number) => {
      map.set(productId, (map.get(productId) ?? 0) + amount);
    };
    for (const line of this.lines()) {
      if (line.kind === 'product') {
        add(line.product.id, line.quantity);
      } else {
        add(line.main.id, 1);
        add(line.drink.id, 1);
        add(line.dessert.id, 1);
      }
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
      const existing = lines.find(
        // type predicate function : "if return true, the value is a ProductLine"
        (line): line is ProductLine => line.kind === 'product' && line.product.id === product.id,
      );
      if (existing) {
        return lines.map((line) =>
          line.kind === 'product' && line.product.id === product.id
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        );
      }
      return [...lines, { kind: 'product', product, quantity: 1 }];
    });
  }

  decrease(product: Product) {
    this.linesSignal.update((lines) =>
      lines
        .map((line) =>
          line.kind === 'product' && line.product.id === product.id
            ? { ...line, quantity: line.quantity - 1 }
            : line,
        )
        .filter((line) => line.kind !== 'product' || line.quantity > 0),
    );
  }

  remove(product: Product) {
    this.linesSignal.update((lines) =>
      lines.filter((line) => !(line.kind === 'product' && line.product.id === product.id)),
    );
  }

  clear() {
    this.linesSignal.set([]);
  }

  addFormula(formula: Formula, main: Product, drink: Product, dessert: Product) {
    const line: FormulaLine = {
      kind: 'formula',
      id: crypto.randomUUID(),
      formula,
      main,
      drink,
      dessert,
    };
    this.linesSignal.update((lines) => [...lines, line]);
  }

  removeFormula(lineId: string) {
    this.linesSignal.update((lines) =>
      lines.filter((line) => !(line.kind === 'formula' && line.id === lineId)),
    );
  }
}
