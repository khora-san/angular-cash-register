import { Component, inject, signal } from '@angular/core';
import { CATEGORIES, Category, Product } from '../../models';
import { Catalog } from '../../services/catalog';
import { ProductCard } from '../product-card/product-card';

@Component({
  imports: [ProductCard],
  selector: 'app-caisse-page',
  styleUrl: './caisse-page.css',
  templateUrl: './caisse-page.html',
})
export class CaissePage {
  private readonly catalogService = inject(Catalog);
  products = signal<Product[]>([]);
  protected readonly categories = CATEGORIES;

  constructor() {
    this.loadProducts();
  }

  loadProducts() {
    this.catalogService.getProducts().subscribe((products) => this.products.set(products));
  }

  productsIn(category: Category) {
    return this.products().filter((p) => p.category === category);
  }
}
