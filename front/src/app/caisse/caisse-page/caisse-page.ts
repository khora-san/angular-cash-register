import { Component, inject, signal } from '@angular/core';
import { CATEGORIES, Category, Formula, Product } from '../../models';
import { Catalog } from '../../services/catalog';
import { ProductCard } from '../product-card/product-card';
import { Note } from '../../services/note';
import { NotePanel } from '../note-panel/note-panel';
import { FormulaPicker } from '../formula-picker/formula-picker';
import { EurosPipe } from '../../shared/euros-pipe';

@Component({
  imports: [ProductCard, NotePanel, FormulaPicker, EurosPipe],
  selector: 'app-caisse-page',
  styleUrl: './caisse-page.css',
  templateUrl: './caisse-page.html',
})
export class CaissePage {
  private readonly catalogService = inject(Catalog);
  products = signal<Product[]>([]);
  protected readonly categories = CATEGORIES;
  protected readonly noteService = inject(Note);
  formulas = signal<Formula[]>([]);
  openFormula = signal<Formula | null>(null);

  protected readonly drinkIcon = CATEGORIES.find((c) => c.code === 'BOISSON')!.icon;
  protected readonly dessertIcon = CATEGORIES.find((c) => c.code === 'DESSERT')!.icon;

  availableStock(product: Product): number {
    return product.stock - (this.noteService.quantityByProduct().get(product.id) ?? 0);
  }

  constructor() {
    this.loadProducts();
    this.loadFormulas();
  }

  loadProducts() {
    this.catalogService.getProducts().subscribe((products) => this.products.set(products));
  }

  productsIn(category: Category) {
    return this.products().filter((p) => p.category === category);
  }

  loadFormulas() {
    this.catalogService.getFormulas().subscribe((formulas) => this.formulas.set(formulas));
  }

  isFormulaAvailable(formula: Formula): boolean {
    const hasAvailableProduct = (category: Category) =>
      this.productsIn(category).some((p) => this.availableStock(p) > 0);
    return (
      hasAvailableProduct(formula.mainCategory) &&
      hasAvailableProduct('BOISSON') &&
      hasAvailableProduct('DESSERT')
    );
  }

  formulaMainIcon(formula: Formula): string {
    return CATEGORIES.find((c) => c.code === formula.mainCategory)!.icon;
  }
}
