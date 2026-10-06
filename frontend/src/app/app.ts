import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ProductList} from './products/product-list/product-list';
@Component({
  imports: [RouterOutlet, ProductList],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');
}
