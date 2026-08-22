import { memo } from "react";
import { Input, Select, Row, Col, Button } from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import type { SortOption } from "../types/product";
import { formatCategoryLabel } from "../utils/format";

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string | null;
  onCategoryChange: (value: string | null) => void;
  categories: string[];
  categoriesLoading: boolean;
  sort: SortOption | null;
  onSortChange: (value: SortOption | null) => void;
  onReset: () => void;
}

const SORT_OPTIONS: { label: string; value: string; option: SortOption }[] = [
  { label: "Price: Low to High", value: "price-asc", option: { field: "price", order: "asc" } },
  { label: "Price: High to Low", value: "price-desc", option: { field: "price", order: "desc" } },
  { label: "Rating: Low to High", value: "rating-asc", option: { field: "rating", order: "asc" } },
  { label: "Rating: High to Low", value: "rating-desc", option: { field: "rating", order: "desc" } },
];

function ProductFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  categoriesLoading,
  sort,
  onSortChange,
  onReset,
}: ProductFiltersProps) {
  const sortValue = sort ? `${sort.field}-${sort.order}` : undefined;

  return (
    <Row gutter={[12, 12]} align="middle" style={{ marginBottom: 20 }}>
      <Col xs={24} sm={12} md={8}>
        <Input
          allowClear
          placeholder="Search products by name..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search products"
        />
      </Col>
      <Col xs={12} sm={6} md={5}>
        <Select
          allowClear
          placeholder="Category"
          style={{ width: "100%" }}
          value={category ?? undefined}
          loading={categoriesLoading}
          onChange={(value) => onCategoryChange(value ?? null)}
          aria-label="Filter by category"
          options={categories.map((c) => ({ label: formatCategoryLabel(c), value: c }))}
        />
      </Col>
      <Col xs={12} sm={6} md={5}>
        <Select
          allowClear
          placeholder="Sort by"
          style={{ width: "100%" }}
          value={sortValue}
          onChange={(value) => {
            const found = SORT_OPTIONS.find((o) => o.value === value);
            onSortChange(found ? found.option : null);
          }}
          aria-label="Sort products"
          options={SORT_OPTIONS.map((o) => ({ label: o.label, value: o.value }))}
        />
      </Col>
      <Col xs={24} sm={24} md={4}>
        <Button
          icon={<ClearOutlined />}
          onClick={onReset}
          block
          aria-label="Reset filters"
        >
          Reset
        </Button>
      </Col>
    </Row>
  );
}

// Memoised since this bar re-renders every time the parent re-fetches data;
// props only actually change on user interaction.
export default memo(ProductFilters);
