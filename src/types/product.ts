// Shape returned by DummyJSON for a single product
export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  thumbnail: string;
  images: string[];
}

// GET /products response shape
export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// GET /products/categories returns list of category objects in newer API versions,
// but DummyJSON also historically returns plain strings — we normalise to strings
// in the service layer, so the app always deals with string[].
export type CategoryList = string[];

// Payload for POST /products/add (and for locally-added products before an id is assigned)
export interface NewProductPayload {
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  brand: string;
  thumbnail: string;
  rating: number;
}

// Sort options supported by the listing page
export type SortField = "price" | "rating";
export type SortOrder = "asc" | "desc";

export interface SortOption {
  field: SortField;
  order: SortOrder;
}

// Filter/search/sort/pagination state shape used by the products slice
export interface ProductQueryState {
  search: string;
  category: string | null;
  sort: SortOption | null;
  page: number;
  pageSize: number;
}
