export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface ProductPage {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}