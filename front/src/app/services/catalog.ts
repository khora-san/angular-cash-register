import { inject, Service } from '@angular/core';
import { API_URL } from '../api';
import { HttpClient } from '@angular/common/http';
import { Formula, Product } from '../models';
import { Observable } from 'rxjs';

@Service()
export class Catalog {
  private readonly http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${API_URL}/products`);
  }

  getFormulas(): Observable<Formula[]> {
    return this.http.get<Formula[]>(`${API_URL}/formulas`);
  }
}
