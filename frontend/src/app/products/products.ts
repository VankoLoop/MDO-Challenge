import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductPage } from './product.model';

export type ProductInput = Omit<Product, 'id'>;

@Service()
export class Products {
  
  private readonly http = inject(HttpClient);

  list(): Observable<ProductPage> {
  return this.http.get<ProductPage>('http://localhost:3000/products');
  }
  get(id: number): Observable<Product> {
  return this.http.get<Product>(`http://localhost:3000/products/${id}`);
  }
  create(input: ProductInput): Observable<Product> {
  return this.http.post<Product>('http://localhost:3000/products', input);
  }
  update(id: number, input: Partial<ProductInput>): Observable<Product> {
  return this.http.patch<Product>(`http://localhost:3000/products/${id}`, input);
  }
  remove(id: number): Observable<Product> {
  return this.http.delete<Product>(`http://localhost:3000/products/${id}`);
  }
}
