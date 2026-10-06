import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './product.model';

export type ProductInput = Omit<Product, 'id'>;

@Service()
export class Products {
      private readonly http = inject(HttpClient);


  list(): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:3000/products');
  }
  get(id: number): Observable<Product> {
  return this.http.get<Product>(`http://localhost:3000/products/${id}`);
  }
  create(input: ProductInput): Observable<Product> {
  return this.http.post<Product>('http://localhost:3000/products', input);
}
}
