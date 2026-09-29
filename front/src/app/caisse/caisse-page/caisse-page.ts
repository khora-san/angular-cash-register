import { Component, inject, signal } from '@angular/core';
import { CATEGORIES, Category, Product } from '../../models';
import { Catalog } from '../../services/catalog';
import { ProductCard } from '../product-card/product-card';
import { Note } from '../../services/note';
import { NotePanel } from '../note-panel/note-panel';

@Component({
  imports: [ProductCard, NotePanel],
  selector: 'app-caisse-page',
  styleUrl: './caisse-page.css',
  templateUrl: './caisse-page.html',
})
export class CaissePage {
  private readonly catalogService = inject(Catalog);
  products = signal<Product[]>([]);
  protected readonly categories = CATEGORIES;
  protected readonly noteService = inject(Note);

  availableStock(product: Product): number {
    return product.stock - (this.noteService.quantityByProduct().get(product.id) ?? 0);
  }

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
