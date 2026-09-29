import { Component, computed, inject, signal } from '@angular/core';
import { CATEGORIES, Category, DailyTotal, Formula, Product } from '../../models';
import { Catalog } from '../../services/catalog';
import { ProductCard } from '../product-card/product-card';
import { Note } from '../../services/note';
import { NotePanel } from '../note-panel/note-panel';
import { FormulaPicker } from '../formula-picker/formula-picker';
import { EurosPipe } from '../../shared/euros-pipe';
import { Orders } from '../../services/orders';
import { formatDate } from '@angular/common';
import { DailyTotals } from '../daily-totals/daily-totals';
import { Router } from '@angular/router';
import { Auth } from '../../auth/auth';
import { Brand } from '../../shared/brand/brand';

@Component({
  imports: [ProductCard, NotePanel, FormulaPicker, EurosPipe, DailyTotals, Brand],
  selector: 'app-caisse-page',
  styleUrl: './caisse-page.css',
  templateUrl: './caisse-page.html',
})
export class CaissePage {
  private readonly catalogService = inject(Catalog);
  protected readonly noteService = inject(Note);
  private readonly ordersService = inject(Orders);
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);

  products = signal<Product[]>([]);
  formulas = signal<Formula[]>([]);
  openFormula = signal<Formula | null>(null);
  dailyTotals = signal<DailyTotal[]>([]);
  todayTotal = computed(() => this.dailyTotals().find((dt) => dt.day === this.today)?.total ?? 0);

  protected readonly categories = CATEGORIES;
  protected readonly drinkIcon = CATEGORIES.find((c) => c.code === 'BOISSON')!.icon;
  protected readonly dessertIcon = CATEGORIES.find((c) => c.code === 'DESSERT')!.icon;
  protected readonly today = formatDate(new Date(), 'yyyy-MM-dd', 'fr');

  availableStock(product: Product): number {
    return product.stock - (this.noteService.quantityByProduct().get(product.id) ?? 0);
  }

  constructor() {
    this.loadProducts();
    this.loadFormulas();
    this.loadDailyTotals();
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

  loadDailyTotals() {
    this.ordersService
      .getDailyTotals()
      .subscribe((dailyTotals) => this.dailyTotals.set(dailyTotals));
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.noteService.clear();
      this.router.navigateByUrl('/login');
    });
  }

  isInNote(product: Product): boolean {
    return (this.noteService.quantityByProduct().get(product.id) ?? 0) > 0;
  }
}
