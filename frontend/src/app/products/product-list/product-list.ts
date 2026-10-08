import { Component, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { Product } from '../product.model';
import { Products } from '../products';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  imports: [MatTableModule, RouterLink, MatButtonModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatProgressBarModule],
  selector: 'app-product-list',
  styleUrl: './product-list.css',
  templateUrl: './product-list.html',
})
export class ProductList {
  private readonly productsService = inject(Products);
  readonly total = signal(0);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly columns = ['name', 'price', 'stock', 'actions'];
  readonly products = signal<Product[]>([]);
  readonly minPrice = signal<number | null>(null);
  readonly maxPrice = signal<number | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.productsService
      .list(this.pageIndex() + 1, this.pageSize(), this.minPrice(), this.maxPrice())
      .subscribe({
        next: (res) => {
          this.products.set(res.data);
          this.total.set(res.total);
          this.loading.set(false);
        },
        error: () => {
          this.products.set([]);
          this.total.set(0);
          this.error.set('Could not load products. Check that the server is running and try again.');
          this.loading.set(false);
        },
      });
  }

  onPage(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.load();
  }

  delete(product: Product) {
    if (!confirm(`Delete "${product.name}"?`)) return;
    this.productsService.remove(product.id).subscribe(() => this.load());
  }

  applyFilter(min: string, max: string) {
    this.minPrice.set(min === '' ? null : Number(min));
    this.maxPrice.set(max === '' ? null : Number(max));
    this.pageIndex.set(0);
    this.load();
  }

  clearFilter() {
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.pageIndex.set(0);
    this.load();
  }

}
