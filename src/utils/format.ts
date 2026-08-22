export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return "out-of-stock";
  if (stock <= 10) return "low-stock";
  return "in-stock";
}

export function stockStatusLabel(status: StockStatus): string {
  switch (status) {
    case "in-stock":
      return "In Stock";
    case "low-stock":
      return "Low Stock";
    case "out-of-stock":
      return "Out of Stock";
  }
}

export function stockStatusColor(status: StockStatus): string {
  switch (status) {
    case "in-stock":
      return "green";
    case "low-stock":
      return "orange";
    case "out-of-stock":
      return "red";
  }
}

/** Capitalises category slugs like "mens-shirts" -> "Mens Shirts" for display. */
export function formatCategoryLabel(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
