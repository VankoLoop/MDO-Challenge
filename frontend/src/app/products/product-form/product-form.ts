import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Products } from '../products';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './product-form.html',
})
export class ProductForm {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly products = inject(Products);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);
  private readonly idParam = this.route.snapshot.paramMap.get('id');

  readonly id = this.idParam ? Number(this.idParam) : null;
  readonly isEdit = this.id !== null;
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    price: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
  });

  constructor() {
    if (this.id !== null) {
      this.products.get(this.id).subscribe({
        next: (p) => this.form.patchValue(p),
        error: () => this.error.set('Product not found.'),
      });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.error.set(null);
    const value = this.form.getRawValue();
    const request =
      this.id !== null
        ? this.products.update(this.id, value)
        : this.products.create(value);

    request.subscribe({
      next: () => {
        this.snackBar.open(this.isEdit ? 'Product updated' : 'Product created', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/products']);
      },
      error: () => {
        this.error.set('Could not save the product.');
        this.saving.set(false);
      },
    });
  }
}