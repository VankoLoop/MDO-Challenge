import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './product.model';

@Service()
export class Products {
      private readonly http = inject(HttpClient);

  list(): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:3000/products');
  }
  get(id: number): Observable<Product> {
  return this.http.get<Product>(`http://localhost:3000/products/${id}`);
  }
}
