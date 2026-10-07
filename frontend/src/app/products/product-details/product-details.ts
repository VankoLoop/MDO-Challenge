import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../product.model';
import { Products } from '../products';

@Component({
  imports: [RouterLink],
  selector: 'app-product-details',
  styleUrl: './product-details.css',
  templateUrl: './product-details.html',
})
export class ProductDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly products = inject(Products);

  readonly product = signal<Product | null>(null);
  readonly error = signal<string | null>(null);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.products.get(id).subscribe({
      next: (p) => this.product.set(p),
      error: () => this.error.set('Product not found.'),
    });
  }
}
