import { Component, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Product } from '../product.model';
import { Products } from '../products';

@Component({
  imports: [MatTableModule, RouterLink, MatButtonModule],
  selector: 'app-product-list',
  styleUrl: './product-list.css',
  templateUrl: './product-list.html',
})
export class ProductList {
  private readonly productsService = inject(Products);

  readonly columns = ['name', 'price', 'stock', 'actions'];
  readonly products = signal<Product[]>([]);

  constructor() {
    this.load();
  }

  load() {
    this.productsService.list().subscribe((data) => this.products.set(data));
  }

  delete(product: Product) {
    if (!confirm(`Delete "${product.name}"?`)) return;
    this.productsService.remove(product.id).subscribe(() => this.load());
  }
}
  