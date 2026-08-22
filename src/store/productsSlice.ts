import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product, SortOption } from "../types/product";

interface ProductsState {
  // Query/UI state — kept global so it persists across navigating to a
  // product's detail page and back to the listing.
  search: string;
  category: string | null;
  sort: SortOption | null;
  page: number;
  pageSize: number;

  // Products added via the "Add Product" form. The assignment only requires
  // these to exist locally (no permanent API storage), so we keep them in
  // the store and merge them into the listing at render/selection time.
  locallyAddedProducts: Product[];

  // Favourite product ids — a small bonus feature that's a natural fit for
  // global state since it can be toggled from both the list and detail page.
  favouriteIds: number[];

  // Listing display mode — kept global so it persists across navigating to
  // a product's detail page and back.
  viewMode: "table" | "card";

  // Session-local edits to API-fetched products (DummyJSON's PUT doesn't
  // persist server-side, same as its POST /products/add), keyed by id so
  // both the list and detail views can display the edited version.
  productOverrides: Record<number, Product>;
}

const initialState: ProductsState = {
  search: "",
  category: null,
  sort: null,
  page: 1,
  pageSize: 10,
  locallyAddedProducts: [],
  favouriteIds: [],
  viewMode: "card",
  productOverrides: {},
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1; // reset pagination whenever the query changes
    },
    setCategory(state, action: PayloadAction<string | null>) {
      state.category = action.payload;
      state.page = 1;
    },
    setSort(state, action: PayloadAction<SortOption | null>) {
      state.sort = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      state.page = 1;
    },
    addLocalProduct(state, action: PayloadAction<Product>) {
      state.locallyAddedProducts.unshift(action.payload);
    },
    toggleFavourite(state, action: PayloadAction<number>) {
      const id = action.payload;
      state.favouriteIds = state.favouriteIds.includes(id)
        ? state.favouriteIds.filter((favId) => favId !== id)
        : [...state.favouriteIds, id];
    },
    setViewMode(state, action: PayloadAction<"table" | "card">) {
      state.viewMode = action.payload;
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const updated = action.payload;
      const localIndex = state.locallyAddedProducts.findIndex((p) => p.id === updated.id);
      if (localIndex !== -1) {
        state.locallyAddedProducts[localIndex] = updated;
      } else {
        state.productOverrides[updated.id] = updated;
      }
    },
    resetFilters(state) {
      state.search = "";
      state.category = null;
      state.sort = null;
      state.page = 1;
    },
  },
});

export const {
  setSearch,
  setCategory,
  setSort,
  setPage,
  setPageSize,
  addLocalProduct,
  toggleFavourite,
  setViewMode,
  updateProduct,
  resetFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
