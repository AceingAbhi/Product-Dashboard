import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Product,
  ProductsResponse,
  NewProductPayload,
} from "../types/product";

const BASE_URL = "https://dummyjson.com";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    // GET /products?limit=&skip=  — paginated list
    getProducts: builder.query<
      ProductsResponse,
      { limit: number; skip: number }
    >({
      query: ({ limit, skip }) => `/products?limit=${limit}&skip=${skip}`,
      providesTags: ["Product"],
    }),

    // GET /products/search?q=  — used when a search term is active.
    // DummyJSON's search endpoint also supports limit/skip pagination.
    searchProducts: builder.query<
      ProductsResponse,
      { query: string; limit: number; skip: number }
    >({
      query: ({ query, limit, skip }) =>
        `/products/search?q=${encodeURIComponent(
          query
        )}&limit=${limit}&skip=${skip}`,
      providesTags: ["Product"],
    }),

    // GET /products/category/:category — used when a category filter is active
    // without a search term.
    getProductsByCategory: builder.query<
      ProductsResponse,
      { category: string; limit: number; skip: number }
    >({
      query: ({ category, limit, skip }) =>
        `/products/category/${encodeURIComponent(
          category
        )}?limit=${limit}&skip=${skip}`,
      providesTags: ["Product"],
    }),

    // GET /products/categories — list of category slugs
    getCategories: builder.query<string[], void>({
      query: () => "/products/categories",
      // DummyJSON returns an array of { slug, name, url } objects.
      // We normalise to a plain string[] of slugs for simpler consumption.
      transformResponse: (response: unknown): string[] => {
        if (Array.isArray(response) && typeof response[0] === "string") {
          return response as string[];
        }
        return (response as { slug: string }[]).map((c) => c.slug);
      },
    }),

    // GET /products/:id
    getProductById: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),

    // POST /products/add — DummyJSON simulates the add and echoes back
    // a product object with a new id, but does not persist it server-side.
    addProduct: builder.mutation<Product, NewProductPayload>({
      query: (body) => ({
        url: "/products/add",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      }),
    }),

    // PUT /products/:id — DummyJSON simulates the update and echoes back
    // the changed fields merged into the product, but does not persist it
    // server-side, same non-persistence caveat as /products/add.
    updateProduct: builder.mutation<Product, { id: number; body: NewProductPayload }>({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useSearchProductsQuery,
  useGetProductsByCategoryQuery,
  useGetCategoriesQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
} = productsApi;
