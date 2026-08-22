import { useMemo, useState, useCallback } from "react";
import { Pagination, Button, Alert, Segmented, App as AntApp } from "antd";
import { PlusOutlined, TableOutlined, AppstoreOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useUrlSyncedFilters } from "../hooks/useUrlSyncedFilters";
import {
  useGetProductsQuery,
  useSearchProductsQuery,
  useGetProductsByCategoryQuery,
  useGetCategoriesQuery,
} from "../services/productsApi";
import {
  setSearch,
  setCategory,
  setSort,
  setPage,
  addLocalProduct,
  toggleFavourite,
  setViewMode,
  resetFilters,
} from "../store/productsSlice";
import type { Product } from "../types/product";
import { formatCategoryLabel } from "../utils/format";
import ProductFilters from "../components/ProductFilters";
import ProductTable from "../components/ProductTable";
import ProductGrid from "../components/ProductGrid";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import AddProductModal from "../components/AddProductModal";
import PromoStrip from "../components/PromoStrip";
import SectionHeading from "../components/SectionHeading";

export default function ProductListPage() {
  const dispatch = useAppDispatch();
  const { message } = AntApp.useApp();
  const {
    search,
    category,
    sort,
    page,
    pageSize,
    locallyAddedProducts,
    favouriteIds,
    viewMode,
    productOverrides,
  } = useAppSelector((state) => state.products);

  const [addModalOpen, setAddModalOpen] = useState(false);

  // Debounce search input so we don't fire a request on every keystroke.
  const debouncedSearch = useDebouncedValue(search, 400);
  const skip = (page - 1) * pageSize;

  useUrlSyncedFilters({ search: debouncedSearch, category, sort, page }, dispatch);

  const hasSearch = debouncedSearch.trim().length > 0;
  const hasCategory = Boolean(category) && !hasSearch;

  // Only one of these three queries is actually active at a time
  // (`skip` option keeps RTK Query from firing the other two).
  const baseQuery = useGetProductsQuery(
    { limit: pageSize, skip },
    { skip: hasSearch || hasCategory }
  );
  const searchQuery = useSearchProductsQuery(
    { query: debouncedSearch, limit: pageSize, skip },
    { skip: !hasSearch }
  );
  const categoryQuery = useGetProductsByCategoryQuery(
    { category: category ?? "", limit: pageSize, skip },
    { skip: !hasCategory }
  );

  const activeQuery = hasSearch ? searchQuery : hasCategory ? categoryQuery : baseQuery;
  const { data, isFetching, isError, refetch } = activeQuery;

  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();

  // Locally-added products that match the current search/category filters,
  // so newly-added items are still discoverable through the same controls.
  const filteredLocalProducts = useMemo(() => {
    return locallyAddedProducts.filter((p) => {
      const matchesSearch = hasSearch
        ? p.title.toLowerCase().includes(debouncedSearch.toLowerCase())
        : true;
      const matchesCategory = category ? p.category === category : true;
      return matchesSearch && matchesCategory;
    });
  }, [locallyAddedProducts, hasSearch, debouncedSearch, category]);

  // Merge locally-added items onto page 1 only, ahead of API results, and
  // adjust the total count so pagination stays consistent. Session-local
  // edits (from the details page) are applied on top so they're reflected
  // here too.
  const products: Product[] = useMemo(() => {
    const apiProducts = data?.products ?? [];
    const merged =
      page !== 1 || filteredLocalProducts.length === 0
        ? apiProducts
        : [...filteredLocalProducts, ...apiProducts].slice(0, pageSize);
    return merged.map((p) => productOverrides[p.id] ?? p);
  }, [data, filteredLocalProducts, page, pageSize, productOverrides]);

  const sortedProducts = useMemo(() => {
    if (!sort) return products;
    const sorted = [...products].sort((a, b) => {
      const diff = a[sort.field] - b[sort.field];
      return sort.order === "asc" ? diff : -diff;
    });
    return sorted;
  }, [products, sort]);

  const total = (data?.total ?? 0) + (page === 1 ? filteredLocalProducts.length : 0);

  const handleToggleFavourite = useCallback(
    (id: number) => {
      const isCurrentlyFavourite = favouriteIds.includes(id);
      dispatch(toggleFavourite(id));
      message.success(isCurrentlyFavourite ? "Removed from favourites" : "Added to favourites");
    },
    [dispatch, favouriteIds, message]
  );

  const handleAddSuccess = (product: Product) => {
    dispatch(addLocalProduct(product));
  };

  const topRatedThumbnail = [...products].sort((a, b) => b.rating - a.rating)[0]?.thumbnail;
  const firstOtherCategory = categories.find((c) => c !== category) ?? categories[0];

  const promoCards = [
    {
      title: "Top Rated Picks",
      ctaLabel: "Shop Best Rated",
      imageUrl: topRatedThumbnail,
      onClick: () => dispatch(setSort({ field: "rating", order: "desc" })),
    },
    {
      title: firstOtherCategory ? `Explore ${formatCategoryLabel(firstOtherCategory)}` : "New Arrivals",
      ctaLabel: "Shop Now",
      imageUrl: products[1]?.thumbnail,
      onClick: () => dispatch(setCategory(firstOtherCategory ?? null)),
    },
  ];

  return (
    <div>
      <PromoStrip cards={promoCards} />

      <div id="product-grid-section">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <SectionHeading
          align="left"
          title="Our Products"
          subtitle="Browse our curated catalog across every category"
        />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Segmented
            className="view-toggle"
            value={viewMode}
            onChange={(value) => dispatch(setViewMode(value as "table" | "card"))}
            options={[
              { label: "Table", value: "table", icon: <TableOutlined /> },
              { label: "Cards", value: "card", icon: <AppstoreOutlined /> },
            ]}
            aria-label="Toggle between table and card view"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddModalOpen(true)}
          >
            Add Product
          </Button>
        </div>
      </div>

      <ProductFilters
        search={search}
        onSearchChange={(value) => dispatch(setSearch(value))}
        category={category}
        onCategoryChange={(value) => dispatch(setCategory(value))}
        categories={categories}
        categoriesLoading={categoriesLoading}
        sort={sort}
        onSortChange={(value) => dispatch(setSort(value))}
        onReset={() => dispatch(resetFilters())}
      />

      {sort && page !== 1 && (
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
          message="Sorting is applied within the current page of results."
        />
      )}

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : !isFetching && sortedProducts.length === 0 ? (
        <EmptyState
          description="No products match your search or filters."
          actionLabel="Reset filters"
          onAction={() => dispatch(resetFilters())}
        />
      ) : (
        <>
          {viewMode === "table" ? (
            <ProductTable
              products={sortedProducts}
              loading={isFetching}
              favouriteIds={favouriteIds}
              onToggleFavourite={handleToggleFavourite}
            />
          ) : (
            <ProductGrid
              products={sortedProducts}
              loading={isFetching}
              favouriteIds={favouriteIds}
              onToggleFavourite={handleToggleFavourite}
            />
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              showSizeChanger={false}
              onChange={(newPage) => dispatch(setPage(newPage))}
            />
          </div>
        </>
      )}
      </div>

      <AddProductModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}
