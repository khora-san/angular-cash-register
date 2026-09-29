import { inject, Service } from '@angular/core';
import { API_URL } from '../api';
import { HttpClient } from '@angular/common/http';
import { Order, OrderRequest } from '../models';
import { Observable } from 'rxjs';

@Service()
export class Orders {
  private readonly http = inject(HttpClient);

  pay(request: OrderRequest): Observable<Order> {
    return this.http.post<Order>(`${API_URL}/orders`, request);
  }
}
