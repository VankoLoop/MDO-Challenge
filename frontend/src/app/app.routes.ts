import { Routes } from '@angular/router';
import { ProductList } from './products/product-list/product-list';
import { ProductDetails } from './products/product-details/product-details';

export const routes: Routes = [
    { path: '', redirectTo: 'products', pathMatch: 'full' },
    { path: 'products', component: ProductList },
    { path: 'products/:id', component: ProductDetails },
];
