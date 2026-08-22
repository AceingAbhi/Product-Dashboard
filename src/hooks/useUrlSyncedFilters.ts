import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import type { AppDispatch } from "../store/store";
import { setSearch, setCategory, setSort, setPage } from "../store/productsSlice";
import type { SortField, SortOrder } from "../types/product";

interface UrlSyncedFiltersState {
  search: string;
  category: string | null;
  sort: { field: SortField; order: SortOrder } | null;
  page: number;
}

const SORT_FIELDS: SortField[] = ["price", "rating"];
const SORT_ORDERS: SortOrder[] = ["asc", "desc"];

// Keeps the URL query string and Redux filter state in sync: hydrates Redux
// from the URL once on mount (so a shared/refreshed link restores filters),
// then mirrors subsequent filter changes back onto the URL.
export function useUrlSyncedFilters(state: UrlSyncedFiltersState, dispatch: AppDispatch) {
  const [searchParams, setSearchParams] = useSearchParams();
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const urlSearch = searchParams.get("q");
    const urlCategory = searchParams.get("category");
    const urlSortField = searchParams.get("sortField");
    const urlSortOrder = searchParams.get("sortOrder");
    const urlPage = searchParams.get("page");

    if (urlSearch) dispatch(setSearch(urlSearch));
    if (urlCategory) dispatch(setCategory(urlCategory));
    if (
      urlSortField &&
      urlSortOrder &&
      SORT_FIELDS.includes(urlSortField as SortField) &&
      SORT_ORDERS.includes(urlSortOrder as SortOrder)
    ) {
      dispatch(setSort({ field: urlSortField as SortField, order: urlSortOrder as SortOrder }));
    }
    if (urlPage && Number(urlPage) > 1) dispatch(setPage(Number(urlPage)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;

    const params = new URLSearchParams();
    if (state.search) params.set("q", state.search);
    if (state.category) params.set("category", state.category);
    if (state.sort) {
      params.set("sortField", state.sort.field);
      params.set("sortOrder", state.sort.order);
    }
    if (state.page > 1) params.set("page", String(state.page));

    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.search, state.category, state.sort, state.page]);
}
