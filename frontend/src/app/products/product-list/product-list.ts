import { Component, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Product } from '../product.model';
import { Products } from '../products';

@Component({
  imports: [MatTableModule, RouterLink],
  selector: 'app-product-list',
  styleUrl: './product-list.css',
  templateUrl: './product-list.html',
})
export class ProductList {
  private readonly productsService = inject(Products);

  readonly columns = ['name', 'price', 'stock'];
  readonly products = signal<Product[]>([]);

  constructor() {
    this.productsService.list().subscribe((data) => this.products.set(data));
  }
}
  